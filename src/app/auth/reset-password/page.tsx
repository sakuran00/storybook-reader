import { ResetPasswordForm } from "@/components/ResetPassword";

export default async function ResetPasswordPage() {
  return (
    <div className="flex min-h-[calc(100dvh-88px)] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md rotate-[1.5deg]">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
