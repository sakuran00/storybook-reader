"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** サインアップ処理 */
export async function signup(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options:{
      data:{ nickname: name }
    }
  });
  console.error(error);

  if (error) {
    console.error("Signup Error:", error.message);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/auth/signup/before-confirm");
}
