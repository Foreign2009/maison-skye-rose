import type { ConversationContext } from "../concierge/types";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MomentPageContent {
  collectionId:        string;
  label:               string;
  subtitle:            string;
  story:               string;
  insight:             string;
  wardrobeNote?:       string;
  academyCopy:         string;
  conciergeCopy:       string;
  conciergeContext:    Partial<ConversationContext>;
  relatedArticleSlugs: string[];
  relatedMomentIds:    string[];
  academySlug?:        string;
}

// ── Content definitions ───────────────────────────────────────────────────────
// One entry per discovery moment. collectionId maps to CollectionSpec.id.
// Editorial copy (story, insight) is separated from recommendation logic.

export const MOMENT_CONTENT: MomentPageContent[] = [
  {
    collectionId: "everyday-wear",
    label:        "Everyday Signature",
    subtitle:     "A reliable anchor for every day.",
    story:
      "The fragrances we reach for every morning shape how the day begins. An everyday signature does not announce itself — it becomes part of who you are. Over time, it is the scent others associate with you without ever naming it.",
    insight:
      "Versatility is not a limitation. It is the mark of a fragrance confident enough to work everywhere.",
    wardrobeNote:
      "The cornerstone of a considered wardrobe — a reliable anchor that works every day and makes space for bolder additions.",
    academyCopy:
      "Learn how application and layering build all-day presence",
    conciergeCopy:
      "Your Concierge can help build your daily fragrance rotation based on your lifestyle",
    conciergeContext:    { occasion: "Daily Wear" },
    relatedArticleSlugs: [
      "how-to-wear-fragrance",
      "what-makes-a-signature-scent",
      "guide-to-fragrance-families",
    ],
    relatedMomentIds: ["fresh-office", "beginner-friendly", "date-night"],
    academySlug:      "how-to-wear-fragrance",
  },

  {
    collectionId: "fresh-office",
    label:        "Office & Work",
    subtitle:     "Confident, considered, and professional.",
    story:
      "A workplace fragrance walks a careful line — it must project enough to feel intentional, yet not so much that it commands the room. The best office fragrances are the ones that make someone lean in slightly and quietly wonder.",
    insight:
      "Freshness and restraint are not compromises. They are the craft of choosing a fragrance for shared spaces.",
    wardrobeNote:
      "A fresh signature belongs in every wardrobe — light enough to pair with anything, present enough to be remembered.",
    academyCopy:
      "Discover which fragrance families perform best in professional environments",
    conciergeCopy:
      "Describe your workplace — your Concierge will suggest the right balance of presence and restraint",
    conciergeContext:    { occasion: "Office" },
    relatedArticleSlugs: [
      "what-makes-a-signature-scent",
      "guide-to-fragrance-families",
      "how-to-wear-fragrance",
    ],
    relatedMomentIds: ["everyday-wear", "beginner-friendly", "summer-essentials"],
    academySlug:      "guide-to-fragrance-families",
  },

  {
    collectionId: "date-night",
    label:        "Date Night",
    subtitle:     "Memorable from the first impression.",
    story:
      "An evening fragrance is part of the first impression, even before you speak. Worn well, it creates a peripheral awareness — a lingering presence that suggests confidence without demanding attention. These are fragrances that stay close.",
    insight:
      "The best evening fragrances are not loud. They are deep. Character, not volume, is what lingers.",
    wardrobeNote:
      "An evening fragrance is the statement piece — worn alongside a lighter daily signature, every occasion finds its own scent.",
    academyCopy:
      "Discover how top, heart, and base notes unfold over the course of an evening",
    conciergeCopy:
      "Describe your evening — your Concierge will find your perfect match for the occasion",
    conciergeContext:    { occasion: "Date Night" },
    relatedArticleSlugs: [
      "the-note-pyramid-explained",
      "how-to-wear-fragrance",
      "guide-to-fragrance-families",
    ],
    relatedMomentIds: ["special-occasion", "winter-warmth", "everyday-wear"],
    academySlug:      "the-note-pyramid-explained",
  },

  {
    collectionId: "summer-essentials",
    label:        "Summer Escape",
    subtitle:     "Light, bright, and made for warmth.",
    story:
      "Summer changes how fragrance behaves. Warmth intensifies projection and accelerates the drydown — what works in winter can feel overwhelming in the sun. The right summer fragrance is alive in the heat, light on the air, and effortless to wear from morning through to evening.",
    insight:
      "In summer, freshness is not just a note. It is a performance requirement.",
    wardrobeNote:
      "Seasonal fragrances complete the rotation — a summer chapter to pair with your year-round signature for a wardrobe that moves with the moment.",
    academyCopy:
      "Learn how temperature affects fragrance families and why season matters in selection",
    conciergeCopy:
      "Tell your Concierge where you're headed this season and discover fragrances made for the journey",
    conciergeContext:    { season: "Summer" },
    relatedArticleSlugs: [
      "choosing-your-season-scent",
      "guide-to-fragrance-families",
      "how-to-wear-fragrance",
    ],
    relatedMomentIds: ["everyday-wear", "fresh-office", "beginner-friendly"],
    academySlug:      "guide-to-fragrance-families",
  },

  {
    collectionId: "beginner-friendly",
    label:        "First Signature Fragrance",
    subtitle:     "Where every collection begins.",
    story:
      "Every fragrance wardrobe begins somewhere. The first signature is rarely the boldest or most complex — it is the one that feels right without needing to understand why. These are fragrances that welcome you into the practice of fragrance without overwhelming you with it.",
    insight:
      "The most approachable fragrances are not the least interesting. They are the most considered.",
    wardrobeNote:
      "Every wardrobe begins with a first signature — once found, it becomes the anchor around which everything else is built.",
    academyCopy:
      "Start with the fundamentals — discover the fragrance families that will guide your entire journey",
    conciergeCopy:
      "Your Concierge specialises in first signatures — share your instincts and let the journey begin",
    conciergeContext:    { occasion: "Daily Wear" },
    relatedArticleSlugs: [
      "guide-to-fragrance-families",
      "the-note-pyramid-explained",
      "what-makes-a-signature-scent",
    ],
    relatedMomentIds: ["everyday-wear", "fresh-office", "summer-essentials"],
    academySlug:      "guide-to-fragrance-families",
  },

  {
    collectionId: "winter-warmth",
    label:        "Winter Warmth",
    subtitle:     "Rich, enveloping, season-defining.",
    story:
      "Cold air is fragrance's most generous companion. In winter, base notes deepen, warmth amplifies, and the body's natural heat draws out a fragrance's fullest character. These are the scents built for that relationship — rich, enveloping, and made to endure.",
    insight:
      "Oud, amber, and warm woods are not trends. They are winter's native language.",
    wardrobeNote:
      "Winter fragrances are the depth layer — worn alongside a lighter everyday signature, they give every season its defining character.",
    academyCopy:
      "Understand how base notes define winter fragrances and why longevity matters in the cold",
    conciergeCopy:
      "Your Concierge can match you with a winter warmth that suits your character precisely",
    conciergeContext:    { season: "Winter" },
    relatedArticleSlugs: [
      "the-note-pyramid-explained",
      "choosing-your-season-scent",
      "guide-to-fragrance-families",
    ],
    relatedMomentIds: ["date-night", "special-occasion", "everyday-wear"],
    academySlug:      "the-note-pyramid-explained",
  },

  {
    collectionId: "special-occasion",
    label:        "Special Occasion",
    subtitle:     "For the days that deserve to be remembered.",
    story:
      "Some fragrances are worn every day. Others are chosen for a single, specific day. A special occasion fragrance carries the weight of what it marks — it should feel exceptional, considered, and worthy of the moment it accompanies.",
    insight:
      "A fragrance worn on a meaningful day becomes permanently woven into the memory of that day.",
    wardrobeNote:
      "The rarest piece in any wardrobe — reserved for the occasions that deserve their own scent and their own memory.",
    academyCopy:
      "Explore what makes a fragrance truly exceptional and how to wear it for lasting impact",
    conciergeCopy:
      "Share your occasion with your Concierge — they will help you select a fragrance you'll remember",
    conciergeContext:    { occasion: "Wedding" },
    relatedArticleSlugs: [
      "how-to-wear-fragrance",
      "the-note-pyramid-explained",
      "guide-to-fragrance-families",
    ],
    relatedMomentIds: ["date-night", "winter-warmth", "everyday-wear"],
    academySlug:      "how-to-wear-fragrance",
  },
];

// ── Public API ────────────────────────────────────────────────────────────────

export function getMomentContent(collectionId: string): MomentPageContent | undefined {
  return MOMENT_CONTENT.find((m) => m.collectionId === collectionId);
}
