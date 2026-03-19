import { describe, it, expect, vi, beforeEach } from "vitest";
import { addFavorite, removeFavorite, getFavoriteStatus } from "./favorite";

// 1. next/cache のモック
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// 2. データベース(Prisma) のモック
const mockPrisma = {
  favorite: {
    create: vi.fn(),
    delete: vi.fn(),
    findUnique: vi.fn(),
  },
};
vi.mock("@/db/client", () => ({
  prisma: mockPrisma,
}));

// 3. Supabaseのモック
const mockGetUser = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
  })),
}));

describe("Favorite Actions", () => {
  const mockUserId = "user-123";
  const mockBookId = "book-456";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("addFavorite", () => {
    it("ユーザーがログインしていない時はエラーを投げること", async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: null } });

      await expect(addFavorite(mockBookId)).rejects.toThrow("Unauthorized");
    });

    it("ログインしている場合はお気に入りを追加し、キャッシュを更新すること", async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: { id: mockUserId } } });
      mockPrisma.favorite.create.mockResolvedValueOnce({
        id: "fav-1",
        userId: mockUserId,
        bookId: mockBookId,
      });

      const result = await addFavorite(mockBookId);

      expect(mockPrisma.favorite.create).toHaveBeenCalledWith({
        data: { userId: mockUserId, bookId: mockBookId },
      });
      // 成功レスポンスが返ること
      expect(result).toEqual({ success: true });
    });
  });

  describe("removeFavorite", () => {
    it("ログインしている場合はお気に入りを削除し、キャッシュを更新すること", async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: { id: mockUserId } } });
      mockPrisma.favorite.delete.mockResolvedValueOnce({});

      const result = await removeFavorite(mockBookId);

      expect(mockPrisma.favorite.delete).toHaveBeenCalledWith({
        where: {
          userId_bookId: {
            userId: mockUserId,
            bookId: mockBookId,
          },
        },
      });
      expect(result).toEqual({ success: true });
    });
  });

  describe("getFavoriteStatus", () => {
    it("未ログインの場合は false を返すこと", async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: null } });

      const status = await getFavoriteStatus(mockBookId);
      expect(status).toBe(false);
    });

    it("お気に入りデータが存在する場合は true を返すこと", async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: { id: mockUserId } } });
      mockPrisma.favorite.findUnique.mockResolvedValueOnce({ id: "fav-1" });

      const status = await getFavoriteStatus(mockBookId);
      expect(status).toBe(true);
    });

    it("お気に入りデータが存在しない場合は false を返すこと", async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: { id: mockUserId } } });
      mockPrisma.favorite.findUnique.mockResolvedValueOnce(null);

      const status = await getFavoriteStatus(mockBookId);
      expect(status).toBe(false);
    });
  });
});
