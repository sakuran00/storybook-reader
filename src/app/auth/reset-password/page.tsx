import { ResetPasswordForm } from "@/components/ResetPassword";

export default async function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-xl">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
