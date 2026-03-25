"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/app/auth/forgot-password/action";
import SubmitButton from "../ui/SubmitButton";

interface ResetPasswordFormProps {
  sent?: boolean;
}

export default function ForgotPasswordForm({ sent }: ResetPasswordFormProps) {
  return (
    <Card className="font-zen-maru-gothic font-bold">
      <CardHeader>
        <CardTitle className="flex justify-center text-2xl">
          パスワードの再設定
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sent ? (
          <p className="text-center text-sm text-slate-600">
            メールを送信しました。受信ボックスをご確認ください。
          </p>
        ) : (
          <form action={forgotPassword}>
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
                <SubmitButton />
              </Field>
            </FieldGroup>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
