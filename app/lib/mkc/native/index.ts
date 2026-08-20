/**
 * Maison Knowledge Catalogue — Native Record Registry
 *
 * All 93 records are the authoritative source for mkcCatalogue.
 *
 * Keys are slugs derived from the fragrance name:
 *   name.toLowerCase().replace(/\s+/g, "-")
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
import { poisonGirlInspired } from "./poison-girl-inspired";
import { devotionInspired } from "./devotion-inspired";
import { alienManInspired } from "./alien-man-inspired";
import { allureHommeSportInspired } from "./allure-homme-sport-inspired";
import { arabiansMuskInspired } from "./arabians-musk-inspired";
import { bleuDeChanelLexclusifInspired } from "./bleu-de-chanel-l'exclusif-inspired";
import { boisDargentInspired } from "./bois-d'argent-inspired";
import { brightCrystalInspired } from "./bright-crystal-inspired";
import { bvlgariAquaInspired } from "./bvlgari-aqua-inspired";
import { carminaInspired } from "./carmina-inspired";
import { chanceInspired } from "./chance-inspired";
import { coachFloralInspired } from "./coach-floral-inspired";
import { decisionInspired } from "./decision-inspired";
import { diorHommeSportInspired } from "./dior-homme-sport-inspired";
import { dunhillFreshInspired } from "./dunhill-fresh-inspired";
import { erosFlameInspired } from "./eros-flame-inspired";
import { freshBlossomInspired } from "./fresh-blossom-inspired";
import { gentlemanEdtInspired } from "./gentleman-edt-inspired";
import { godolphinInspired } from "./godolphin-inspired";
import { lightBlueInspired } from "./light-blue-inspired";
import { monGuerlainInspired } from "./mon-guerlain-inspired";
import { myWayYlangInspired } from "./my-way-ylang-inspired";
import { omniaGreenJadeInspired } from "./omnia-green-jade-inspired";
import { orianaInspired } from "./oriana-inspired";
import { roseOfNoMansLandInspired } from "./rose-of-no-man's-land-inspired";
import { roseOudInspired } from "./rose-oud-inspired";
import { royalOudInspired } from "./royal-oud-inspired";
import { siPassioneRedMuskInspired } from "./si-passione-red-musk-inspired";
import { spicebombDarkLeatherInspired } from "./spicebomb-dark-leather-inspired";
import { tobaccoVanilleInspired } from "./tobacco-vanille-inspired";
import { twillyDhermesInspired } from "./twilly-d'hermes-inspired";
import { voyageDhermesInspired } from "./voyage-d'hermes-inspired";
import { bloomInspired } from "./bloom-inspired";
import { h24HerbesVivesInspired } from "./h24-herbes-vives-inspired";
import { invictusVictoryAbsoluInspired } from "./invictus-victory-absolu-inspired";
import { libreFlowersFlamesFloraleInspired } from "./libre-flowers-flames-florale-inspired";
import { ombreLeatherInspired } from "./ombre-leather-inspired";
import { oudIspahanInspired } from "./oud-ispahan-inspired";
import { roseNRosesInspired } from "./rose-n'-roses-inspired";
import { taifRoseInspired } from "./taif-rose-inspired";
import { woodSageSeaSaltInspired } from "./wood-sage-sea-salt-inspired";
import { blackOpiumOverRedInspired } from "./black-opium-over-red-inspired";
import { peonyBlushSuedeInspired } from "./peony-blush-suede-inspired";
import { velvetRoseOudInspired } from "./velvet-rose-oud-inspired";
import { englishPearFreesiaInspired } from "./english-pear-freesia-inspired";
import { blackOrchidInspired } from "./black-orchid-inspired";
import { soleilBlancInspired } from "./soleil-blanc-inspired";
import { angelsShareInspired } from "./angels-share-inspired";
import { angelsShareParadisInspired } from "./angels-share-paradis-inspired";
import { goldOudInspired } from "./gold-oud-inspired";
import { oudBergamotInspired } from "./oud-bergamot-inspired";
import { khamrahInspired } from "./khamrah-inspired";
import { tuscanLeatherInspired } from "./tuscan-leather-inspired";
import { ladyMillionInspired } from "./lady-million-inspired";
import { idoleInspired } from "./idole-inspired";
import { fameInspired } from "./fame-inspired";
import { olympeaInspired } from "./olympea-inspired";
import { scandalInspired } from "./scandal-inspired";
import { laBelleInspired } from "./la-belle-inspired";
import { laNuitTresorInspired } from "./la-nuit-tresor-inspired";
import { narcisoRodriguezForHerInspired } from "./narciso-rodriguez-for-her-inspired";
import { dylanPurpleInspired } from "./dylan-purple-inspired";
import { yellowDiamondInspired } from "./yellow-diamond-inspired";
import { veryGoodGirlElixirInspired } from "./very-good-girl-elixir-inspired";
import { gucciGuiltyPourFemmeInspired } from "./gucci-guilty-pour-femme-inspired";
import { gucciBambooInspired } from "./gucci-bamboo-inspired";
import { eladariaInspired } from "./eladaria-inspired";
import { narcisoRougeInspired } from "./narciso-rouge-inspired";
import { edenSparklingLycheeInspired } from "./eden-sparkling-lychee-inspired";
import { lacosteNoirInspired } from "./lacoste-noir-inspired";
import { montblancLegendInspired } from "./montblanc-legend-inspired";
import { montblancExplorerInspired } from "./montblanc-explorer-inspired";
import { leauDisseyPourHommeInspired } from "./leau-dissey-pour-homme-inspired";
import { tomFordNoirInspired } from "./tom-ford-noir-inspired";
import { poloBlackInspired } from "./polo-black-inspired";
import { phantomInspired } from "./phantom-inspired";
import { bossBottledElixirInspired } from "./boss-bottled-elixir-inspired";
import { fahrenheitInspired } from "./fahrenheit-inspired";
import { amenFantasmInspired } from "./amen-fantasm-inspired";
import { leMaleInspired } from "./le-male-inspired";
import { gucciGuiltyPourHommeInspired } from "./gucci-guilty-pour-homme-inspired";
import { erosEnergyInspired } from "./eros-energy-inspired";

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
  ["poison-girl-inspired",        poisonGirlInspired],
  ["devotion-inspired",           devotionInspired],
  ["alien-man-inspired", alienManInspired],
  ["allure-homme-sport-inspired", allureHommeSportInspired],
  ["arabians-musk-inspired", arabiansMuskInspired],
  ["bleu-de-chanel-l'exclusif-inspired", bleuDeChanelLexclusifInspired],
  ["bois-d'argent-inspired", boisDargentInspired],
  ["bright-crystal-inspired", brightCrystalInspired],
  ["bvlgari-aqua-inspired", bvlgariAquaInspired],
  ["carmina-inspired", carminaInspired],
  ["chance-inspired", chanceInspired],
  ["coach-floral-inspired", coachFloralInspired],
  ["decision-inspired", decisionInspired],
  ["dior-homme-sport-inspired", diorHommeSportInspired],
  ["dunhill-fresh-inspired", dunhillFreshInspired],
  ["eros-flame-inspired", erosFlameInspired],
  ["fresh-blossom-inspired", freshBlossomInspired],
  ["gentleman-edt-inspired", gentlemanEdtInspired],
  ["godolphin-inspired", godolphinInspired],
  ["light-blue-inspired", lightBlueInspired],
  ["mon-guerlain-inspired", monGuerlainInspired],
  ["my-way-ylang-inspired", myWayYlangInspired],
  ["omnia-green-jade-inspired", omniaGreenJadeInspired],
  ["oriana-inspired", orianaInspired],
  ["rose-of-no-man's-land-inspired", roseOfNoMansLandInspired],
  ["rose-oud-inspired", roseOudInspired],
  ["royal-oud-inspired", royalOudInspired],
  ["si-passione-red-musk-inspired", siPassioneRedMuskInspired],
  ["spicebomb-dark-leather-inspired", spicebombDarkLeatherInspired],
  ["tobacco-vanille-inspired", tobaccoVanilleInspired],
  ["twilly-d'hermes-inspired", twillyDhermesInspired],
  ["voyage-d'hermes-inspired", voyageDhermesInspired],
  ["bloom-inspired", bloomInspired],
  ["h24-herbes-vives-inspired", h24HerbesVivesInspired],
  ["invictus-victory-absolu-inspired", invictusVictoryAbsoluInspired],
  ["libre-flowers-flames-florale-inspired", libreFlowersFlamesFloraleInspired],
  ["ombre-leather-inspired", ombreLeatherInspired],
  ["oud-ispahan-inspired", oudIspahanInspired],
  ["rose-n'-roses-inspired", roseNRosesInspired],
  ["taif-rose-inspired", taifRoseInspired],
  ["wood-sage-sea-salt-inspired", woodSageSeaSaltInspired],
  ["black-opium-over-red-inspired", blackOpiumOverRedInspired],
  ["peony-blush-suede-inspired", peonyBlushSuedeInspired],
  ["velvet-rose-oud-inspired", velvetRoseOudInspired],
  ["english-pear-freesia-inspired", englishPearFreesiaInspired],
  ["black-orchid-inspired", blackOrchidInspired],
  ["soleil-blanc-inspired", soleilBlancInspired],
  ["angels-share-inspired", angelsShareInspired],
  ["angels-share-paradis-inspired", angelsShareParadisInspired],
  ["gold-oud-inspired", goldOudInspired],
  ["oud-bergamot-inspired", oudBergamotInspired],
  ["khamrah-inspired", khamrahInspired],
  ["tuscan-leather-inspired", tuscanLeatherInspired],
  ["lady-million-inspired", ladyMillionInspired],
  ["idole-inspired", idoleInspired],
  ["fame-inspired", fameInspired],
  ["olympea-inspired", olympeaInspired],
  ["scandal-inspired", scandalInspired],
  ["la-belle-inspired", laBelleInspired],
  ["la-nuit-tresor-inspired", laNuitTresorInspired],
  ["narciso-rodriguez-for-her-inspired", narcisoRodriguezForHerInspired],
  ["dylan-purple-inspired", dylanPurpleInspired],
  ["yellow-diamond-inspired", yellowDiamondInspired],
  ["very-good-girl-elixir-inspired", veryGoodGirlElixirInspired],
  ["gucci-guilty-pour-femme-inspired", gucciGuiltyPourFemmeInspired],
  ["gucci-bamboo-inspired", gucciBambooInspired],
  ["eladaria-inspired", eladariaInspired],
  ["narciso-rouge-inspired", narcisoRougeInspired],
  ["eden-sparkling-lychee-inspired", edenSparklingLycheeInspired],
  ["lacoste-noir-inspired", lacosteNoirInspired],
  ["montblanc-legend-inspired", montblancLegendInspired],
  ["montblanc-explorer-inspired", montblancExplorerInspired],
  ["leau-dissey-pour-homme-inspired", leauDisseyPourHommeInspired],
  ["tom-ford-noir-inspired", tomFordNoirInspired],
  ["polo-black-inspired", poloBlackInspired],
  ["phantom-inspired", phantomInspired],
  ["boss-bottled-elixir-inspired", bossBottledElixirInspired],
  ["fahrenheit-inspired", fahrenheitInspired],
  ["amen-fantasm-inspired", amenFantasmInspired],
  ["le-male-inspired", leMaleInspired],
  ["gucci-guilty-pour-homme-inspired", gucciGuiltyPourHommeInspired],
  ["eros-energy-inspired", erosEnergyInspired],
]);
