import type { Metadata } from "next";
import { ChangePasswordForm } from "@/components/user/ChangePasswordForm";

export const metadata: Metadata = {
  title: "Change Password — CodeSync",
};

export default async function ChangePasswordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          Change Password
        </h1>
        <p className="mt-1 text-sm text-muted">
          Update your account password. You&apos;ll need your current password to make changes.
        </p>
      </div>

      <div className="rounded-xl border border-glass-border bg-surface-elevated p-6 sm:p-8">
        <ChangePasswordForm userId={id} />
      </div>
    </div>
  );
}
