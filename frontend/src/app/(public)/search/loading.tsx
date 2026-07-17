import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

export default function SearchLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <LoadingSkeleton variant="text" count={1} className="mb-6" />
      <LoadingSkeleton variant="card" count={4} />
    </div>
  );
}
