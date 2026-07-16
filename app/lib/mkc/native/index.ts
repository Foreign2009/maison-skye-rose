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
import { leMaleElixirInspired }         from "./le-male-elixir-inspired";
import { oneMillionInspired }           from "./1-million-inspired";
import { hawasInspired }                from "./hawas-inspired";
import { ninePmInspired }               from "./9pm-inspired";
import { strongerWithYouIntenselyInspired } from "./stronger-with-you-intensely-inspired";
import { leBeauParadiseGardenInspired }     from "./le-beau-paradise-garden-inspired";
import { azzaroMostWantedInspired }         from "./azzaro-most-wanted-inspired";
import { valentinoUomoBornInRomaInspired }  from "./valentino-uomo-born-in-roma-inspired";
import { myslfInspired }                    from "./myslf-inspired";
import { acquaDiGioProfondoInspired }       from "./acqua-di-gio-profondo-inspired";
import { acquaDiGioParfumInspired }         from "./acqua-di-gio-parfum-inspired";
import { pradaLunaRossaCarbonInspired }     from "./prada-luna-rossa-carbon-inspired";
import { invictusVictoryInspired }          from "./invictus-victory-inspired";
import { armaniCodeParfumInspired }         from "./armani-code-parfum-inspired";
import { afternoonSwimInspired } from "./afternoon-swim-inspired";
import { missDiorInspired } from "./miss-dior-inspired";
import { alienGoddessInspired } from "./alien-goddess-inspired";
import { alienInspired } from "./alien-inspired";
import { althairInspired } from "./althair-inspired";
import { aniInspired } from "./ani-inspired";
import { arabiansTonkaInspired } from "./arabians-tonka-inspired";
import { armaniSiInspired } from "./armani-si-inspired";
import { baccaratRouge540ExtraitInspired } from "./baccarat-rouge-540-extrait-inspired";
import { blackOpiumInspired } from "./black-opium-inspired";
import { blancheBeteInspired } from "./blanche-bete-inspired";
import { burberryGoddessInspired } from "./burberry-goddess-inspired";
import { burberryHerInspired } from "./burberry-her-inspired";
import { carlisleInspired } from "./carlisle-inspired";
import { chanceEauTendreInspired } from "./chance-eau-tendre-inspired";
import { cocoMademoiselleInspired } from "./coco-mademoiselle-inspired";
import { creedGreenIrishTweedInspired } from "./creed-green-irish-tweed-inspired";
import { crystalNoirInspired } from "./crystal-noir-inspired";
import { delinaExclusifInspired } from "./delina-exclusif-inspired";
import { erbaPuraInspired } from "./erba-pura-inspired";
import { flowerbombInspired } from "./flowerbomb-inspired";
import { kayaliVanilla28Inspired } from "./kayali-vanilla-28-inspired";
import { kirkeOverdoseInspired } from "./kirke-overdose-inspired";
import { limmensiteInspired } from "./l'immensite-inspired";
import { laVieEstBelleInspired } from "./la-vie-est-belle-inspired";
import { libreInspired } from "./libre-inspired";
import { libreIntenseInspired } from "./libre-intense-inspired";
import { libreLeParfumInspired } from "./libre-le-parfum-inspired";
import { loveDontBeShyInspired } from "./love-don't-be-shy-inspired";
import { monParisInspired } from "./mon-paris-inspired";
import { myWayInspired } from "./my-way-inspired";
import { ombreNomadeInspired } from "./ombre-nomade-inspired";
import { oudForGreatnessInspired } from "./oud-for-greatness-inspired";
import { oudMoodInspired } from "./oud-mood-inspired";
import { pacificChillInspired } from "./pacific-chill-inspired";
import { pradaParadoxeInspired } from "./prada-paradoxe-inspired";
import { rollingInLoveInspired } from "./rolling-in-love-inspired";
import { silverMountainWaterInspired } from "./silver-mountain-water-inspired";
import { torino21Inspired } from "./torino21-inspired";
import { valentinoDonnaBornInRomaInspired } from "./valentino-donna-born-in-roma-inspired";
import { vanilla28Inspired } from "./vanilla-28-inspired";
import { veryGoodGirlInspired } from "./very-good-girl-inspired";
import { weddingSilkSantalInspired } from "./wedding-silk-santal-inspired";
import { gentleFluidityGoldInspired } from "./gentle-fluidity-gold-inspired";
import { goodGirlBlushInspired } from "./good-girl-blush-inspired";
import { goodGirlInspired } from "./good-girl-inspired";
import { grisCharnelInspired } from "./gris-charnel-inspired";
import { guidanceInspired } from "./guidance-inspired";
import { haltaneInspired } from "./haltane-inspired";
import { hibiscusMahajadInspired } from "./hibiscus-mahajad-inspired";
import { jadoreInspired } from "./j'adore-inspired";
import { hypnoticPoisonInspired } from "./hypnotic-poison-inspired";
import { biancoLatteInspired } from "./bianco-latte-inspired";
import { chanceEauFraicheInspired } from "./chance-eau-fraiche-inspired";

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
  ["le-male-elixir-inspired",                 leMaleElixirInspired],
  ["1-million-inspired",                      oneMillionInspired],
  ["hawas-inspired",                          hawasInspired],
  ["9pm-inspired",                            ninePmInspired],
  ["stronger-with-you-intensely-inspired",    strongerWithYouIntenselyInspired],
  ["le-beau-paradise-garden-inspired",        leBeauParadiseGardenInspired],
  ["azzaro-most-wanted-inspired",             azzaroMostWantedInspired],
  ["valentino-uomo-born-in-roma-inspired",    valentinoUomoBornInRomaInspired],
  ["myslf-inspired",                          myslfInspired],
  ["acqua-di-gio-profondo-inspired",          acquaDiGioProfondoInspired],
  ["acqua-di-gio-parfum-inspired",            acquaDiGioParfumInspired],
  ["prada-luna-rossa-carbon-inspired",        pradaLunaRossaCarbonInspired],
  ["invictus-victory-inspired",               invictusVictoryInspired],
  ["armani-code-parfum-inspired",             armaniCodeParfumInspired],
  ["afternoon-swim-inspired", afternoonSwimInspired],
  ["miss-dior-inspired", missDiorInspired],
  ["alien-goddess-inspired", alienGoddessInspired],
  ["alien-inspired", alienInspired],
  ["althair-inspired", althairInspired],
  ["ani-inspired", aniInspired],
  ["arabians-tonka-inspired", arabiansTonkaInspired],
  ["armani-si-inspired", armaniSiInspired],
  ["baccarat-rouge-540-extrait-inspired", baccaratRouge540ExtraitInspired],
  ["black-opium-inspired", blackOpiumInspired],
  ["blanche-bete-inspired", blancheBeteInspired],
  ["burberry-goddess-inspired", burberryGoddessInspired],
  ["burberry-her-inspired", burberryHerInspired],
  ["carlisle-inspired", carlisleInspired],
  ["chance-eau-tendre-inspired", chanceEauTendreInspired],
  ["coco-mademoiselle-inspired", cocoMademoiselleInspired],
  ["creed-green-irish-tweed-inspired", creedGreenIrishTweedInspired],
  ["crystal-noir-inspired", crystalNoirInspired],
  ["delina-exclusif-inspired", delinaExclusifInspired],
  ["erba-pura-inspired", erbaPuraInspired],
  ["flowerbomb-inspired", flowerbombInspired],
  ["kayali-vanilla-28-inspired", kayaliVanilla28Inspired],
  ["kirke-overdose-inspired", kirkeOverdoseInspired],
  ["l'immensite-inspired", limmensiteInspired],
  ["la-vie-est-belle-inspired", laVieEstBelleInspired],
  ["libre-inspired", libreInspired],
  ["libre-intense-inspired", libreIntenseInspired],
  ["libre-le-parfum-inspired", libreLeParfumInspired],
  ["love-don't-be-shy-inspired", loveDontBeShyInspired],
  ["mon-paris-inspired", monParisInspired],
  ["my-way-inspired", myWayInspired],
  ["ombre-nomade-inspired", ombreNomadeInspired],
  ["oud-for-greatness-inspired", oudForGreatnessInspired],
  ["oud-mood-inspired", oudMoodInspired],
  ["pacific-chill-inspired", pacificChillInspired],
  ["prada-paradoxe-inspired", pradaParadoxeInspired],
  ["rolling-in-love-inspired", rollingInLoveInspired],
  ["silver-mountain-water-inspired", silverMountainWaterInspired],
  ["torino21-inspired", torino21Inspired],
  ["valentino-donna-born-in-roma-inspired", valentinoDonnaBornInRomaInspired],
  ["vanilla-28-inspired", vanilla28Inspired],
  ["very-good-girl-inspired", veryGoodGirlInspired],
  ["wedding-silk-santal-inspired", weddingSilkSantalInspired],
  ["gentle-fluidity-gold-inspired", gentleFluidityGoldInspired],
  ["good-girl-blush-inspired", goodGirlBlushInspired],
  ["good-girl-inspired", goodGirlInspired],
  ["gris-charnel-inspired", grisCharnelInspired],
  ["guidance-inspired", guidanceInspired],
  ["haltane-inspired", haltaneInspired],
  ["hibiscus-mahajad-inspired", hibiscusMahajadInspired],
  ["j'adore-inspired", jadoreInspired],
  ["hypnotic-poison-inspired", hypnoticPoisonInspired],
  ["bianco-latte-inspired",       biancoLatteInspired],
  ["chance-eau-fraiche-inspired", chanceEauFraicheInspired],
]);
