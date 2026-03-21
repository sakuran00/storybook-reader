import { z } from "zod";

export const signupSchema = z.object({
  nickname: z.string().min(1, { message: "ニックネームを入力してください" }),
  email: z.email({ message: "有効なメールアドレスを入力してください" }),
  password: z
    .string()
    .min(6, { message: "パスワードは6文字以上である必要があります" }),
});
