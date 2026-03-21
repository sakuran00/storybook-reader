"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** サインイン処理 */
export async function signin(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error(error);
    if (error.code === "invalid_credentials")
      redirect(
        "/auth/signin?error=" +
          encodeURIComponent(
            "メールアドレスまたはパスワードが正しくありません",
          ),
      );
    throw new Error(`認証エラー: ${error.message}`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}
