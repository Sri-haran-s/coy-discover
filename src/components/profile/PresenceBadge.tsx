import type { Presence } from "@/types";
import { cn } from "@/lib/utils";

const LABELS: Record<Exclude<Presence, "offline">, string> = {
  online: "Active now",
  recent: "Active today",
};

/** Small glass pill shown over photos. Renders nothing for offline profiles. */
export function PresenceBadge({ presence }: { presence: Presence }) {
  if (presence === "offline") return null;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/30 px-2.5 py-1 text-xs font-medium text-white ring-1 ring-white/20 backdrop-blur-md">
      <span
        aria-hidden
        className={cn(
          "h-2 w-2 rounded-full",
          presence === "online" ? "bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.3)]" : "bg-amber-300",
        )}
      />
      {LABELS[presence]}
    </span>
  );
}
