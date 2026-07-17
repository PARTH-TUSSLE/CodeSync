import type { Metadata } from "next";
import Link from "next/link";
import { LandingHero } from "./LandingHero";
import { LandingFeatures } from "./LandingFeatures";
import { LandingTerminal } from "./LandingTerminal";
import { LandingCTA } from "./LandingCTA";

export const metadata: Metadata = {
  title: "CodeSync - Git-Inspired Version Control",
  description:
    "Sync your code, track issues, and visualize contributions with CodeSync. Modern version control for the modern developer.",
};

export default function HomePage() {
  return (
    <>
      <LandingHero />
      <LandingFeatures />
      <LandingTerminal />
      <LandingCTA />
    </>
  );
}
