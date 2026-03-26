"use client";

import { useState } from "react";
import { updatePassword } from "@/app/auth/reset-password/action"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type LocalErrors = {
  password?: string;
  confirmPassword?: string;
};

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localErrors, setLocalErrors] = useState<LocalErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const validatePassword = (value: string) => {
    setLocalErrors((prev) => ({
      ...prev,
      password: value.length >= 6 ? undefined : "6文字以上で入力してください",
    }));
  };

  const validateConfirmPassword = (value: string) => {
    setLocalErrors((prev) => ({
      ...prev,
      confirmPassword:
        value === password ? undefined : "パスワードが一致しません",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (localErrors.password || localErrors.confirmPassword) return;

    setIsPending(true);
    setServerError(null);

    const formData = new FormData();
    formData.append("password", password);

    const result = await updatePassword(formData);

    if(result?.error){
      setServerError(result.error);
      setIsPending(false);
    }
    // 成功時は server action内で redirect("/")されるので何もしない
  };

  return (
    <Card className="font-zen-maru-gothic font-bold">
      <CardHeader>
        <CardTitle className="flex justify-center text-2xl">
          パスワード再設定
        </CardTitle>
      </CardHeader>
      <CardContent>
        {serverError && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="password">新しいパスワード</FieldLabel>
              <Input
                name="password"
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
              />
              {localErrors.password && (
                <p className="text-sm text-red-500 font-bold mt-1">
                  {localErrors.password}
                </p>
              )}
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
              {localErrors.confirmPassword && (
                <p className="text-sm text-red-500 font-bold mt-1">
                  {localErrors.confirmPassword}
                </p>
              )}
            </Field>
            <FieldGroup>
              <Field>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="hover:bg-slate-800/70"
                >
                  {isPending ? "更新中..." : "パスワードを更新する"}
                </Button>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
