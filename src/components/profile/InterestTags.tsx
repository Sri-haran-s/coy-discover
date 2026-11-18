import { cn } from "@/lib/utils";

interface InterestTagsProps {
  interests: string[];
  /** "glass" sits on photos; "soft" sits on light surfaces. */
  tone?: "glass" | "soft";
  max?: number;
  className?: string;
}

export function InterestTags({ interests, tone = "glass", max = 4, className }: InterestTagsProps) {
  if (interests.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label="Interests">
      {interests.slice(0, max).map((interest) => (
        <li
          key={interest}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium",
            tone === "glass"
              ? "bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-md"
              : "bg-cream-200 text-ink-soft",
          )}
        >
          {interest}
        </li>
      ))}
    </ul>
  );
}
