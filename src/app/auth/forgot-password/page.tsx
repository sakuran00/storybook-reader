import ForgotPasswordForm from "@/components/ForgotPassword";

type SearchParams = Promise<{ sent?: string }>;

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { sent } = await searchParams;

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-xl">
        <ForgotPasswordForm sent={!!sent} />
      </div>
    </div>
  );
}
