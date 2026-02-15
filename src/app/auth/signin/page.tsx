import { SigninForm } from "@/components/SigninForm"


export default function SigninPage() {

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-xl">
        <SigninForm />
      </div>
    </div>
  )
}
