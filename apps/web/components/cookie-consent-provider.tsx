"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

type ConsentStatus = "accepted" | "rejected" | null;

interface CookieConsentContextValue {
  consentStatus: ConsentStatus;
  isLoading: boolean;
  acceptCookies: () => void;
  rejectCookies: () => void;
  resetConsent: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null
);

const STORAGE_KEY = "cookie-consent";

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "accepted" || stored === "rejected") {
      setConsentStatus(stored);
    }
    setIsLoading(false);
  }, []);

  const acceptCookies = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setConsentStatus("accepted");
  }, []);

  const rejectCookies = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "rejected");
    setConsentStatus("rejected");
  }, []);

  const resetConsent = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setConsentStatus(null);
  }, []);

  return (
    <CookieConsentContext.Provider
      value={{
        consentStatus,
        isLoading,
        acceptCookies,
        rejectCookies,
        resetConsent,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error(
      "useCookieConsent must be used within CookieConsentProvider"
    );
  }
  return context;
}
