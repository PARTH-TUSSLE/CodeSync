"use client";

import { useState } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel: () => void;
  requireTyping?: string | null;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
  requireTyping,
}: ConfirmDialogProps) {
  const [typedValue, setTypedValue] = useState("");

  if (!open) return null;

  const canConfirm = requireTyping ? typedValue === requireTyping : true;

  const variantStyles = {
    danger:
      "bg-warm hover:bg-warm/80",
    warning:
      "bg-amber-600 hover:bg-amber-700",
    info: "bg-accent hover:bg-accent/80",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md glass-card p-6">
        <h3 className="text-lg font-semibold text-primary">
          {title}
        </h3>
        <p className="mt-2 text-sm text-muted">
          {message}
        </p>
        {requireTyping && (
          <div className="mt-4">
            <p className="mb-1 text-xs text-muted">
              Type <span className="font-mono font-medium text-primary">{requireTyping}</span> to confirm:
            </p>
            <input
              type="text"
              value={typedValue}
              onChange={(e) => setTypedValue(e.target.value)}
              className="glass-input w-full px-3 py-1.5 text-sm"
              autoFocus
            />
          </div>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="btn-ghost px-4 py-2 text-sm"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={!canConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${variantStyles[variant]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
