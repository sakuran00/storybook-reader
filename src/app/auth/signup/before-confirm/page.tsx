import PageTitle from "@/components/PageTitle";

// メール送信完了画面
export default function BeforeConfirmPage(){
  return(
    <>
    <PageTitle title="メール送信完了" />
    <p>メールを送信しました。メールのリンクをクリックして登録を完了してください。</p>
    </>
  )
}