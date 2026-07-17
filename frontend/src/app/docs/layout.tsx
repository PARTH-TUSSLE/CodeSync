import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DocsShell } from "@/components/docs/DocsShell";
import "@/app/docs/styles.css";

export const metadata: Metadata = {
  title: "Documentation - CodeSync",
  description:
    "Learn how to use CodeSync — from getting started to advanced features.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <DocsShell>{children}</DocsShell>
      <Footer />
    </>
  );
}
