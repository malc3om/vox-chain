"use client";

import { WalletProvider } from "@/components/wallet/WalletProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import type { ReactNode } from "react";

/**
 * Client-side providers wrapper.
 * Wraps children with all context providers needed by the app.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WalletProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </WalletProvider>
  );
}
