"use client"

import { Button } from "@/components/ui/button";
import { Zen_Kaku_Gothic_New, Zen_Maru_Gothic } from 'next/font/google'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
}  from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import React from "react";

interface SigninFormProps {
  onSubmit?: (data: { email: string; password: string }) => void;
}

const zenKaku = Zen_Kaku_Gothic_New({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

const zenMaru = Zen_Maru_Gothic({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export function SigninForm({ onSubmit }: SigninFormProps): React.ReactElement {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    onSubmit?.({ email, password});
  };

  return(
  <Card className={zenKaku.className}>
      <CardHeader>
        <CardTitle className="flex justify-center text-2xl font-bold">サインイン</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">メールアドレス</FieldLabel>
              <Input
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
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">サインイン</Button>
                <Button variant="outline" type="button">
                  Googleでサインイン
                </Button>
                <FieldDescription className="text-sm text-center">
                  パスワードがわからない方は <a href="#">こちら</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
