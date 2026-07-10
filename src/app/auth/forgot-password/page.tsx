import ForgotPasswordForm from "@/components/ForgotPassword";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[calc(100dvh-88px)] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md -rotate-1">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
