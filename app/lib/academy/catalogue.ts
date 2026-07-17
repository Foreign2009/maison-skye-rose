import type { AcademyArticle } from "./types";

export const academyCatalogue: AcademyArticle[] = [
  {
    slug: "the-note-pyramid-explained",
    title: "The Note Pyramid Explained",
    subtitle: "How fragrances unfold from first spray to dry-down",
    category: "The Note Pyramid",
    excerpt:
      "Every fragrance tells a story in three acts. Learn how top, heart, and base notes work together to create the scent you experience from first spray to hours later.",
    readTime: 4,
    featured: true,
    publishedAt: "2026-07-03",
    relatedArticleIds: ["guide-to-fragrance-families", "what-makes-a-signature-scent"],
    recommendedArticleIds: ["guide-to-fragrance-families", "how-to-wear-fragrance"],
    relatedFragranceIds: [
      "sauvage-inspired",
      "miss-dior-inspired",
      "oud-mood-inspired",
    ],
    content: [
      {
        type: "paragraph",
        text: "Every fragrance you wear is a composition — a carefully structured sequence of ingredients that reveals itself over time. This structure is called the note pyramid, and understanding it changes how you experience and choose fragrances forever.",
      },
      {
        type: "heading",
        text: "Top Notes — The First Impression",
      },
      {
        type: "paragraph",
        text: "Top notes are what you smell in the first 15 to 30 minutes after applying a fragrance. They are the lightest, most volatile molecules — designed to evaporate quickly and create an immediate impression. Common top notes include citrus (bergamot, lemon, orange), light herbs (lavender, basil), and clean aromatics.",
      },
      {
        type: "tip",
        text: "Never judge a fragrance by its top notes alone. The first spray is the greeting — not the full story.",
      },
      {
        type: "heading",
        text: "Heart Notes — The True Character",
      },
      {
        type: "paragraph",
        text: "Heart notes, also called middle notes, emerge as the top notes fade — usually 30 minutes to 2 hours after application. They form the core personality of the fragrance and last much longer. Florals (rose, jasmine, peony), spices (pepper, cardamom), and soft woods dominate this layer.",
      },
      {
        type: "paragraph",
        text: "When you fall in love with a fragrance on someone else, you are almost always responding to their heart notes. This is the layer that interacts most with body chemistry.",
      },
      {
        type: "heading",
        text: "Base Notes — The Memory",
      },
      {
        type: "paragraph",
        text: "Base notes are the foundation — the heaviest, slowest-evaporating molecules that emerge 2 to 4 hours after application and can linger on skin or fabric for 12 hours or more. Musks, ambers, woods (sandalwood, cedarwood, oud), and resins (benzoin, labdanum) are classic base notes.",
      },
      {
        type: "paragraph",
        text: "Base notes are what remain on your skin at the end of the day. They are often the reason a fragrance feels intimate and personal rather than simply pleasant.",
      },
      {
        type: "heading",
        text: "How to Experience the Full Pyramid",
      },
      {
        type: "paragraph",
        text: "Apply the fragrance to a pulse point — your wrist or inner elbow — and wait. Smell it immediately (top notes), again after 30 minutes (heart notes), and again 2 to 3 hours later (base notes). Only then do you know the full fragrance.",
      },
      {
        type: "fragrance-spotlight",
        fragranceId: "sauvage-inspired",
        caption: "Sauvage Inspired follows the classic three-layer structure: bright bergamot and pepper in the opening, lavender and geranium through the heart, and a long-wearing ambroxan base — a clear illustration of how the note pyramid unfolds over time on a single fragrance.",
      },
      {
        type: "tip",
        text: "The Maison Knowledge Catalogue lists top, heart, and base notes for every fragrance. Use the note pyramid view on any product page to explore how your fragrance is structured.",
      },
      {
        type: "note-list",
        notes: [
          "Top notes evaporate within 30 minutes",
          "Heart notes define the fragrance's core character",
          "Base notes linger for hours and create the final impression",
          "Body chemistry affects how each layer smells on your skin",
          "Longevity depends mostly on base note concentration",
        ],
      },
    ],
  },

  {
    slug: "guide-to-fragrance-families",
    title: "Your Guide to Fragrance Families",
    subtitle: "The six major fragrance families and how to find yours",
    category: "Fragrance Families",
    excerpt:
      "Fragrance families are the language of perfumery. Understanding them helps you describe what you love, discover new fragrances confidently, and build a collection that reflects your personality.",
    readTime: 5,
    publishedAt: "2026-07-03",
    relatedArticleIds: ["the-note-pyramid-explained", "what-makes-a-signature-scent"],
    recommendedArticleIds: ["the-note-pyramid-explained", "choosing-your-season-scent"],
    relatedFragranceIds: [
      "miss-dior-inspired",
      "sauvage-inspired",
      "good-girl-inspired",
      "oud-mood-inspired",
    ],
    content: [
      {
        type: "paragraph",
        text: "Perfumers organize fragrances into families — groups that share a dominant character. Knowing your preferred family is the fastest path to finding fragrances you will love. It also explains why some fragrances feel instantly familiar while others feel foreign.",
      },
      {
        type: "heading",
        text: "Floral",
      },
      {
        type: "paragraph",
        text: "The largest and most diverse family. Floral fragrances centre on flower notes — rose, jasmine, peony, lily, violet. They range from fresh and light (a single note, like rose) to lush and complex (a bouquet of many florals). If you are drawn to elegance, femininity, and romance, florals are your natural starting point.",
      },
      {
        type: "heading",
        text: "Fresh & Aquatic",
      },
      {
        type: "paragraph",
        text: "Fresh fragrances feel clean, bright, and airy. Citrus, green leaves, sea spray, and light musks define this family. They are universally wearable, often unisex, and ideal for warm weather, active lifestyles, and professional settings where a strong projection is unwelcome.",
      },
      {
        type: "heading",
        text: "Woody",
      },
      {
        type: "paragraph",
        text: "Woody fragrances are built on cedarwood, sandalwood, vetiver, patchouli, or oud. They feel grounded, sophisticated, and often have an earthy warmth. Many modern masculine fragrances are woody or fresh-woody. The family spans everything from clean cedar to dark, smoky oud.",
      },
      {
        type: "heading",
        text: "Oriental & Amber",
      },
      {
        type: "paragraph",
        text: "Oriental fragrances are warm, rich, and enveloping — built around amber, resins, vanilla, spice, and musk. They feel intimate and sensual. Ideal for evening wear, cooler seasons, and anyone who prefers a fragrance that leaves a lasting impression.",
      },
      {
        type: "heading",
        text: "Fruity",
      },
      {
        type: "paragraph",
        text: "Fruity fragrances feature prominent fruit notes — peach, pineapple, berries, apple, lychee. Often playful and modern, they are frequently blended with florals or musks to create a fruity-floral character. A common choice for younger wearers and casual everyday wear.",
      },
      {
        type: "heading",
        text: "Gourmand",
      },
      {
        type: "paragraph",
        text: "Gourmand fragrances smell edible — vanilla, chocolate, caramel, coffee, tonka bean, and pastry accords. They are sweet, comforting, and deeply personal. Not universally loved, but intensely adored by those who connect with this family.",
      },
      {
        type: "tip",
        text: "Most fragrances blend families. A fresh-floral, a woody-oriental, or a fruity-gourmand is common. Focus on the dominant family first, then explore the nuance.",
      },
      {
        type: "note-list",
        notes: [
          "Floral — elegant, romantic, feminine or unisex",
          "Fresh & Aquatic — clean, bright, versatile",
          "Woody — grounded, sophisticated, warm",
          "Oriental & Amber — rich, sensual, long-lasting",
          "Fruity — playful, modern, casual",
          "Gourmand — sweet, edible, comforting",
        ],
      },
    ],
  },

  {
    slug: "how-to-wear-fragrance",
    title: "How to Wear Fragrance",
    subtitle: "Apply, layer, and carry your scent with confidence",
    category: "Wear & Application",
    excerpt:
      "Most people apply fragrance incorrectly. Learn the techniques that maximize longevity, projection, and character — so your fragrance works with your body, not against it.",
    readTime: 4,
    publishedAt: "2026-07-03",
    relatedArticleIds: ["how-to-layer-fragrances", "choosing-your-season-scent"],
    recommendedArticleIds: ["how-to-layer-fragrances", "what-makes-a-signature-scent"],
    relatedFragranceIds: ["sauvage-inspired", "miss-dior-inspired"],
    content: [
      {
        type: "heading",
        text: "Apply to Pulse Points",
      },
      {
        type: "paragraph",
        text: "Pulse points are areas where blood vessels sit close to the skin, generating warmth that activates fragrance molecules and helps them project. The most effective pulse points are the inner wrists, the sides of the neck, the inner elbows, and behind the knees. One or two points is enough for most fragrances.",
      },
      {
        type: "heading",
        text: "Do Not Rub Your Wrists",
      },
      {
        type: "paragraph",
        text: "Rubbing wrists together after applying fragrance is one of the most common mistakes in perfumery. The friction generates heat and breaks down the top note molecules, distorting how the fragrance opens. Spray and let it dry naturally.",
      },
      {
        type: "tip",
        text: "Spray once or twice. Most fragrances are formulated to project from a single application. More spray rarely means more impact — it often means an overwhelming opening that fades unevenly.",
      },
      {
        type: "heading",
        text: "Moisturised Skin Holds Fragrance Longer",
      },
      {
        type: "paragraph",
        text: "Dry skin allows fragrance to evaporate faster. Applying an unscented moisturiser to your pulse points before spraying creates a base that extends longevity. If you want maximum staying power, apply after a shower while skin is still slightly damp and pores are open.",
      },
      {
        type: "heading",
        text: "Hair Carries Fragrance Exceptionally Well",
      },
      {
        type: "paragraph",
        text: "Hair fibers hold fragrance molecules effectively and release them gradually as you move. Spray a small amount into the air and walk through it, or lightly mist the ends. Avoid spraying alcohol-based fragrance directly onto hair roots — alcohol can dry out the scalp.",
      },
      {
        type: "heading",
        text: "Clothes Carry Scent for Days",
      },
      {
        type: "paragraph",
        text: "Fabric holds fragrance far longer than skin — sometimes for days. Spraying the inside of a collar or cuffs creates a scent that evolves slowly and lasts far beyond what skin alone can achieve. Be careful with delicate fabrics — some fragrance oils can stain.",
      },
      {
        type: "heading",
        text: "How Much Is Enough",
      },
      {
        type: "paragraph",
        text: "The right amount depends on the fragrance concentration and the occasion. A fresh daily fragrance may need two or three sprays. A rich, intense oriental may need just one. If people compliment your fragrance when you walk past, you have found the right amount. If people smell you before they see you, you have used too much.",
      },
      {
        type: "note-list",
        notes: [
          "Apply to inner wrists, neck, inner elbows — not everywhere",
          "Never rub pulse points together after spraying",
          "Moisturised skin holds fragrance longer",
          "Hair and fabric carry scent for hours or days",
          "Less is more — especially with rich, projection-heavy fragrances",
        ],
      },
    ],
  },

  {
    slug: "what-makes-a-signature-scent",
    title: "What Makes a Signature Scent",
    subtitle: "How to find the fragrance that becomes unmistakably yours",
    category: "Fragrance Fundamentals",
    excerpt:
      "A signature scent is a fragrance so aligned with your personality that people associate the smell with you. Here is how to find, test, and commit to one.",
    readTime: 5,
    featured: true,
    publishedAt: "2026-07-03",
    relatedArticleIds: ["guide-to-fragrance-families", "choosing-your-season-scent"],
    recommendedArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained"],
    relatedFragranceIds: ["aventus-inspired", "delina-inspired"],
    content: [
      {
        type: "paragraph",
        text: "A signature scent is not just a fragrance you like — it is a fragrance that becomes part of your identity. People who know you well will smell it on a stranger and think of you. Getting there takes intention, but it is one of the most rewarding things you can do for your personal style.",
      },
      {
        type: "heading",
        text: "Start With Families, Not Specific Fragrances",
      },
      {
        type: "paragraph",
        text: "Before sampling individual fragrances, identify the family or families that resonate with your personality and lifestyle. Are you drawn to clean, fresh scents or warm, enveloping ones? Florals or woods? Minimalist or complex? Knowing your family narrows hundreds of options to a manageable shortlist.",
      },
      {
        type: "heading",
        text: "Consider Your Lifestyle",
      },
      {
        type: "paragraph",
        text: "A signature scent should work in your actual life. Consider: Do you spend most of your time in an office, outdoors, or social settings? Is your personal style minimal or expressive? Do you run warm or cold? Someone with an intense, physical lifestyle may find a heavy oriental overwhelming after the first hour — a fresh or light woody may serve better.",
      },
      {
        type: "heading",
        text: "Wear It, Do Not Just Smell It",
      },
      {
        type: "paragraph",
        text: "Smelling a fragrance on a strip tells you almost nothing about how it will perform on your skin. Your skin chemistry — its pH, natural oils, and warmth — transforms every fragrance differently. Always try a fragrance on skin before committing. The 10ml size exists precisely for this: it gives you enough liquid to wear the fragrance for a week and truly understand how it evolves on you.",
      },
      {
        type: "tip",
        text: "Wear a fragrance for a full day before deciding. Top notes fade. The heart and base notes — which emerge after the first hour — are the fragrance you will actually be wearing.",
      },
      {
        type: "heading",
        text: "Live With It Before You Commit",
      },
      {
        type: "paragraph",
        text: "The right signature scent should feel effortless. You should not think about it — it should feel like an extension of you. If you are still debating whether you like it after a week of wear, it is probably not your signature. The right fragrance creates a quiet confidence. You know it is right.",
      },
      {
        type: "fragrance-spotlight",
        fragranceId: "aventus-inspired",
        caption: "Aventus Inspired demonstrates what a settled signature character feels like — a well-defined, confident composition that is consistent from first spray to dry-down, and recognisable without announcing itself.",
      },
      {
        type: "heading",
        text: "One Does Not Have to Be the Answer",
      },
      {
        type: "paragraph",
        text: "Some people have one signature for every occasion. Others build a small wardrobe — a fresh everyday option, a richer evening choice, a seasonal rotation. Both approaches are valid. The goal is intentionality: wearing fragrance with awareness rather than reaching for whatever is on the shelf.",
      },
      {
        type: "note-list",
        notes: [
          "Start with fragrance families before shopping specific bottles",
          "Your lifestyle determines which character works day to day",
          "Test on skin — never from the bottle or a strip",
          "Wear for a full day before deciding",
          "If you are still unsure after a week, keep looking",
        ],
      },
    ],
  },

  {
    slug: "choosing-your-season-scent",
    title: "Choosing Your Season Scent",
    subtitle: "Why fragrance should change with the weather — and how to match it",
    category: "Occasions & Style",
    excerpt:
      "Heat amplifies projection. Cold mutes it. Humidity warps top notes. Learn how to choose fragrances that perform beautifully in each season rather than fighting the weather.",
    readTime: 4,
    publishedAt: "2026-07-03",
    relatedArticleIds: ["how-to-wear-fragrance", "guide-to-fragrance-families"],
    recommendedArticleIds: ["how-to-wear-fragrance", "what-makes-a-signature-scent"],
    relatedFragranceIds: [
      "bleu-de-chanel-inspired",
      "miss-dior-inspired",
      "good-girl-inspired",
      "sauvage-inspired",
    ],
    content: [
      {
        type: "paragraph",
        text: "Fragrance and weather have a direct relationship. Heat accelerates evaporation, making fragrances project more aggressively and fade faster. Cold air slows evaporation, making fragrances more intimate and longer-lasting. A fragrance designed for summer can become overwhelming in winter — and vice versa.",
      },
      {
        type: "heading",
        text: "Summer — Fresh, Light, and Aquatic",
      },
      {
        type: "paragraph",
        text: "Summer heat amplifies everything. A fragrance that smells refined in cooler temperatures can become cloying in 35-degree heat. Choose fresh, citrus-forward, or aquatic fragrances for summer — they are designed to open brightly and project cleanly in warmth. Avoid heavy orientals, oud-based fragrances, or anything with an intense sweetness — the heat will distort them.",
      },
      {
        type: "heading",
        text: "Winter — Warm, Rich, and Long-Lasting",
      },
      {
        type: "paragraph",
        text: "Cold air mutes fragrance projection significantly. In winter, you need a fragrance with presence — rich orientals, deep woody fragrances, spicy accords, and heavy musks come into their own. The cold also slows evaporation, which means base notes linger beautifully. This is the season for your most intense fragrances.",
      },
      {
        type: "heading",
        text: "Spring — Floral and Balanced",
      },
      {
        type: "paragraph",
        text: "Spring calls for transition fragrances — not as light as summer picks, not as heavy as winter choices. Floral fragrances reach their peak in spring: the temperature is warm enough for them to bloom but not so hot that they become overwhelming. Fruity-florals and light woody-florals work exceptionally well.",
      },
      {
        type: "heading",
        text: "Autumn — Woody, Spicy, and Complex",
      },
      {
        type: "paragraph",
        text: "Autumn is the most versatile season for fragrance. As temperatures drop and humidity falls, woody, amber, and spice-forward fragrances come alive. This is the time to revisit warmer, more complex compositions you may have set aside in summer — they will reveal nuances that were hidden in the heat.",
      },
      {
        type: "tip",
        text: "In South Africa, the seasonal dynamic is reversed from the Northern Hemisphere — remember that December–February is high summer, while June–August is winter. Choose your fragrances accordingly.",
      },
      {
        type: "heading",
        text: "All-Season Fragrances",
      },
      {
        type: "paragraph",
        text: "Some fragrances are genuinely versatile — typically balanced woody or fresh-woody compositions that are not extreme in any direction. These make excellent everyday signature scents because they perform reliably across changing conditions. Look for fragrances described as All Season in the Maison catalogue.",
      },
      {
        type: "fragrance-spotlight",
        fragranceId: "bleu-de-chanel-inspired",
        caption: "Bleu de Chanel Inspired is a balanced woody-fresh composition — neither too light for winter nor too heavy for summer — that performs reliably across changing conditions. It is a practical example of what all-season character means on the skin.",
      },
      {
        type: "note-list",
        notes: [
          "Summer: fresh, citrus, aquatic — avoid heavy orientals",
          "Winter: rich, woody, oriental — full projection all season",
          "Spring: floral, fruity-floral — the peak season for florals",
          "Autumn: woody, spicy, amber — complex fragrances come alive",
          "South Africa: summer is December–February, winter is June–August",
        ],
      },
    ],
  },

  {
    slug: "how-to-layer-fragrances",
    title: "How to Layer Fragrances",
    subtitle: "Create a scent that is entirely your own",
    category: "Wear & Application",
    excerpt:
      "Fragrance layering is the practice of combining two or more scents to create something that does not exist in a single bottle. It is an expressive, personal technique used by perfume enthusiasts worldwide.",
    readTime: 4,
    publishedAt: "2026-07-03",
    relatedArticleIds: ["how-to-wear-fragrance", "what-makes-a-signature-scent"],
    recommendedArticleIds: ["how-to-wear-fragrance", "choosing-your-season-scent"],
    relatedFragranceIds: ["sauvage-inspired", "miss-dior-inspired"],
    content: [
      {
        type: "paragraph",
        text: "Layering is not about covering one fragrance with another. It is a compositional technique — using two fragrances to create a third, combined scent that neither would achieve alone. Done well, the result is unique to you.",
      },
      {
        type: "heading",
        text: "The Foundation Rule",
      },
      {
        type: "paragraph",
        text: "Apply your base fragrance first — typically the richer, heavier scent. Let it settle for a few minutes. Then apply the lighter fragrance over it. The base fragrance anchors the combination and extends its longevity. The second fragrance adds top-note character and nuance.",
      },
      {
        type: "heading",
        text: "Complementary Families Work Best",
      },
      {
        type: "paragraph",
        text: "The easiest layering combinations come from related fragrance families. Fresh over woody creates a clean, modern depth. Floral over musky adds intimacy to a romantic fragrance. Citrus over amber brightens a rich oriental and adds longevity to the citrus. Avoid layering two competing strong fragrances — the result is usually chaotic rather than complex.",
      },
      {
        type: "heading",
        text: "Common Layering Combinations",
      },
      {
        type: "paragraph",
        text: "Fresh + Woody: Apply a woody base (cedar, sandalwood) and layer a fresh citrus or aquatic over it. The result is clean and sophisticated with unusual staying power. Floral + Musk: A soft musk base underneath a floral creates an intimate, skin-close scent. Oriental + Fresh: Use an oriental for the base and a light fresh fragrance to brighten the opening — this prevents the oriental from feeling overwhelming.",
      },
      {
        type: "tip",
        text: "Test your layering combination on skin before committing to wearing it. What smells balanced in the bottle or on strips may behave differently on your body chemistry.",
      },
      {
        type: "heading",
        text: "How Much of Each",
      },
      {
        type: "paragraph",
        text: "There is no formula. Start with one spray of the base fragrance, one spray of the second, and evaluate after five minutes. You can adjust in the next session. Most effective layers use more of one fragrance (the base) and less of the other (the accent) — roughly 2:1 by default.",
      },
      {
        type: "heading",
        text: "Use the Same Brand Family",
      },
      {
        type: "paragraph",
        text: "The Maison Skye, Rose, and Elite collections are designed to complement one another. Layering a Skye fragrance with a Rose fragrance is a natural starting point — the collections share a common quality standard and are formulated without clashing base accords.",
      },
      {
        type: "note-list",
        notes: [
          "Apply the heavier fragrance first, lighter second",
          "Complementary families layer best — fresh + woody, floral + musk",
          "Test combinations on skin before wearing out",
          "Use more of one fragrance, less of the other — not equal parts",
          "Collections within the same brand layer naturally",
        ],
      },
    ],
  },

  {
    slug: "fragrance-concentration-explained",
    title: "Fragrance Concentration Explained",
    subtitle: "EDT, EDP, Parfum, Extrait — what the numbers mean and how to choose",
    category: "Fragrance Fundamentals",
    excerpt:
      "Eau de Toilette, Eau de Parfum, Parfum, Extrait — the labels on fragrance bottles describe concentration levels that directly affect how long a fragrance lasts, how far it projects, and what it costs. Here is what they actually mean.",
    readTime: 4,
    publishedAt: "2026-07-17",
    relatedArticleIds: ["what-makes-a-signature-scent", "projection-and-sillage"],
    recommendedArticleIds: ["the-science-of-longevity-and-projection", "how-to-sample-before-you-commit"],
    relatedFragranceIds: ["sauvage-inspired", "aventus-inspired", "delina-inspired"],
    content: [
      {
        type: "paragraph",
        text: "Every fragrance exists on a concentration spectrum. The higher the concentration of fragrance oil dissolved in alcohol, the more intense, longer-lasting, and typically more expensive the result. Understanding this spectrum changes how you shop and how you wear fragrance.",
      },
      {
        type: "heading",
        text: "What the Percentage Actually Means",
      },
      {
        type: "paragraph",
        text: "Fragrance concentration refers to the percentage of pure fragrance oil dissolved in a carrier — typically alcohol and a small amount of water. The four main concentration types are Eau de Cologne (EDC) at 2–4%, Eau de Toilette (EDT) at 5–15%, Eau de Parfum (EDP) at 15–20%, and Parfum or Extrait de Parfum at 20–40%.",
      },
      {
        type: "heading",
        text: "Eau de Toilette",
      },
      {
        type: "paragraph",
        text: "EDT is the most widely produced concentration. At 5–15% fragrance oil, it tends to project brightly on first application and fade to a moderate skin scent over 3–5 hours. Many signature fragrances were originally designed as EDTs — the formula is optimised for a fresh, airy opening that softens gracefully. EDTs are typically the most affordable concentration and work particularly well in warm weather when lighter projection is desirable.",
      },
      {
        type: "heading",
        text: "Eau de Parfum",
      },
      {
        type: "paragraph",
        text: "EDP typically sits at 15–20% concentration. The higher oil content produces stronger initial projection, a richer and often more complex mid-stage, and a more pronounced base note dry-down. Most people find an EDP lasts 6–8 hours on skin. The added depth also means the character of the fragrance is more fully expressed — the heart and base notes that define the composition come through more clearly than in the EDT version.",
      },
      {
        type: "heading",
        text: "Parfum and Extrait",
      },
      {
        type: "paragraph",
        text: "Parfum (also called Extrait de Parfum) ranges from 20–40% concentration. It is the most intimate, intense, and long-lasting form — and the most expensive. Parfum tends to project close to the skin rather than filling a room: the high oil content slows evaporation dramatically, creating a fragrance that stays on skin for 10–14 hours or more. The character is often more complex and personal than lower concentrations of the same formula.",
      },
      {
        type: "tip",
        text: "Concentration is not the same as quality. A beautifully formulated EDT will outlast a poorly constructed EDP. Concentration affects character and longevity — it does not determine whether a fragrance is good.",
      },
      {
        type: "heading",
        text: "Concentration Does Not Guarantee Longevity",
      },
      {
        type: "paragraph",
        text: "The relationship between concentration and longevity is real but not absolute. What determines longevity is the combination of concentration, formulation quality, the specific molecules used, and how fixatives anchor the base. A heavy musk-and-amber base in an EDP will outlast a poorly fixed Parfum. When evaluating longevity, always test on your own skin — the formula, not just the label, determines the result.",
      },
      {
        type: "heading",
        text: "Which Concentration to Choose",
      },
      {
        type: "paragraph",
        text: "Choose EDT for warm weather, daytime wear, or when you prefer a lighter projection that stays close to skin by mid-afternoon. Choose EDP for year-round versatility, stronger projection, and more pronounced character — particularly in cooler seasons. Choose Parfum when you want maximum intensity and longevity for special occasions, or when you prefer a fragrance that stays entirely private and skin-close.",
      },
      {
        type: "note-list",
        notes: [
          "EDT: 5–15% — fresh, airy, 3–5 hours — ideal for warm weather and daytime",
          "EDP: 15–20% — fuller, richer, 6–8 hours — best all-season choice",
          "Parfum/Extrait: 20–40% — intense, intimate, 10+ hours — special occasions",
          "Higher concentration ≠ better quality — formulation quality matters equally",
          "Always test on skin — concentration behaves differently on every person",
        ],
      },
    ],
  },

  {
    slug: "projection-and-sillage",
    title: "Projection and Sillage: How Far Your Fragrance Travels",
    subtitle: "Understanding the radius of your scent — and why it matters",
    category: "Fragrance Fundamentals",
    excerpt:
      "Projection describes how far a fragrance radiates from your body. Sillage is the trail it leaves when you move. Together they determine whether your fragrance announces your arrival or stays entirely private. Understanding both changes how you choose and wear scent.",
    readTime: 4,
    publishedAt: "2026-07-17",
    relatedArticleIds: ["what-makes-a-signature-scent", "fragrance-concentration-explained"],
    recommendedArticleIds: ["how-to-wear-fragrance", "the-science-of-longevity-and-projection"],
    relatedFragranceIds: ["sauvage-inspired", "aventus-inspired", "bleu-de-chanel-inspired"],
    content: [
      {
        type: "paragraph",
        text: "Two of the most important qualities of any fragrance — and the two most often confused — are projection and sillage. They are related but distinct. Learning to recognise them changes how you evaluate fragrance and how you match scent to situation.",
      },
      {
        type: "heading",
        text: "Projection — The Radius Around You",
      },
      {
        type: "paragraph",
        text: "Projection is the distance at which someone standing near you can detect your fragrance. A fragrance with strong projection makes itself known at arm's length or further. A skin-close fragrance with low projection is only detectable on close contact — an embrace, a conversation at close range. Projection is determined primarily by the fragrance's molecular composition and concentration, though application technique plays a role.",
      },
      {
        type: "heading",
        text: "Sillage — The Trail You Leave",
      },
      {
        type: "paragraph",
        text: "Sillage (pronounced see-yazh — from the French word for a ship's wake) is the scented trail a fragrance leaves in the air after you pass through a space. High sillage means others will notice your fragrance after you have left the room. Low sillage means the fragrance stays close to your body even while you are moving. Sillage is influenced by both projection strength and the specific molecules chosen — some project strongly while standing still but leave little trail; others are quiet up close but linger in the air.",
      },
      {
        type: "heading",
        text: "The Projection Spectrum",
      },
      {
        type: "paragraph",
        text: "Fragrance projection typically falls into three zones. Skin scent means the fragrance is only detectable within a few centimetres — intimate, personal, barely there to anyone but the wearer. Moderate projection means the fragrance is perceptible to someone standing beside you or in conversation range. Strong projection — sometimes called beast mode for the most extreme examples — means the fragrance fills a space and announces your presence before you arrive.",
      },
      {
        type: "tip",
        text: "The elevator test: if someone can clearly smell your fragrance in a small enclosed space after you leave, your projection is strong. If someone has to lean in to detect it, it is skin-close. Neither is wrong — it depends entirely on the occasion.",
      },
      {
        type: "heading",
        text: "Matching Projection to Occasion",
      },
      {
        type: "paragraph",
        text: "In a professional office shared with others, skin-close or moderate projection is respectful — strong projection in a small space can overwhelm colleagues who did not choose to smell your fragrance. In an outdoor setting, evening venue, or when you want your presence to be felt, stronger projection is appropriate. Application quantity directly affects how far a fragrance projects — this is one variable always within your control.",
      },
      {
        type: "heading",
        text: "Why Projection Changes Over Time",
      },
      {
        type: "paragraph",
        text: "Projection is not fixed. A fragrance that opens with strong projection in the first hour — driven by volatile top notes — will soften to a more intimate skin-close presence as the base notes take over. This is why some fragrances that feel overwhelming in the first minutes become effortlessly pleasant after 30. Give a fragrance time before judging its projection character.",
      },
      {
        type: "note-list",
        notes: [
          "Projection: the radius at which others detect your fragrance from still",
          "Sillage: the trail your fragrance leaves in a space as you move through it",
          "Strong projection is appropriate outdoors and in the evening",
          "Skin-close projection is more considerate in professional and enclosed settings",
          "Projection softens over time as volatile top notes fade to base notes",
          "More application = more projection — control this deliberately",
        ],
      },
    ],
  },

  {
    slug: "fragrance-vocabulary",
    title: "The Fragrance Vocabulary: Words for What You Smell",
    subtitle: "The essential descriptive language of perfumery — with examples",
    category: "Fragrance Fundamentals",
    excerpt:
      "Most people can identify that they love a fragrance but struggle to describe why. The vocabulary of perfumery is a small set of precise terms that unlock the ability to articulate preferences, communicate with clarity, and discover new fragrances with confidence.",
    readTime: 5,
    publishedAt: "2026-07-17",
    relatedArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained"],
    recommendedArticleIds: ["what-makes-a-signature-scent", "how-inspired-fragrances-work"],
    relatedFragranceIds: [
      "sauvage-inspired",
      "black-opium-inspired",
      "bleu-de-chanel-inspired",
      "delina-inspired",
    ],
    content: [
      {
        type: "paragraph",
        text: "Fragrance vocabulary is not technical jargon. It is a small set of precise descriptors that translate the experience of smelling into language. Once you learn these terms, you will find it far easier to describe what you love, identify what you dislike, and communicate with enough precision to discover new fragrances confidently.",
      },
      {
        type: "heading",
        text: "Light and Airy",
      },
      {
        type: "paragraph",
        text: "Fresh means clean and invigorating — a brightness with no heaviness. Not necessarily citrus, though citrus is often fresh. A fresh fragrance creates the impression of open air. Clean describes a laundry-adjacent quality — soft musks, soap, white florals. It is comforting and universally wearable but intentionally simple. Aquatic suggests sea air, water, or marine accords — an open, ozone-like quality that reads as wide and expansive. Green refers to the smell of cut stems, leaves, freshly mown grass, or herbs — a living, botanical quality.",
      },
      {
        type: "heading",
        text: "Warm and Rich",
      },
      {
        type: "paragraph",
        text: "Warm describes a fragrance with visible heat — usually from amber, vanilla, resins, or musks. It creates the impression of skin, comfort, and proximity. Gourmand refers to edible warmth — vanilla, chocolate, caramel, coffee. A fragrance that smells like something you could eat. Sweet describes obvious sweetness, usually from synthetic musks, vanilla, or fruit accords. Spicy indicates the presence of pepper, cardamom, clove, cinnamon, or similar spice materials — a sharp, biting warmth distinct from amber's softer heat.",
      },
      {
        type: "heading",
        text: "Woody, Earthy, and Complex",
      },
      {
        type: "paragraph",
        text: "Woody describes the smell of living or cut wood — cedar, sandalwood, vetiver, oud. Woody can range from clean and dry to dark and smoky. Earthy refers to soil, moss, roots, petrichor — a grounded, natural quality. Musky means the base-level skin scent that underlies most fragrances — intimate, human, close. Some musks are clearly detectable; others work subliminally to make a fragrance feel personal. Resinous describes the amber, labdanum, or benzoin quality of raw resins — thick, warm, slightly dark. Powdery suggests the soft, dry quality of face powder or iris — it smooths and softens everything beneath it.",
      },
      {
        type: "heading",
        text: "Unusual Descriptors Worth Knowing",
      },
      {
        type: "paragraph",
        text: "Animalic describes the raw, skin-like, sometimes challenging quality of certain musks — in modern formulations, more intimate than disturbing. Smoky or leathery indicates the presence of birch tar, smoke accord, or leather materials — dark, assertive, distinctive. Floral is obvious but worth defining precisely: the smell of living or abstracted flowers, distinct from fresh or sweet. Metallic describes a cold, sharp, almost clinical quality found in some modern molecular fragrances.",
      },
      {
        type: "tip",
        text: "When exploring a new fragrance, try three descriptors: one for how it opens (top note character), one for what dominates after 30 minutes (heart character), and one for how it ends hours later (base character). This three-word description is more useful than any single word.",
      },
      {
        type: "note-list",
        notes: [
          "Fresh — clean, bright, open air",
          "Clean — laundry-adjacent, soft, universally wearable",
          "Aquatic — marine, ozone, expansive",
          "Warm — amber, vanilla, resin, proximity",
          "Gourmand — edible: vanilla, coffee, chocolate",
          "Woody — cedar, sandalwood, vetiver, oud",
          "Musky — intimate, skin-close, subliminal",
          "Powdery — soft, dry, iris-like smoothness",
          "Animalic — raw, human, intense and intimate",
        ],
      },
    ],
  },

  {
    slug: "how-inspired-fragrances-work",
    title: "How Inspired Fragrances Work",
    subtitle: "What inspiration means in perfumery — and why it matters",
    category: "Fragrance Fundamentals",
    excerpt:
      "An inspired fragrance is a perfumer's response to an existing scent — a new composition that captures the spirit, character, and olfactive direction of a reference without copying it. Understanding how this works resolves the most common question new customers ask.",
    readTime: 4,
    publishedAt: "2026-07-17",
    relatedArticleIds: ["what-makes-a-signature-scent", "fragrance-vocabulary"],
    recommendedArticleIds: ["guide-to-fragrance-families", "how-to-sample-before-you-commit"],
    relatedFragranceIds: [
      "sauvage-inspired",
      "aventus-inspired",
      "delina-inspired",
      "black-opium-inspired",
    ],
    content: [
      {
        type: "paragraph",
        text: "The word inspired on a fragrance bottle carries a specific meaning in perfumery. It means the composition was created in response to an existing reference — sharing its olfactive character, emotional direction, and note structure while being an independently authored formula. This is not a grey area: inspired fragrances are a recognised, legitimate, and widely practised segment of the perfumery industry.",
      },
      {
        type: "heading",
        text: "The Difference Between Inspired and Counterfeit",
      },
      {
        type: "paragraph",
        text: "A counterfeit fragrance pretends to be something it is not. It copies the bottle, label, branding, and name of an existing product and misrepresents itself as the original. Counterfeit fragrances are illegal and often made with unregulated ingredients. An inspired fragrance does the opposite: it is fully transparent about what it is, carries its own branding and name, and is formulated independently. The inspiration is the creative brief — the finished fragrance is a new composition.",
      },
      {
        type: "heading",
        text: "How Perfumers Work from Inspiration",
      },
      {
        type: "paragraph",
        text: "A perfumer working from a creative brief — whether that brief is a famous reference or any other concept — analyses the character they are aiming for and builds a formula from the ground up. The note pyramid, the specific molecules, the ratios, and the fixatives are all the perfumer's own choices. The result may share a family, an emotional register, and a recognisable opening character with the reference, but it is never a chemical copy. Fragrance formulas cannot be patented in most jurisdictions — only the brand name and bottle design are protected.",
      },
      {
        type: "tip",
        text: "The quality of an inspired fragrance is entirely independent of its reference. A well-formulated inspired fragrance using quality materials will perform better than a poorly formulated original. Always evaluate the fragrance itself — not the name on the reference.",
      },
      {
        type: "heading",
        text: "Why Quality Inspired Fragrances Are Worn by Sophisticated Customers",
      },
      {
        type: "paragraph",
        text: "The appeal of an inspired fragrance is not price alone. Many customers discover a fragrance direction they love — a specific character, note combination, or emotional register — and want that experience without paying for a brand name, luxury retailer markup, or designer packaging. A high-quality inspired fragrance delivers the same olfactive experience with a different formula, different branding, and a fraction of the cost. Customers who understand fragrance at a deeper level are often the most enthusiastic inspired fragrance wearers.",
      },
      {
        type: "heading",
        text: "How to Evaluate What You Are Wearing",
      },
      {
        type: "paragraph",
        text: "The standard for any fragrance is the experience it creates on your skin. Does it open well? Does the heart develop interestingly? Does the dry-down reward the hours you wear it? These are the only questions that matter. The Maison Skye & Rose catalogue is built on the belief that fragrance character — not brand ownership — is what creates a signature scent.",
      },
      {
        type: "note-list",
        notes: [
          "Inspired means an independently formulated composition in the direction of a reference",
          "Counterfeit means pretending to be the original — illegal and unrelated to inspired",
          "Fragrance formulas are not patented — inspired composition is a legitimate creative practice",
          "Quality inspired fragrances use the same calibre of ingredients as originals",
          "Evaluate the fragrance on its own merits — not the name of the reference",
        ],
      },
    ],
  },

  {
    slug: "why-fragrances-smell-different-on-everyone",
    title: "Why Fragrances Smell Different on Everyone",
    subtitle: "Body chemistry, skin pH, and why testing on skin is the only reliable test",
    category: "Scent Science",
    excerpt:
      "The same fragrance can smell completely different on two people wearing it simultaneously. This is not marketing mythology — it is chemistry. Understanding why helps you choose fragrances more confidently and test them more accurately.",
    readTime: 5,
    publishedAt: "2026-07-17",
    relatedArticleIds: ["how-to-wear-fragrance", "how-to-sample-before-you-commit"],
    recommendedArticleIds: ["olfactory-fatigue", "the-science-of-longevity-and-projection"],
    relatedFragranceIds: ["sauvage-inspired", "miss-dior-inspired", "aventus-inspired"],
    content: [
      {
        type: "paragraph",
        text: "You have heard someone describe a fragrance as magical on a friend — then tried it yourself and found something entirely different. This is one of the most common experiences in fragrance, and it has a precise scientific explanation. Your body chemistry is not passive — it actively transforms every fragrance you apply.",
      },
      {
        type: "heading",
        text: "Skin pH",
      },
      {
        type: "paragraph",
        text: "Healthy skin maintains a slightly acidic pH of 4.5 to 5.5. This surface acidity varies between people based on genetics, diet, skincare products, and hormones. Fragrance molecules interact with this acid mantle as they evaporate from the skin surface. More acidic skin tends to amplify citrus and fresh notes while softening sweet and heavy base notes. Less acidic skin may produce the reverse effect. The same fragrance molecule, reacting with different pH environments, produces detectably different olfactive results.",
      },
      {
        type: "heading",
        text: "Natural Skin Oils and Sebum",
      },
      {
        type: "paragraph",
        text: "Your skin produces sebum — a mixture of fatty acids, wax esters, and squalene that coats and protects the skin surface. Sebum content varies considerably between individuals. Oilier skin provides a richer carrier for fragrance molecules, often extending longevity and deepening the base note character. Drier skin has less sebum to carry the molecules, resulting in faster evaporation and a more fleeting wearing experience. This is one of the reasons moisturised skin consistently performs better as a fragrance carrier.",
      },
      {
        type: "heading",
        text: "Body Temperature",
      },
      {
        type: "paragraph",
        text: "Heat accelerates evaporation. People who run warmer — through natural metabolism, exercise, or environment — project fragrances more aggressively and experience faster dry-down. The same fragrance that lasts all day on one person may fade within three hours on someone who runs hotter. This is not a deficiency in the fragrance — it means warm-bodied individuals project more powerfully while the fragrance is present, but may need to reapply for all-day wear.",
      },
      {
        type: "heading",
        text: "Skin Microbiome",
      },
      {
        type: "paragraph",
        text: "The skin is home to billions of microorganisms — bacteria, fungi, and other microbes that make up the skin microbiome. This microbiome is as individual as a fingerprint and varies significantly based on genetics, environment, diet, and personal care habits. The microbiome interacts with fragrance molecules, particularly musk molecules, in ways that are still being studied. This explains why some people detect certain musks clearly while others cannot perceive them at all — a phenomenon called specific anosmia.",
      },
      {
        type: "fragrance-spotlight",
        fragranceId: "sauvage-inspired",
        caption: "Sauvage Inspired contains Ambroxan, a synthetic molecule derived from ambergris that interacts intensely with individual skin chemistry. On some people it projects powerfully for ten hours; on others it becomes a skin scent within two. This is the body chemistry effect in practice — not a quality variation, but a chemistry one.",
      },
      {
        type: "tip",
        text: "The only reliable fragrance test is on your own skin, worn for a full day. A spray on the wrist in a store for 30 seconds tells you almost nothing about how a fragrance will perform in your specific chemistry.",
      },
      {
        type: "note-list",
        notes: [
          "Skin pH (4.5–5.5) varies by person and transforms how fragrance molecules evaporate",
          "Natural skin oils (sebum) extend longevity — drier skin evaporates fragrance faster",
          "Body temperature accelerates evaporation — warm-bodied people project more intensely",
          "Skin microbiome affects how musk and base note molecules are detected",
          "The same fragrance will smell measurably different on two people — this is chemistry",
          "Test on your own skin for a full day before committing to a full-size purchase",
        ],
      },
    ],
  },

  {
    slug: "olfactory-fatigue",
    title: "Olfactory Fatigue: Why You Stop Smelling Your Own Fragrance",
    subtitle: "Understanding your nose's adaptation mechanism — and how to work with it",
    category: "Scent Science",
    excerpt:
      "You applied your fragrance 20 minutes ago. Now you cannot smell it at all. You consider reapplying. Everyone else around you can still smell it clearly. This is olfactory fatigue — and understanding it prevents one of the most common fragrance mistakes.",
    readTime: 3,
    publishedAt: "2026-07-17",
    relatedArticleIds: ["how-to-wear-fragrance", "why-fragrances-smell-different-on-everyone"],
    recommendedArticleIds: ["the-science-of-longevity-and-projection", "how-to-sample-before-you-commit"],
    relatedFragranceIds: ["sauvage-inspired", "black-opium-inspired"],
    content: [
      {
        type: "paragraph",
        text: "The olfactory system is one of the most sophisticated sensory systems in the human body. It is also one of the fastest to adapt. When you are continuously exposed to a specific smell, your nose deliberately attenuates its sensitivity to that smell — a protective mechanism that prevents your brain from being overwhelmed by constant sensory input. The result: you stop smelling your own fragrance long before it has faded.",
      },
      {
        type: "heading",
        text: "What Actually Happened",
      },
      {
        type: "paragraph",
        text: "Within 20 to 30 minutes of applying a fragrance, your olfactory receptors begin adapting to the continuous signal. This is called olfactory habituation. The receptors do not stop working — they stop reporting the signal to the brain because the brain has classified it as background information. This is the same mechanism that makes you stop noticing the smell of your own home within minutes of arriving, even when visitors notice it immediately.",
      },
      {
        type: "heading",
        text: "Your Fragrance Is Still There",
      },
      {
        type: "paragraph",
        text: "This is the most important thing to understand: olfactory fatigue does not mean your fragrance has faded. It means your own sensory system has adapted to it. Others who have not been continuously exposed to it will detect it fully. The fragrance on your skin is unchanged — only your perception of it has shifted. The instinct to reapply is almost always wrong, and acting on it leads to over-application.",
      },
      {
        type: "tip",
        text: "Before reapplying, ask someone nearby if they can still smell your fragrance. If they can, do not reapply. Trust others as your calibration point — you cannot reliably judge your own application once habituation has occurred.",
      },
      {
        type: "heading",
        text: "How to Reset Your Nose",
      },
      {
        type: "paragraph",
        text: "Stepping away from a familiar environment helps — fresh air resets the olfactory baseline faster than staying in the same space. Smelling something completely different briefly disrupts the adapted signal. Time is the most reliable reset — 15 to 20 minutes in a different environment allows your olfactory receptors to recalibrate. When testing multiple fragrances, use the same reset between each one.",
      },
      {
        type: "heading",
        text: "The Over-Application Trap",
      },
      {
        type: "paragraph",
        text: "Olfactory fatigue is the root cause of most over-application in fragrance. The wearer cannot smell their own fragrance, assumes it has faded, applies more, and creates a projection that others find overwhelming. The correct approach is to apply your fragrance intentionally at the start of the day — one or two sprays for most fragrances — and trust the application without checking it. Your fragrance is almost certainly still present.",
      },
      {
        type: "note-list",
        notes: [
          "Olfactory habituation: your nose adapts to your own fragrance within 20–30 minutes",
          "Your fragrance is still present — only your perception of it has shifted",
          "Others around you can still smell it clearly — use them as your calibration",
          "Do not reapply based on your own inability to detect your fragrance",
          "Reset your nose with fresh air and time in a different environment",
          "Over-application is almost always caused by olfactory fatigue misread as fading",
        ],
      },
    ],
  },

  {
    slug: "the-science-of-longevity-and-projection",
    title: "The Science of Longevity and Projection",
    subtitle: "Why some fragrances last 14 hours and others vanish in 90 minutes",
    category: "Scent Science",
    excerpt:
      "Longevity and projection are not random. They are determined by molecular weight, volatility, fixatives, and formulation quality. Understanding the science behind lasting power helps you choose more intelligently and set realistic expectations for any fragrance.",
    readTime: 5,
    publishedAt: "2026-07-17",
    relatedArticleIds: ["fragrance-concentration-explained", "the-note-pyramid-explained"],
    recommendedArticleIds: ["olfactory-fatigue", "why-fragrances-smell-different-on-everyone"],
    relatedFragranceIds: ["sauvage-inspired", "aventus-inspired", "baccarat-rouge-540-inspired"],
    content: [
      {
        type: "paragraph",
        text: "Why does one fragrance last all day on a single spray while another requires reapplication by lunchtime? The answer is chemistry — specifically, molecular weight, volatility, and the presence of fixative molecules that slow evaporation. Once you understand these principles, you can predict roughly how long a fragrance will last before you test it.",
      },
      {
        type: "heading",
        text: "Molecular Weight and Volatility",
      },
      {
        type: "paragraph",
        text: "Every fragrance is a mixture of molecules of different weights. Lighter molecules — lower molecular weight — evaporate faster from skin. This is why top notes disappear quickly: citrus molecules, green notes, and light aromatics are among the lightest and most volatile fragrance materials. Heavier molecules — musks, ambers, resins, and woody materials — evaporate slowly, which is why base notes persist for hours or days. A fragrance's longevity is largely determined by the weight profile of its base notes.",
      },
      {
        type: "heading",
        text: "How Fixatives Work",
      },
      {
        type: "paragraph",
        text: "Fixatives are molecules that slow the evaporation of other fragrance components by binding to them or by creating a base that resists volatilisation. Natural fixatives include musks, ambergris and its synthetic derivative Ambroxan, benzoin, labdanum, and orris root. A well-fixed fragrance uses base note materials that hold the entire composition in place — extending not just base note duration but also the mid-stage life of the heart notes above them.",
      },
      {
        type: "tip",
        text: "Ambroxan — the synthetic molecule derived from ambergris — is one of the most powerful fixatives in modern perfumery. Its presence in a fragrance is a reliable predictor of strong longevity and projection. Sauvage Inspired contains significant Ambroxan in its base, which accounts for its exceptional performance on skin.",
      },
      {
        type: "heading",
        text: "The Concentration Misconception",
      },
      {
        type: "paragraph",
        text: "Many people assume that a higher concentration always produces better longevity. This is only partially true. Concentration (the percentage of fragrance oil) matters, but the specific molecules in the formula matter equally. A well-fixed EDT built on heavy woody and musk bases will outlast a poorly fixed EDP with an emphasis on volatile top and heart notes. Longevity comes from the base structure, not the concentration label alone.",
      },
      {
        type: "heading",
        text: "Application Surface and Longevity",
      },
      {
        type: "paragraph",
        text: "Where you apply fragrance directly affects longevity. Warm pulse points initially improve projection through heat but accelerate evaporation over time. Hair and clothing retain fragrance molecules far longer than skin — sometimes for days. Moisturised skin provides a richer carrier for fragrance oils, consistently extending longevity compared to dry skin. For maximum staying power: apply to moisturised pulse points and allow the clothing nearest them to catch the sillage.",
      },
      {
        type: "heading",
        text: "Why Longevity Varies Between Wearers",
      },
      {
        type: "paragraph",
        text: "Even the same fragrance, same concentration, and same application technique will last different durations on different people. Body temperature, skin pH, sebum production, and skin microbiome all affect how quickly molecules evaporate and how they interact with skin. A person who runs warm and has dry skin will experience significantly shorter longevity than someone with cooler temperature and oily skin. This is the body chemistry variable — not a defect in the fragrance.",
      },
      {
        type: "note-list",
        notes: [
          "Light molecules (top notes) evaporate in minutes; heavy molecules (base notes) last hours",
          "Fixatives — musks, ambers, Ambroxan — slow evaporation and extend longevity",
          "Higher concentration improves longevity only if the formula has a strong base structure",
          "Moisturised skin consistently outperforms dry skin for fragrance longevity",
          "Hair and clothing retain fragrance far longer than skin",
          "Individual body chemistry creates longevity differences of 2–6 hours between wearers",
        ],
      },
    ],
  },

  {
    slug: "how-to-sample-before-you-commit",
    title: "How to Sample Before You Commit",
    subtitle: "The right way to test a fragrance on skin before choosing a full size",
    category: "Wear & Application",
    excerpt:
      "Most fragrance regret comes from not testing properly. A quick spray in a store, a smell from the bottle, or a paper strip test tells you almost nothing about how a fragrance will perform in your chemistry. Here is how to test correctly.",
    readTime: 3,
    publishedAt: "2026-07-17",
    relatedArticleIds: ["how-to-wear-fragrance", "why-fragrances-smell-different-on-everyone"],
    recommendedArticleIds: ["the-note-pyramid-explained", "what-makes-a-signature-scent"],
    relatedFragranceIds: ["sauvage-inspired", "delina-inspired", "miss-dior-inspired"],
    content: [
      {
        type: "paragraph",
        text: "Fragrance testing is a skill. Most people test incorrectly — they smell a fragrance briefly, form an impression based on top notes, and make a purchase decision on incomplete information. The result is regret when the dry-down turns out to be different from the opening. Testing correctly is simple once you understand why the standard approach fails.",
      },
      {
        type: "heading",
        text: "Why Strip Testing Fails",
      },
      {
        type: "paragraph",
        text: "Paper strips (blotters) have one legitimate use: smelling a fragrance's rough character before deciding whether to test it on skin. They cannot tell you how a fragrance will perform on your body. Paper does not have a pH. Paper does not produce sebum or body heat. Paper does not have a microbiome. The skin interaction that defines how a fragrance actually smells and lasts is entirely absent from a strip test. Use strips for elimination, not evaluation.",
      },
      {
        type: "heading",
        text: "The Three-Stage Skin Test",
      },
      {
        type: "paragraph",
        text: "Apply the fragrance to a pulse point — inner wrist or inner elbow. Do not rub. Then wait. Stage one is the opening: what you smell in the first 5–15 minutes is top notes — the first impression, designed to be bright and immediately appealing, but not representative of the full fragrance. Stage two is the heart: at 30–60 minutes, the top notes fade and the true character of the fragrance emerges. This is the most important stage. Stage three is the dry-down: at 2–4 hours, base notes are all that remain. This is the fragrance you will be wearing for the rest of the day.",
      },
      {
        type: "tip",
        text: "Never judge a fragrance in the first 15 minutes. What you smell on the first spray is top notes — the greeting, not the story. Many fragrances that smell unremarkable on first spray reveal beautiful heart and base notes in the hour that follows.",
      },
      {
        type: "heading",
        text: "How Many Fragrances at Once",
      },
      {
        type: "paragraph",
        text: "Your nose can distinguish multiple fragrances simultaneously, but loses accuracy after three or four different stimuli. When testing at home, limit yourself to two fragrances — one on each wrist. Allow time between testing sessions for your nose to reset. Sampling multiple fragrances across several days produces far more useful information than testing six at once in a single session.",
      },
      {
        type: "heading",
        text: "What the 5ml Is For",
      },
      {
        type: "paragraph",
        text: "The 5ml size exists precisely for committed skin testing. A single wearing cannot tell you whether a fragrance will work for your life, your wardrobe, and your chemistry. The 5ml gives you enough liquid to wear the fragrance four to six times across different conditions — morning, evening, summer heat, cooler day — and to form a genuine relationship with it before investing in 10ml or 30ml. Consider the 5ml the final confirmation step before committing to a signature.",
      },
      {
        type: "note-list",
        notes: [
          "Paper strips are for elimination only — never for final evaluation",
          "Test on skin: pH, sebum, and body heat transform how fragrance actually smells",
          "Stage 1 (0–15 min): top notes — the opening impression",
          "Stage 2 (30–60 min): heart notes — the true character",
          "Stage 3 (2–4 hours): base notes — what you wear all day",
          "5ml size: wear a fragrance 4–6 times before committing to 30ml",
        ],
      },
    ],
  },
];
