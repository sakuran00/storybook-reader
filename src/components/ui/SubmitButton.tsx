import { useFormStatus } from "react-dom";
import { Button } from "./button";

export default function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "送信中..." : "再設定メール送信"}
    </Button>
  );
}
