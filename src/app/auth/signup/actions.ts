"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signupSchema } from "./schema";

export type SignupState = {
  errors?: {
    nickname?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

/** サインアップ処理 */
export async function signup(
  prevState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const supabase = await createClient();

  // zodでバリデーションを行う
  const validateFields = signupSchema.safeParse({
    nickname: formData.get("nickname"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // バリデーションエラーがある場合はエラーメッセージを返す
  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: "入力内容にエラーがあります",
    };
  }

  // 成功ならsupabaseへ登録
  const { nickname, email, password } = validateFields.data;
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nickname } },
  });

  if (error) {
    if (
      error.message.toLowerCase().includes("already registered") ||
      error.message.toLowerCase().includes("already exists") ||
      error.message.toLowerCase().includes("email already")
    ) {
      return {
        message:
          "このメールアドレスはすでに登録されています。サインインしてください。",
      };
    }
    return { message: `登録に失敗しました。(${error.message})` };
  }

  revalidatePath("/", "layout");
  redirect("/");
  // メール認証の実装が完了したら、以下のようにメール送信後のメッセージを返すようにする
  // redirect("/auth/signup/before-confirm")
}
