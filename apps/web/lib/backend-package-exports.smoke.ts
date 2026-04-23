/**
 * Smoke file: ensures `@workspace/backend/lib/*` package exports resolve (pnpm typecheck).
 * Not imported by the app runtime.
 */
import type { ConfidenceStatus } from "@workspace/backend/lib/confidence-status";
import { resolveConfidenceStatus } from "@workspace/backend/lib/confidence-status";
import { SAFETY_AUTO_SUSPEND_THRESHOLD, SAFETY_CATEGORIES } from "@workspace/backend/lib/report-severity";

const _status: ConfidenceStatus = resolveConfidenceStatus(5);
void _status;
void SAFETY_CATEGORIES;
void SAFETY_AUTO_SUSPEND_THRESHOLD;

export {};
