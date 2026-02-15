import { SignupForm } from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-xl">
        <SignupForm />
      </div>
    </div>
  );
}
