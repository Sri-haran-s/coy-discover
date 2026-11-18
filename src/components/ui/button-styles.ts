import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "onDark";
export type ButtonSize = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium select-none " +
  "transition duration-200 ease-out active:scale-[0.97] " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-rose-500 text-white shadow-glow hover:bg-rose-600 hover:-translate-y-px",
  secondary:
    "bg-white text-ink ring-1 ring-ink/10 shadow-soft hover:ring-ink/20 hover:-translate-y-px",
  ghost: "text-ink-soft hover:bg-ink/5",
  onDark: "bg-white/10 text-white ring-1 ring-white/25 backdrop-blur hover:bg-white/20",
};

const sizes: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-[15px]",
};

/** Class string for anything that should look like a button (links included). */
export function buttonStyles(
  options: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {},
): string {
  const { variant = "primary", size = "md", className } = options;
  return cn(base, variants[variant], sizes[size], className);
}
