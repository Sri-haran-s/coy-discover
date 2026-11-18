import { MapPin } from "lucide-react";
import type { MatchItem } from "@/types";
import { SmartImage } from "@/components/ui/SmartImage";
import { InterestTags } from "@/components/profile/InterestTags";
import { formatRelativeTime } from "@/lib/utils";

/** One mutual match: photo on top, details and match status below. */
export function MatchCard({ match }: { match: MatchItem }) {
  const { profile } = match;

  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink/5 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/5]">
        <SmartImage
          src={profile.photoUrl}
          alt={`Portrait of ${profile.name}`}
          fallbackName={profile.name}
          imgClassName="transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
      </div>

      <div className="space-y-2.5 p-4">
        <div className="flex items-baseline gap-2">
          <h3 className="truncate font-display text-xl font-semibold tracking-tight">{profile.name}</h3>
          <span className="text-lg font-light text-ink-muted">{profile.age}</span>
        </div>

        <p className="flex items-center gap-1.5 text-sm text-ink-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="truncate">{profile.city}</span>
        </p>

        <InterestTags interests={profile.interests} tone="soft" max={2} className="hidden sm:flex" />

        <p className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          Mutual match · {formatRelativeTime(match.matchedAt)}
        </p>
      </div>
    </article>
  );
}
