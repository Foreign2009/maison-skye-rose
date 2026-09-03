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
import { oudSapparotInspired } from "./oud-sapparot-inspired";
import { abuDhabiInspired } from "./abu-dhabi-inspired";
import { cinqueTerreInspired } from "./cinque-terre-inspired";
import { figLotusFlowerInspired } from "./fig-lotus-flower-inspired";
import { torino24Inspired } from "./torino24-inspired";
import { outlandsInspired } from "./outlands-inspired";
import { centaurusInspired } from "./centaurus-inspired";
import { grapefruitInspired } from "./grapefruit-inspired";
import { darkVanillaInspired } from "./dark-vanilla-inspired";
import { armaniPriveOudRoyalInspired } from "./armani-prive-oud-royal-inspired";
import { myWayNectarInspired } from "./my-way-nectar-inspired";
import { changingConstanceInspired } from "./changing-constance-inspired";
import { queenOfSilkInspired } from "./queen-of-silk-inspired";
import { chanelNo5Inspired } from "./chanel-no-5-inspired";
import { gabrielleInspired } from "./gabrielle-inspired";
import { attrapeRevesInspired } from "./attrape-reves-inspired";
import { omniaCrystallineInspired } from "./omnia-crystalline-inspired";
import { valayaExclusifInspired } from "./valaya-exclusif-inspired";
import { crazyInLoveInspired } from "./crazy-in-love-inspired";
import { aLaRoseInspired } from "./a-la-rose-inspired";
import { lightBluePourHommeInspired } from "./light-blue-pour-homme-inspired";
import { boisPacifiqueInspired } from "./bois-pacifique-inspired";
import { egoistePlatinumInspired } from "./egoiste-platinum-inspired";
import { burberryLondonInspired } from "./burberry-london-inspired";
import { eternityInspired } from "./eternity-inspired";
import { bvlgariBlackInspired } from "./bvlgari-black-inspired";
import { _212VipBlackInspired } from "./212-vip-black-inspired";
import { aqvaAmaraInspired } from "./aqva-amara-inspired";
import { scandalPourHommeInspired } from "./scandal-pour-homme-inspired";
import { lacosteBlancInspired } from "./lacoste-blanc-inspired";
import { creedDelphinusInspired } from "./creed-delphinus-inspired";
import { aquaAllegoriaRosaVerdeInspired } from "./aqua-allegoria-rosa-verde-inspired";
import { vanillaPowderInspired } from "./vanilla-powder-inspired";
import { beachBlossomInspired } from "./beach-blossom-inspired";
import { ckOneInspired } from "./ck-one-inspired";
import { oudCadenzaInspired } from "./oud-cadenza-inspired";
import { coolWaterInspired } from "./cool-water-inspired";
import { dylanBlueInspired } from "./dylan-blue-inspired";
import { poloBlueInspired } from "./polo-blue-inspired";
import { pradaParadigmeInspired } from "./prada-paradigme-inspired";
import { legendBlueInspired } from "./legend-blue-inspired";
import { blueNoirInspired } from "./blue-noir-inspired";
import { bvlgariAqvaMarineInspired } from "./bvlgari-aqva-marine-inspired";
import { dknyBeDeliciousGreenInspired } from "./dkny-be-delicious-green-inspired";
import { cliniqueHappyInspired } from "./clinique-happy-inspired";
import { narcisoPureMuscInspired } from "./narciso-pure-musc-inspired";
import { dylanBluePourFemmeInspired } from "./dylan-blue-pour-femme-inspired";
import { cherryInTheAirInspired } from "./cherry-in-the-air-inspired";
import { chloeOriginalInspired } from "./chloe-original-inspired";
import { gucciFloraInspired } from "./gucci-flora-inspired";
import { earlGreyCucumberInspired } from "./earl-grey-cucumber-inspired";
import { myrrhTonkaInspired } from "./myrrh-tonka-inspired";
import { ckEveryoneInspired } from "./ck-everyone-inspired";
import { greenleyInspired } from "./greenley-inspired";
import { smokingHotInspired } from "./smoking-hot-inspired";
import { lesSablesRosesInspired } from "./les-sables-roses-inspired";
import { theOnePourHommeInspired } from "./the-one-pour-homme-inspired";
import { azzaroWantedInspired } from "./azzaro-wanted-inspired";
import { azzaroChromeInspired } from "./azzaro-chrome-inspired";
import { bossTheScentInspired } from "./boss-the-scent-inspired";
import { ralphsClubInspired } from "./ralph's-club-inspired";
import { badBoyInspired } from "./bad-boy-inspired";
import { uomoByZegnaInspired } from "./uomo-by-zegna-inspired";
import { theOnePourFemmeInspired } from "./the-one-pour-femme-inspired";
import { angelInspired } from "./angel-inspired";
import { daisyInspired } from "./daisy-inspired";
import { chanelAllureInspired } from "./chanel-allure-inspired";
import { angeOuDemonInspired } from "./ange-ou-demon-inspired";
import { amorAmorInspired } from "./amor-amor-inspired";
import { dolceInspired } from "./dolce-inspired";

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
  ["oud-sapparot-inspired", oudSapparotInspired],
  ["abu-dhabi-inspired", abuDhabiInspired],
  ["cinque-terre-inspired", cinqueTerreInspired],
  ["fig-lotus-flower-inspired", figLotusFlowerInspired],
  ["torino24-inspired", torino24Inspired],
  ["outlands-inspired", outlandsInspired],
  ["centaurus-inspired", centaurusInspired],
  ["grapefruit-inspired", grapefruitInspired],
  ["dark-vanilla-inspired", darkVanillaInspired],
  ["armani-prive-oud-royal-inspired", armaniPriveOudRoyalInspired],
  ["my-way-nectar-inspired", myWayNectarInspired],
  ["changing-constance-inspired", changingConstanceInspired],
  ["queen-of-silk-inspired", queenOfSilkInspired],
  ["chanel-no-5-inspired", chanelNo5Inspired],
  ["gabrielle-inspired", gabrielleInspired],
  ["attrape-reves-inspired", attrapeRevesInspired],
  ["omnia-crystalline-inspired", omniaCrystallineInspired],
  ["valaya-exclusif-inspired", valayaExclusifInspired],
  ["crazy-in-love-inspired", crazyInLoveInspired],
  ["a-la-rose-inspired", aLaRoseInspired],
  ["light-blue-pour-homme-inspired", lightBluePourHommeInspired],
  ["bois-pacifique-inspired", boisPacifiqueInspired],
  ["egoiste-platinum-inspired", egoistePlatinumInspired],
  ["burberry-london-inspired", burberryLondonInspired],
  ["eternity-inspired", eternityInspired],
  ["bvlgari-black-inspired", bvlgariBlackInspired],
  ["212-vip-black-inspired", _212VipBlackInspired],
  ["aqva-amara-inspired", aqvaAmaraInspired],
  ["scandal-pour-homme-inspired", scandalPourHommeInspired],
  ["lacoste-blanc-inspired", lacosteBlancInspired],
  ["creed-delphinus-inspired", creedDelphinusInspired],
  ["aqua-allegoria-rosa-verde-inspired", aquaAllegoriaRosaVerdeInspired],
  ["vanilla-powder-inspired", vanillaPowderInspired],
  ["beach-blossom-inspired", beachBlossomInspired],
  ["ck-one-inspired", ckOneInspired],
  ["oud-cadenza-inspired", oudCadenzaInspired],
  ["cool-water-inspired", coolWaterInspired],
  ["dylan-blue-inspired", dylanBlueInspired],
  ["polo-blue-inspired", poloBlueInspired],
  ["prada-paradigme-inspired", pradaParadigmeInspired],
  ["legend-blue-inspired", legendBlueInspired],
  ["blue-noir-inspired", blueNoirInspired],
  ["bvlgari-aqva-marine-inspired", bvlgariAqvaMarineInspired],
  ["dkny-be-delicious-green-inspired", dknyBeDeliciousGreenInspired],
  ["clinique-happy-inspired", cliniqueHappyInspired],
  ["narciso-pure-musc-inspired", narcisoPureMuscInspired],
  ["dylan-blue-pour-femme-inspired", dylanBluePourFemmeInspired],
  ["cherry-in-the-air-inspired", cherryInTheAirInspired],
  ["chloe-original-inspired", chloeOriginalInspired],
  ["gucci-flora-inspired", gucciFloraInspired],
  ["earl-grey-cucumber-inspired", earlGreyCucumberInspired],
  ["myrrh-tonka-inspired", myrrhTonkaInspired],
  ["ck-everyone-inspired", ckEveryoneInspired],
  ["greenley-inspired", greenleyInspired],
  ["smoking-hot-inspired", smokingHotInspired],
  ["les-sables-roses-inspired", lesSablesRosesInspired],
  ["the-one-pour-homme-inspired", theOnePourHommeInspired],
  ["azzaro-wanted-inspired", azzaroWantedInspired],
  ["azzaro-chrome-inspired", azzaroChromeInspired],
  ["boss-the-scent-inspired", bossTheScentInspired],
  ["ralph's-club-inspired", ralphsClubInspired],
  ["bad-boy-inspired", badBoyInspired],
  ["uomo-by-zegna-inspired", uomoByZegnaInspired],
  ["the-one-pour-femme-inspired", theOnePourFemmeInspired],
  ["angel-inspired", angelInspired],
  ["daisy-inspired", daisyInspired],
  ["chanel-allure-inspired", chanelAllureInspired],
  ["ange-ou-demon-inspired", angeOuDemonInspired],
  ["amor-amor-inspired", amorAmorInspired],
  ["dolce-inspired", dolceInspired],
]);
