import { Skeleton } from "@/components/ui/Skeleton";

/** Placeholder with the same silhouette as a profile card. */
export function DeckSkeleton() {
  return (
    <div className="relative h-full w-full" role="status" aria-label="Loading profiles">
      <Skeleton className="absolute inset-0 rounded-[28px]" />
      <div className="absolute inset-x-0 bottom-0 space-y-3 p-6">
        <div className="h-8 w-44 rounded-full bg-white/70" />
        <div className="h-3.5 w-32 rounded-full bg-white/60" />
        <div className="h-3.5 w-full rounded-full bg-white/50" />
        <div className="flex gap-2 pt-1">
          <div className="h-7 w-20 rounded-full bg-white/60" />
          <div className="h-7 w-24 rounded-full bg-white/60" />
          <div className="h-7 w-16 rounded-full bg-white/60" />
        </div>
      </div>
    </div>
  );
}
