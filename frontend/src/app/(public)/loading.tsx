import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

export default function PublicLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <LoadingSkeleton variant="card" count={4} />
    </div>
  );
}
