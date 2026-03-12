import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import BookCard from './BookCard';
import { useRouter } from 'next/navigation';

// === モックの設定 ===

// 1. next/navigation (useRouter) のモック
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// 2. next/font/google のモック (フォント読み込みエラーを防ぐ)
vi.mock('next/font/google', () => ({
  Zen_Maru_Gothic: () => ({
    className: 'mocked-font-class',
  }),
}));

// 3. next/image のモック
vi.mock('next/image', () => ({
  default: (props: React.ComponentProps<'img'>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

// 4. FavoriteButton のモック (内部のロジックが干渉しないようにする)
vi.mock('./FavoriteButton', () => ({
  default: () => <button data-testid="mock-favorite-button">Favorite</button>,
}));

describe('BookCard Component', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // useRouterが返すpush関数をモックする
    (useRouter as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
    });
    // タイマーをモック化（setTimeout用）
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const defaultProps = {
    id: 'test-book-id',
    title: 'テストの絵本',
    subtitle: 'テストのサブタイトル',
    coverImageUrl: '/test-image.jpg',
  };

  it('正しくレンダリングされること（表紙モード）', () => {
    render(<BookCard {...defaultProps} />);
    
    // 画像がレンダリングされているか
    const img = screen.getByAltText('テストの絵本');
    expect(img).toBeInTheDocument();
    
    // お気に入りボタンがレンダリングされているか
    expect(screen.getByTestId('mock-favorite-button')).toBeInTheDocument();
  });

  it('disabledがtrueのときはグレーアウトされ、お気に入りボタンが表示されないこと', () => {
    render(<BookCard {...defaultProps} disabled={true} />);
    
    // お気に入りボタンが存在しないことを確認
    expect(screen.queryByTestId('mock-favorite-button')).not.toBeInTheDocument();
  });

  it('ドラッグ中 (isDragging=true) はクリックしても遷移処理が呼ばれないこと', () => {
    render(<BookCard {...defaultProps} isDragging={true} />);
    
    const link = screen.getByRole('link');
    fireEvent.click(link);
    
    // isDraggingなのでアニメーションやタイマーが作動しないはず
    vi.runAllTimers();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('クリックするとアニメーションが開始され、800ms後にルーター遷移すること', () => {
    render(<BookCard {...defaultProps} />);
    
    const link = screen.getByRole('link');
    fireEvent.click(link);
    
    // クリック直後はまだpushされていない
    expect(mockPush).not.toHaveBeenCalled();
    
    // 800ミリ秒時間を進める
    vi.advanceTimersByTime(800);
    
    // 800ms後に遷移関数が呼ばれたか
    expect(mockPush).toHaveBeenCalledWith('/books/test-book-id');
  });
});
