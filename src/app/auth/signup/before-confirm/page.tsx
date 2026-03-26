import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// メール送信完了画面
export default function BeforeConfirmPage() {
  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10 md:mt-40">
      <div className="w-full max-w-xl">
        <Card className="font-zen-maru-gothic">
          <CardHeader>
            <CardTitle className="flex justify-center text-2xl font-bold">
              メール送信完了
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm leading-8">
              メールを送信しました。
              <br />
              受信ボックスのリンクをクリックして登録を完了してください。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
