import { LandingNav } from "@/components/layout/LandingNav";
import { LandingFooter } from "@/components/layout/LandingFooter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingNav />
      <main className="flex-1">{children}</main>
      <LandingFooter />
    </>
  );
}
