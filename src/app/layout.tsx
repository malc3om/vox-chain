import type { Metadata } from "next";
import { Suspense } from "react";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Loading from "./loading";
import Providers from "./providers";
import Navbar from "@/components/layout/Navbar";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "VoxChain — LayerZero-Style Civic Education",
  description:
    "Understand your vote. Prove your eligibility. Trust nothing revealed. Privacy-first election education powered by Midnight Network zero-knowledge proofs.",
  keywords: [
    "election",
    "civic education",
    "zero knowledge proof",
    "Midnight Network",
    "voter eligibility",
    "blockchain",
    "privacy",
  ],
  openGraph: {
    title: "VoxChain — Civic Education on Web3",
    description:
      "Understand your vote. Prove your eligibility. Trust nothing revealed.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-bg-deep text-text-primary antialiased selection:bg-white/20 selection:text-white">
        <Providers>
          <div className="fixed inset-0 bg-grid-premium pointer-events-none z-0" />
          <div className="ambient-glow top-[-20%] left-[-10%]" />
          <div className="ambient-glow bottom-[-20%] right-[-10%] opacity-50" />

          {/* Skip to main content — keyboard / screen reader accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-white focus:text-black focus:font-medium focus:text-sm"
          >
            Skip to main content
          </a>

          {/* Navbar */}
          <Navbar />

          {/* Main Content */}
          <main id="main-content" className="flex-1 relative z-10">
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </main>

          {/* Footer */}
          <footer className="relative z-10 border-t border-border py-12 px-[var(--spacing-page)] bg-bg-surface mt-24">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-text-muted text-sm tracking-wide">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border border-text-secondary rounded-full flex items-center justify-center opacity-70" />
                <span className="font-heading text-text-primary font-medium tracking-widest uppercase">
                  VOXCHAIN
                </span>
              </div>
              <div className="flex gap-8">
                <a
                  href="https://midnight.network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-text-primary transition-colors"
                >
                  POWERED BY MIDNIGHT
                </a>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
