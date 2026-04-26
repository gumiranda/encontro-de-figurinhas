"use client";

import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

const KEY_STORAGE = "blog-view-key";
const KEY_MINTED = "blog-view-key-at";
const ROTATE_MS = 7 * 24 * 60 * 60 * 1000;
const DEBOUNCE_MS = 5000;

function getOrMintKey(): string {
  const now = Date.now();
  const mintedAt = Number(localStorage.getItem(KEY_MINTED) ?? 0);
  let key = localStorage.getItem(KEY_STORAGE);
  if (!key || now - mintedAt > ROTATE_MS) {
    key = crypto.randomUUID();
    localStorage.setItem(KEY_STORAGE, key);
    localStorage.setItem(KEY_MINTED, String(now));
  }
  return key;
}

interface ViewTrackerProps {
  slug: string;
}

export function ViewTracker({ slug }: ViewTrackerProps) {
  const incrementView = useMutation(api.blog.incrementView);

  useEffect(() => {
    const sessionKey = `seen:${slug}`;
    if (sessionStorage.getItem(sessionKey)) return;

    const timeout = setTimeout(() => {
      const idempotencyKey = getOrMintKey();
      incrementView({ slug, idempotencyKey })
        .then(() => sessionStorage.setItem(sessionKey, "1"))
        .catch(() => {});
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [slug, incrementView]);

  return null;
}
