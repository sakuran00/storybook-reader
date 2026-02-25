"use client";

import { Button } from "@/components/ui/button";
import { Zen_Kaku_Gothic_New, Zen_Maru_Gothic } from "next/font/google";
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
  onSubmit?: (data: { email: string; password: string }) => void;
}

const zenKaku = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const zenMaru = Zen_Maru_Gothic({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export function SigninForm({ onSubmit }: SigninFormProps): React.ReactElement {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const googleSigninHandler = () => {
    const supabase = createClient();
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <Card className={zenKaku.className}>
      <CardHeader>
        <CardTitle className="flex justify-center text-2xl font-bold ">
          サインイン
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={signin}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">メールアドレス</FieldLabel>
              <Input
                name="email"
                id="email"
                type="email"
                placeholder="ichiro_suzuki@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">パスワード</FieldLabel>
              <Input
                name="password"
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" className="hover:cursor-pointer hover:">
                  サインイン
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={googleSigninHandler}
                  className="hover:cursor-pointer"
                >
                  Googleでサインイン
                </Button>
                <FieldDescription className="text-sm text-center">
                  パスワードがわからない方は{" "}
                  <a href="/auth/forgot-password">こちら</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
