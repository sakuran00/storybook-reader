"use client";

import { useActionState } from "react";
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
import { signup, SignupState } from "@/app/auth/signup/actions";
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

const initialState: SignupState = { message: null, errors: {} };

export function SignupForm({ onSubmit }: SignupFormProps): React.ReactElement {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [state, formAction, isPending] = useActionState(signup, initialState);

  return (
    <Card className={zenKaku.className}>
      <CardHeader>
        <CardTitle className="flex justify-center text-2xl font-bold">
          アカウント作成
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="nickname">ニックネーム</FieldLabel>
              <Input
                name="nickname"
                id="nickname"
                type="text"
                placeholder="さくら"
              />
              {state?.errors?.nickname && (
                <p className="text-sm text-red-500 font-bold mt-1">
                  {state.errors.nickname[0]}
                </p>
              )}
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
              />
              {state?.errors?.email && (
                <p className="text-sm text-red-500 font-bold mt-1">
                  {state.errors.email[0]}
                </p>
              )}
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
              />
              {state?.errors?.password && (
                <p className="text-sm text-red-500 font-bold mt-1">
                  {state.errors.password[0]}
                </p>
              )}
              <FieldDescription className="text-sm">
                6文字以上で、数字を含めてください。
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
              />
              <FieldDescription>
                パスワードを確認してください。
              </FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "登録中..." : "アカウント作成"}
                </Button>
                {state?.message && (
                  <p className="text-sm text-red-500 text-center mt-2 font-bold">
                    {state.message}
                  </p>
                )}
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
