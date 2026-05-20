import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ClerkSignInPanel } from "../components/auth/ClerkSignInPanel";

export const metadata = {
  title: "로그인 | 키리키리",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen max-w-[480px] mx-auto bg-[#F8F7FF] px-5 py-10">
      <Link
        href="/"
        className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        목록
      </Link>

      <div className="mt-8">
        <ClerkSignInPanel />
      </div>
    </div>
  );
}
