interface IssueStatusBadgeProps {
  status: "open" | "closed";
}

export function IssueStatusBadge({ status }: IssueStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        status === "open"
          ? "badge-green"
          : "badge-red"
      }`}
    >
      <span
        className={`size-2 rounded-full ${
          status === "open" ? "bg-emerald" : "bg-warm"
        }`}
      />
      {status === "open" ? "Open" : "Closed"}
    </span>
  );
}
