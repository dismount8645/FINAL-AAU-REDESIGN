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


