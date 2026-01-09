// SEO utilities for SNReady

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://snready.com";

/**
 * Generate a canonical URL for a given path
 */
export function getCanonicalUrl(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_URL}${normalizedPath}`;
}

/**
 * Truncate text for meta descriptions or titles
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3).trim() + "...";
}
