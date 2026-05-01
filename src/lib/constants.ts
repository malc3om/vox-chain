/**
 * Application Constants
 */

export const APP_NAME = "VoxChain";
export const APP_TAGLINE = "Understand your vote. Prove your eligibility. Trust nothing revealed.";
export const APP_DESCRIPTION = "AI-powered civic education assistant on Midnight Network with zero-knowledge proofs for privacy-first voter eligibility verification.";

export const MIDNIGHT_NETWORK = {
  name: "Midnight Network",
  url: "https://midnight.network",
  docsUrl: "https://docs.midnight.network",
  explorerUrl: "https://explorer.midnight.network",
} as const;

export const ROUTES = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/timeline", label: "Timeline", icon: "◈" },
  { href: "/ask", label: "Ask AI", icon: "◎" },
  { href: "/eligibility", label: "Eligibility", icon: "◇" },
  { href: "/quiz", label: "Quiz", icon: "△" },
] as const;

export const CIVIC_SOURCES = {
  archives: "archives.gov",
  usa: "usa.gov",
  eac: "eac.gov",
  vote: "vote.org",
  senate: "senate.gov",
  midnight: "midnight.network",
} as const;
