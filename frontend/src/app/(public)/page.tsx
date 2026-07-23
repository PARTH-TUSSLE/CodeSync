import type { Metadata } from "next";
import { LandingHero } from "./LandingHero";
import { LandingShowcase } from "./LandingShowcase";
import { LandingCLI } from "./LandingCLI";
import { LandingFeatures } from "./LandingFeatures";
import { LandingCTA } from "./LandingCTA";

export const metadata: Metadata = {
  title: "CodeSync — Git-Inspired Version Control",
  description:
    "Sync your code, track issues, and visualize contributions with CodeSync. Modern version control for the modern developer.",
};

export default function HomePage() {
  return (
    <>
      <LandingHero />
      <LandingShowcase />
      <LandingCLI />
      <LandingFeatures />
      <LandingCTA />
    </>
  );
}
