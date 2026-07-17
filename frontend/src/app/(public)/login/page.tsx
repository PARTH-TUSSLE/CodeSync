import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in — CodeSync",
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="glass-card p-8">
          <div className="mb-2 text-center">
            <span className="font-mono text-xs text-accent">~/sign-in</span>
          </div>
          <h1 className="mb-6 text-center text-2xl font-bold text-primary">Sign in</h1>
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-accent transition-colors hover:text-accent-soft"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
