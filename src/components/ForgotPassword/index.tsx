"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const email = new FormData(e.currentTarget).get("email") as string;
    const supabase = createClient();
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/callback?next=/auth/reset-password`,
    });
    setSent(true);
    setIsPending(false);
  };

  return (
    <Card className="font-zen-maru-gothic font-bold">
      <CardHeader>
        <CardTitle className="flex justify-center text-2xl">
          パスワード再設定
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sent ? (
          <p className="text-center text-sm ">
            メールを送信しました。受信ボックスをご確認ください。
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">メールアドレス</FieldLabel>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="ichiro_suzuki@example.com"
                  required
                />
              </Field>
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "送信中..." : "再設定メール送信"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
