import { hashString } from "./utils";

// Warm gradient pairs [light, deep] — keeps fallbacks on-brand.
const PALETTES: Array<[string, string]> = [
  ["#F9D5CF", "#E8536A"],
  ["#FBE3C8", "#E7915B"],
  ["#F4D6E4", "#B65C8A"],
  ["#E6DCF3", "#7A62B5"],
  ["#D8E8E0", "#4F8F78"],
  ["#F6E6B8", "#C99A2E"],
];

/**
 * Self-contained SVG portrait (as a data URI) shown when a photo fails to load.
 * No network request, so it can never fail itself.
 */
export function fallbackAvatar(name: string): string {
  const [light, deep] = PALETTES[hashString(name) % PALETTES.length];
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${light}"/><stop offset="1" stop-color="${deep}"/>` +
    `</linearGradient></defs>` +
    `<rect width="400" height="500" fill="url(#g)"/>` +
    `<circle cx="200" cy="215" r="92" fill="rgba(255,255,255,0.28)"/>` +
    `<text x="200" y="244" text-anchor="middle" font-family="Georgia, serif" ` +
    `font-size="84" font-style="italic" fill="#ffffff">${initials}</text>` +
    `</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
