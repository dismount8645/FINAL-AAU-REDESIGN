import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * `cn` er en wrapper omkring `clsx` + `tailwind-merge`.
 * Den fjerner duplikerede Tailwind‑klasser og håndterer betinget
 * klassesammensætning på tværs af komponenter.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Konverterer et tal (px) til en Tailwind‑spacing‑token, hvis muligt.
 * F.eks. `8` → `var(--space-xs)`, `16` → `var(--space-md)`.
 * Returnerer den originale værdi, hvis ingen token matcher.
 */
export function toSpaceToken(px: number): string {
  const map: Record<number, string> = {
    4: "var(--space-2xs)",
    8: "var(--space-xs)",
    12: "var(--space-sm)",
    16: "var(--space-md)",
    24: "var(--space-lg)",
    32: "var(--space-xl)",
    40: "var(--space-2xl)",
    48: "var(--space-3xl)",
  };
  return map[px] ?? `${px}px`;
}

/**
 * Returnerer en CSS‑variabel for en AAU‑brand‑farve.
 * Bruges i komponenter, hvor farven kan skifte dynamisk (fx badge‑variant).
 *
 * @param name   Navnet på farven (primary, secondary, success, danger, warning, gold)
 * @param opacity 0‑1, hvor 1 betyder fuld opacity
 */
export function getAauColor(name: string, opacity = 1): string {
  const colors: Record<string, string> = {
    primary: "var(--aau-blue)",
    secondary: "var(--aau-light-blue)",
    success: "var(--aau-dark-green)",
    danger: "var(--aau-dark-pink)",
    warning: "var(--aau-dark-orange)",
    gold: "var(--aau-light-orange)",
  };
  const base = colors[name] ?? "var(--aau-blue)";
  return opacity === 1 ? base : `rgba(${base}, ${opacity})`;
}
