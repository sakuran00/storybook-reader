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
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/callback?next=/auth/reset-password`,
    });
    setSent(true);
    setIsPending(false);
  };

  return (
    <Card className="font-zen-maru-gothic font-bold bg-washi border-linen shadow-[0_28px_50px_-16px_rgba(58,42,24,0.4),0_3px_8px_rgba(58,42,24,0.12)]">
      <CardHeader>
        <CardTitle className="flex justify-center font-klee font-semibold text-2xl text-ink tracking-[0.1em]">
          パスワードをわすれたら
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sent ? (
          <div className="rounded-[4px] bg-cream border border-butter px-5 py-4 font-klee font-semibold text-sm text-ochre leading-loose text-center">
            メールをおくったよ！
            <br />
            とどいたリンクから
            <br />
            あたらしいパスワードをつくってね
          </div>
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
                <Button
                  type="submit"
                  disabled={isPending}
                  className="rounded-full h-12 bg-ink text-washi font-black hover:bg-cocoa"
                >
                  {isPending ? "送信中..." : "メールをおくる"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
