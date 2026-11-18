import { Logo } from "@/components/ui/Logo";
import { BottomNav } from "./BottomNav";
import { DesktopNav } from "./DesktopNav";

/** Soft blush glows behind the content. Decorative only. */
function BackgroundDecoration() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-32 -top-40 h-[28rem] w-[28rem] rounded-full bg-blush/70 blur-3xl" />
      <div className="absolute -right-24 top-1/3 h-[24rem] w-[24rem] rounded-full bg-rose-100/60 blur-3xl" />
      <div className="absolute -bottom-40 left-1/4 h-[22rem] w-[22rem] rounded-full bg-cream-300/70 blur-3xl" />
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <BackgroundDecoration />

      <header className="pt-safe sticky top-0 z-30 bg-cream-100/75 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 md:h-16">
          <Logo />
          <DesktopNav />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-3 pb-28 pt-2 sm:px-6 md:pb-14">{children}</main>

      <BottomNav />
    </div>
  );
}
