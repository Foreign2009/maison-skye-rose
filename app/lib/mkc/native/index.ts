/**
 * Maison Knowledge Catalogue — Native Record Registry
 *
 * Native records are authored FragranceKnowledge entries that take precedence
 * over the hydrateFromDisplay() adapter fallback in catalogue.ts. Add records
 * here as each fragrance is migrated to the native format.
 *
 * Keys are slugs matching the id formula in adaptFragrance():
 *   title.toLowerCase().replace(/\s+/g, "-")
 *
 * Example: "Sauvage Inspired" → "sauvage-inspired"
 */

import type { FragranceKnowledge } from "../types";
import { sauvageInspired } from "./sauvage-inspired";
import { aventusInspired } from "./aventus-inspired";
import { bleuDeChanelInspired } from "./bleu-de-chanel-inspired";
import { aquaDiGioInspired } from "./aqua-di-gio-inspired";
import { yInspired } from "./y-inspired";
import { erosInspired } from "./eros-inspired";
import { hacivatInspired } from "./hacivat-inspired";
import { terreDHermesInspired } from "./terre-d'hermes-inspired";
import { spicebombExtremeInspired } from "./spicebomb-extreme-inspired";
import { pradaLHommeInspired } from "./prada-l'homme-inspired";
import { laytonInspired } from "./layton-inspired";

export const nativeFragrances = new Map<string, FragranceKnowledge>([
  ["sauvage-inspired",           sauvageInspired],
  ["aventus-inspired",           aventusInspired],
  ["bleu-de-chanel-inspired",    bleuDeChanelInspired],
  ["aqua-di-gio-inspired",       aquaDiGioInspired],
  ["y-inspired",                 yInspired],
  ["eros-inspired",              erosInspired],
  ["hacivat-inspired",           hacivatInspired],
  ["terre-d'hermes-inspired",    terreDHermesInspired],
  ["spicebomb-extreme-inspired", spicebombExtremeInspired],
  ["prada-l'homme-inspired",     pradaLHommeInspired],
  ["layton-inspired",            laytonInspired],
]);
