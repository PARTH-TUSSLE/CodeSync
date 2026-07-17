import { cn } from "@/lib/cn";

interface AvatarProps {
  src?: string | null;
  username: string;
  size?: "sm" | "md" | "lg" | "xl" | "xxl";
}

const sizeClasses = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
  xl: "size-20 text-2xl",
  xxl: "size-28 text-3xl",
};

export function Avatar({ src, username, size = "md" }: AvatarProps) {
  const initial = username.charAt(0).toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={`${username}'s avatar`}
        className={cn(
          "rounded-full object-cover ring-2 ring-glass-border ring-offset-2 ring-offset-surface",
          sizeClasses[size],
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-surface-tertiary to-surface-elevated font-semibold text-primary ring-2 ring-glass-border ring-offset-2 ring-offset-surface",
        sizeClasses[size],
      )}
    >
      {initial}
    </div>
  );
}
