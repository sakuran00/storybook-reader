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
import { signupSchema } from "@/app/auth/signup/schema";

const initialState: SignupState = { message: null, errors: {} };

type LocalErrors = {
  nickname?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export function SignupForm(): React.ReactElement {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [localErrors, setLocalErrors] = React.useState<LocalErrors>({});

  const [state, formAction, isPending] = useActionState(signup, initialState);

  const validateField = (
    name: keyof typeof signupSchema.shape,
    value: string,
  ) => {
    const result = signupSchema.shape[name].safeParse(value);
    setLocalErrors((prev) => ({
      ...prev,
      [name]: result.success ? undefined : result.error.issues[0].message,
    }));
  };

  const validateConfirmPassword = (value: string) => {
    setLocalErrors((prev) => ({
      ...prev,
      confirmPassword:
        value === password ? undefined : "パスワードが一致しません",
    }));
  };

  // サーバーエラーを優先、なければローカルエラーを表示
  const errors = {
    nickname: state?.errors?.nickname?.[0] ?? localErrors.nickname,
    email: state?.errors?.email?.[0] ?? localErrors.email,
    password: state?.errors?.password?.[0] ?? localErrors.password,
    confirmPassword: localErrors.confirmPassword,
  };

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
        <form action={formAction} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="nickname">ニックネーム</FieldLabel>
              <Input
                name="nickname"
                id="nickname"
                type="text"
                placeholder="さくら"
                onChange={(e) => validateField("nickname", e.target.value)}
              />
              {errors.nickname && (
                <p className="text-sm text-red-500 font-bold mt-1">
                  {errors.nickname}
                </p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="email">メールアドレス</FieldLabel>
              <Input
                name="email"
                id="email"
                type="text"
                placeholder="sakura@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateField("email", e.target.value);
                }}
              />
              {errors.email && (
                <p className="text-sm text-red-500 font-bold mt-1">
                  {errors.email}
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  validateField("password", e.target.value);
                }}
              />
              {errors.password && (
                <p className="text-sm text-red-500 font-bold mt-1">
                  {errors.password}
                </p>
              )}
              <FieldDescription className="text-sm">
                6文字以上で入力してください。
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">パスワード確認</FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  validateConfirmPassword(e.target.value);
                }}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 font-bold mt-1">
                  {errors.confirmPassword}
                </p>
              )}
              <FieldDescription>
                パスワードを確認してください。
              </FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="hover:bg-slate-800/70"
                >
                  {isPending ? "登録中..." : "登録"}
                </Button>
                <FieldDescription className="text-sm text-center">
                  既にアカウントをお持ちの方は{" "}
                  <a href="/auth/signin">こちら</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
