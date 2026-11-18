import type { Metadata } from "next";
import { MatchesView } from "@/components/match/MatchesView";

export const metadata: Metadata = { title: "Matches" };

export default function MatchesPage() {
  return <MatchesView />;
}
