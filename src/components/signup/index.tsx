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
import { signup } from "@/app/auth/signup/actions";
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
  const [confirmPassword, setConfirmPassword] = React.useState("");

  return (
    <Card className={zenKaku.className}>
      <CardHeader>
        <CardTitle className="flex justify-center text-2xl font-bold">
          アカウント作成
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={signup}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="nickname">ニックネーム</FieldLabel>
              <Input
                name="nickname"
                id="nickname"
                type="text"
                placeholder="さくら"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">メールアドレス</FieldLabel>
              <Input
                name="email"
                id="email"
                type="email"
                placeholder="sakura@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">パスワード</FieldLabel>
              <Input
                name="password"
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FieldDescription className="text-sm">
                8文字以上で、数字を含めてください。
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">パスワード確認</FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <FieldDescription>
                パスワードを確認してください。
              </FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">アカウント作成</Button>
                <FieldDescription className="text-sm text-center">
                  すでにアカウントをお持ちですか？{" "}
                  <a href="/auth/signin">サインイン</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
