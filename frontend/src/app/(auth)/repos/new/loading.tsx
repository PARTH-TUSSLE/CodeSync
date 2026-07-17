import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

export default function CreateRepoLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <LoadingSkeleton variant="text" count={1} className="mb-6" />
      <LoadingSkeleton variant="text" count={6} className="mb-4" />
    </div>
  );
}
