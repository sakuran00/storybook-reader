"use client";

import { useActionState } from "react";
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
import { signup, SignupState } from "@/app/auth/signup/actions";
interface SignupFormProps {
  onSubmit?: (data: { email: string; password: string }) => void;
}

const initialState: SignupState = { message: null, errors: {} };

export function SignupForm({ onSubmit }: SignupFormProps): React.ReactElement {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [state, formAction, isPending] = useActionState(signup, initialState);

  return (
    <Card className="font-zen-maru-gothic font-bold">
      <CardHeader>
        <CardTitle className="flex justify-center text-2xl">
          サインアップ
        </CardTitle>
      </CardHeader>
      <CardContent>
        {state?.message && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {state.message}
          </div>
        )}
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
                <Button type="submit" disabled={isPending} className="hover:cursor-pointer hover:bg-slate-800/70">
                  {isPending ? "登録中..." : "登録"}
                </Button>
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
