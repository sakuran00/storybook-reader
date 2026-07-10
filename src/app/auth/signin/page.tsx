import { SigninForm } from "@/components/signin";

type SearchParams = Promise<{ error?: string }>;

export default async function SigninPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-[calc(100dvh-88px)] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md -rotate-[1.5deg]">
        <SigninForm error={error} />
      </div>
    </div>
  );
}
