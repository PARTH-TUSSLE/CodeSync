interface VisibilityBadgeProps {
  isPublic: boolean;
}

export function VisibilityBadge({ isPublic }: VisibilityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        isPublic
          ? "badge-green"
          : "badge-amber"
      }`}
    >
      {isPublic ? "Public" : "Private"}
    </span>
  );
}
