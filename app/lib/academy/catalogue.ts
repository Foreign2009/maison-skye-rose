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
    publishedAt: "2026-07-03",
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
    publishedAt: "2026-07-03",
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
];
