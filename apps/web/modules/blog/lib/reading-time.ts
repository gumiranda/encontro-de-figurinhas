export function calculateReadingTime(sanitizedHtml: string): number {
  const text = sanitizedHtml.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
