"use client";

import * as React from "react";
import { ConvexProvider } from "convex/react";
import { browserConvex } from "@/lib/convex-browser-client";

export function PublicProviders({ children }: { children: React.ReactNode }) {
  return <ConvexProvider client={browserConvex}>{children}</ConvexProvider>;
}
