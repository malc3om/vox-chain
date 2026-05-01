"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { LanguageCode } from "@/lib/google/translate";

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  isTranslating: boolean;
  translateText: (text: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "en",
  setLanguage: () => {},
  isTranslating: false,
  translateText: async (text: string) => text,
});

const STORAGE_KEY = "voxchain_language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [isTranslating, setIsTranslating] = useState(false);

  // Restore language preference from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setLanguageState(stored as LanguageCode);
      }
    } catch {
      // localStorage unavailable (SSR or privacy mode)
    }
  }, []);

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Silent fallback
    }
  }, []);

  const translateText = useCallback(
    async (text: string): Promise<string> => {
      if (language === "en" || !text.trim()) return text;

      setIsTranslating(true);
      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, targetLang: language }),
        });

        if (!response.ok) return text;

        const data = await response.json();
        return data.translatedText ?? text;
      } catch {
        return text;
      } finally {
        setIsTranslating(false);
      }
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, isTranslating, translateText }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
