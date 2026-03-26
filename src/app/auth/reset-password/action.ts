"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function updatePassword(formData: FormData) {
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error("updateUser error:", error);
    if (error.code === "same_password") {
      return { error: "すでに設定されているパスワードです" };
    }
    return { error: "パスワードの更新に失敗しました" };
  }

  redirect("/");
}
