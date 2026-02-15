"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** サインアップ処理 */
export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);
  console.error(error);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/auth/signup/before-confirm");
}
