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
import { laytonInspired }         from "./layton-inspired";
import { ultraMaleInspired }      from "./ultra-male-inspired";
import { sauvageElixirInspired }  from "./sauvage-elixir-inspired";
import { yEdpInspired }           from "./y-edp-inspired";
import { naxosInspired }                from "./naxos-inspired";
import { sideEffectInspired }           from "./side-effect-inspired";
import { godOfFireInspired }            from "./god-of-fire-inspired";
import { delinaInspired }               from "./delina-inspired";
import { baccaratRouge540Inspired }     from "./baccarat-rouge-540-inspired";
import { imaginationInspired }          from "./imagination-inspired";
import { strongerWithYouInspired }      from "./stronger-with-you-inspired";
import { oudWoodInspired }              from "./oud-wood-inspired";
import { invictusInspired }             from "./invictus-inspired";

export const nativeFragrances = new Map<string, FragranceKnowledge>([
  ["sauvage-inspired",              sauvageInspired],
  ["aventus-inspired",              aventusInspired],
  ["bleu-de-chanel-inspired",       bleuDeChanelInspired],
  ["aqua-di-gio-inspired",          aquaDiGioInspired],
  ["y-inspired",                    yInspired],
  ["eros-inspired",                 erosInspired],
  ["hacivat-inspired",              hacivatInspired],
  ["terre-d'hermes-inspired",       terreDHermesInspired],
  ["spicebomb-extreme-inspired",    spicebombExtremeInspired],
  ["prada-l'homme-inspired",        pradaLHommeInspired],
  ["layton-inspired",               laytonInspired],
  ["ultra-male-inspired",           ultraMaleInspired],
  ["sauvage-elixir-inspired",       sauvageElixirInspired],
  ["y-edp-inspired",                yEdpInspired],
  ["naxos-inspired",                naxosInspired],
  ["side-effect-inspired",          sideEffectInspired],
  ["god-of-fire-inspired",          godOfFireInspired],
  ["delina-inspired",               delinaInspired],
  ["baccarat-rouge-540-inspired",   baccaratRouge540Inspired],
  ["imagination-inspired",          imaginationInspired],
  ["stronger-with-you-inspired",    strongerWithYouInspired],
  ["oud-wood-inspired",             oudWoodInspired],
  ["invictus-inspired",             invictusInspired],
]);
