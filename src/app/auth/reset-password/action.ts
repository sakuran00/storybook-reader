"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const supabase = await createClient();
  const siteUrl = process.env.Next_PUBLIC_SITE_URL == "http://localhost:3000";

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "${siteUrl}/auth/callback?next=/auth/reset-password",
  });

  // メールが存在しない場合も同じ画面にする
  redirect("/auth/forgot-password?sent=true");
}
