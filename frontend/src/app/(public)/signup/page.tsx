import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create account — CodeSync",
};

export default function SignupPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="glass-card p-8">
          <div className="mb-2 text-center">
            <span className="font-mono text-xs text-accent">~/sign-up</span>
          </div>
          <h1 className="mb-6 text-center text-2xl font-bold text-primary">Create account</h1>
          <SignupForm />
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-accent transition-colors hover:text-accent-soft"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
