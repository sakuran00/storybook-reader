"use client";

import { Button } from "@/components/ui/button";
import { Zen_Kaku_Gothic_New, Zen_Maru_Gothic } from "next/font/google";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React from "react";
import { signup } from "@/app/auth/signup/actions";
import { createClient } from "@/lib/supabase/client";

interface SignupFormProps {
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

export function SignupForm({ onSubmit }: SignupFormProps): React.ReactElement {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.({ email, password });
  };

  return (
    <Card className={zenKaku.className}>
      <CardHeader>
        <CardTitle className="flex justify-center text-2xl font-bold">
          アカウント作成
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} action={signup}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">ニックネーム</FieldLabel>
              <Input id="name" type="text" placeholder="さくら" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">メールアドレス</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="ichiro_suzuki@example.com"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">パスワード</FieldLabel>
              <Input id="password" type="password" required />
              <FieldDescription className="text-sm">
                8文字以上で、数字を含めてください。
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">パスワード確認</FieldLabel>
              <Input id="confirm-password" type="password" required />
              <FieldDescription>
                パスワードを確認してください。
              </FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">アカウント作成</Button>
                <FieldDescription className="text-sm text-center">
                  すでにアカウントをお持ちですか？ <a href="#">サインイン</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
