import { MapPin } from "lucide-react";
import type { PublicProfile } from "@/types";
import { SmartImage } from "@/components/ui/SmartImage";
import { InterestTags } from "./InterestTags";
import { PresenceBadge } from "./PresenceBadge";

/** The visual profile card: photo-first, details layered over a soft gradient. */
export function ProfileCard({ profile, priority = false }: { profile: PublicProfile; priority?: boolean }) {
  const { name, age, photoUrl, city, college, bio, interests, presence } = profile;

  return (
    <article className="relative h-full w-full overflow-hidden rounded-[28px] bg-cream-200 shadow-card ring-1 ring-black/5">
      <SmartImage
        src={photoUrl}
        alt={`Portrait of ${name}`}
        fallbackName={name}
        priority={priority}
        className="absolute inset-0"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[68%] bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

      <div className="absolute left-4 top-4">
        <PresenceBadge presence={presence} />
      </div>

      <div className="absolute inset-x-0 bottom-0 space-y-2.5 p-5 text-white sm:p-6">
        <div className="flex items-baseline gap-2.5">
          <h2 className="font-display text-[1.9rem] font-semibold leading-none tracking-tight sm:text-[2.1rem]">
            {name}
          </h2>
          <span className="text-2xl font-light text-white/90">{age}</span>
        </div>

        <p className="flex items-center gap-1.5 text-sm text-white/85">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="truncate">
            {city}
            {college && <span className="text-white/60"> · {college}</span>}
          </span>
        </p>

        <p className="line-clamp-2 text-[15px] leading-relaxed text-white/90 sm:line-clamp-3">{bio}</p>

        <InterestTags interests={interests} max={4} />
      </div>
    </article>
  );
}
