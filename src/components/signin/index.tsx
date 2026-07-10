"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React from "react";
import { signin } from "@/app/auth/signin/actions";
import { createClient } from "@/lib/supabase/client";

interface SigninFormProps {
  error?: string;
}

export function SigninForm({ error }: SigninFormProps): React.ReactElement {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const googleSigninHandler = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        skipBrowserRedirect: false,
      },
    });
    if (error) console.error("Google サインインエラー:", error);
  };

  return (
    <Card className="font-zen-maru-gothic font-bold bg-washi border-linen shadow-[0_28px_50px_-16px_rgba(58,42,24,0.4),0_3px_8px_rgba(58,42,24,0.12)]">
      <CardHeader>
        <CardTitle className="flex justify-center font-klee font-semibold text-2xl text-ink tracking-[0.1em]">
          おかえりなさい
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-md bg-[#fbeee6] border border-clay/40 px-4 py-3 text-sm text-clay">
            {error}
          </div>
        )}
        <form action={signin}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email" className="text-taupe">
                メールアドレス
              </FieldLabel>
              <Input
                name="email"
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-khaki bg-transparent"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password" className="text-taupe">
                パスワード
              </FieldLabel>
              <Input
                name="password"
                id="password"
                type="password"
                placeholder="8もじ いじょう"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-khaki bg-transparent"
              />
            </Field>
            <FieldGroup>
              <Field>
                <Button
                  type="submit"
                  className="rounded-full h-12 bg-ink text-washi font-black hover:bg-cocoa"
                >
                  サインイン
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={googleSigninHandler}
                  className="rounded-full h-12 border-khaki text-cocoa bg-transparent hover:bg-paper hover:cursor-pointer"
                >
                  Googleでサインイン
                </Button>
                <FieldDescription className="text-sm text-center text-sand leading-relaxed">
                  パスワードがわからない方は{" "}
                  <a href="/auth/forgot-password" className="text-caramel">
                    こちら
                  </a>
                  <br />
                  はじめての方は{" "}
                  <a href="/auth/signup" className="text-caramel">
                    新規登録
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
