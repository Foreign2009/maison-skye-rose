/**
 * Maison Concierge — Consultation Tracker (EP18-P1)
 *
 * Maintains the living ConsultationPlan across conversation turns.
 *
 * buildConsultationPlan  — converts last recommended slugs + profile into a
 *   ConsultationPlan with roles assigned to specific fragrances.
 *
 * evolveConsultationPlan — merges an existing plan with new assignments,
 *   replacing only the affected roles and preserving the rest.
 *
 * detectAffectedRoles    — cross-references the active plan against the
 *   updated profile to identify conflicts with new customer preferences.
 *
 * Pure functions — no I/O, no side effects, no stored state.
 */

import { mkcCatalogue }            from "../mkc/catalogue";
import type { FragranceKnowledge } from "../mkc/types";
import { planCollection }          from "./collectionPlanner";
import type {
  ConversationProfile,
  ConsultationPlan,
  ConsultationRole,
  CollectionType,
  RefinementState,
  ExplorationTarget,
} from "./types";

// ── Intelligence hint patterns (EP18-P2) ─────────────────────────────────────

const INTELLIGENCE_HINTS: Array<{
  patterns:  string[];
  dimension: string;
  direction: "more" | "less";
}> = [
  {
    patterns:  ["less sweet", "not as sweet", "less sugary"],
    dimension: "sweetness",
    direction: "less",
  },
  {
    patterns:  ["sweeter", "more sweet"],
    dimension: "sweetness",
    direction: "more",
  },
  {
    patterns:  ["less intense", "softer", "quieter", "more subtle", "subtler"],
    dimension: "intensity",
    direction: "less",
  },
];

// ── Exploration character preference patterns (EP18-P2) ───────────────────────

const EXPLORATION_CHARACTER: Array<{
  pattern:   RegExp;
  character: string;
}> = [
  {
    pattern:   /\b(fresher|lighter|airier|more fresh|something fresh|something lighter)\b/i,
    character: "Fresh & Light",
  },
  {
    pattern:   /\b(warmer|richer|heavier|more warm|something warmer|something richer)\b/i,
    character: "Rich & Long Wearing",
  },
  {
    pattern:   /\b(more balanced|more versatile|something balanced|something versatile)\b/i,
    character: "Balanced Signature",
  },
  {
    pattern:   /\b(more intense|bolder|darker|a statement|statement option)\b/i,
    character: "Deep & Intense",
  },
];

// ── Occasion keywords for role title matching (EP18-P2) ──────────────────────

const ROLE_OCCASION_KEYWORDS = new Set([
  "evening", "morning", "daily", "travel", "office", "work",
  "formal", "dinner", "statement", "weekend", "casual", "everyday", "signature",
]);

// ── Discovery role titles ─────────────────────────────────────────────────────

const DISCOVERY_TITLES: Record<string, string> = {
  "Fresh & Light":       "Fresh Option",
  "Balanced Signature":  "Signature Option",
  "Rich & Long Wearing": "Rich Option",
  "Deep & Intense":      "Statement Option",
};

function discoveryTitle(f: FragranceKnowledge, index: number): string {
  return DISCOVERY_TITLES[f.scentCharacter] ?? `Option ${index + 1}`;
}

// ── Character signal patterns ─────────────────────────────────────────────────

const CHARACTER_SIGNALS: Array<{
  pattern:  RegExp;
  prefers:  string;
  replaces: string[];
}> = [
  {
    pattern:  /\b(fresher|lighter|more fresh|airier|less heavy|less intense|something fresh|something lighter)\b/i,
    prefers:  "Fresh & Light",
    replaces: ["Rich & Long Wearing", "Deep & Intense"],
  },
  {
    pattern:  /\b(warmer|richer|heavier|deeper|more warm|more rich|more intense|something warmer|something richer)\b/i,
    prefers:  "Rich & Long Wearing",
    replaces: ["Fresh & Light"],
  },
  {
    pattern:  /\b(more balanced|more versatile|more everyday|something balanced|something versatile)\b/i,
    prefers:  "Balanced Signature",
    replaces: ["Deep & Intense", "Rich & Long Wearing"],
  },
];

// ── Budget signal pattern ─────────────────────────────────────────────────────

const BUDGET_RE =
  /\b(cheaper|less expensive|more affordable|lower budget|within.*budget|budget.*changed|updated.*budget|more to spend|increase.*budget|higher budget|increased my budget)\b/i;

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Builds a ConsultationPlan from the last set of recommended slugs.
 *
 * When a CollectionBrief is derivable from the profile, fragrances are matched
 * to roles by scentCharacter. When no collection intent is active, a Discovery
 * plan is produced where each fragrance fills a generic role.
 *
 * Returns null when slugs is empty or none resolve in the catalogue.
 */
export function buildConsultationPlan(
  slugs:    string[],
  profile?: ConversationProfile
): ConsultationPlan | null {
  if (slugs.length === 0) return null;

  const fragrances = slugs
    .map((s) => mkcCatalogue.find((k) => k.slug === s))
    .filter((k): k is FragranceKnowledge => !!k);

  if (fragrances.length === 0) return null;

  const brief = profile ? planCollection(profile) : null;

  if (brief && brief.roles.length > 0) {
    // Collection-aware: match each role to the best available fragrance by character
    const usedSlugs = new Set<string>();
    const roles: ConsultationRole[] = [];

    for (const role of brief.roles) {
      const byChar   = fragrances.find((f) => f.scentCharacter === role.character && !usedSlugs.has(f.slug));
      const fallback = fragrances.find((f) => !usedSlugs.has(f.slug));
      const assigned = byChar ?? fallback;

      if (assigned) {
        usedSlugs.add(assigned.slug);
        roles.push({
          position:  role.position,
          character: role.character,
          title:     role.title,
          slug:      assigned.slug,
          name:      assigned.name,
        });
      }
    }

    if (roles.length > 0) {
      return { type: brief.type, label: brief.label, roles };
    }
  }

  // Discovery plan — each fragrance becomes its own role
  const roles = fragrances.slice(0, 4).map((f, i) => ({
    position:  i + 1,
    character: f.scentCharacter,
    title:     discoveryTitle(f, i),
    slug:      f.slug,
    name:      f.name,
  }));

  return {
    type:  "Discovery" as CollectionType | "Discovery",
    label: "Current Consultation",
    roles,
  };
}

/**
 * Evolves an existing ConsultationPlan by replacing only the affected roles
 * with new assignments from a freshly built plan. All other roles are
 * preserved exactly as they were — Refinement 4: minimal recommendation churn.
 */
export function evolveConsultationPlan(
  existing:      ConsultationPlan,
  affectedRoles: ConsultationRole[],
  newPlan:       ConsultationPlan
): ConsultationPlan {
  const affectedSlugs = new Set(affectedRoles.map((r) => r.slug));
  const usedNewSlugs  = new Set<string>();

  const updatedRoles = existing.roles.map((role) => {
    if (!affectedSlugs.has(role.slug)) return role; // Preserve unchanged role

    // Find a new assignment matching this character from the new plan
    const replacement =
      newPlan.roles.find((nr) => nr.character === role.character && !usedNewSlugs.has(nr.slug)) ??
      newPlan.roles.find((nr) => !usedNewSlugs.has(nr.slug));

    if (replacement) {
      usedNewSlugs.add(replacement.slug);
      return { ...role, slug: replacement.slug, name: replacement.name };
    }
    return role; // Fallback: keep old assignment if no replacement found
  });

  return { ...existing, roles: updatedRoles };
}

/**
 * Detects which roles in the active ConsultationPlan conflict with the
 * updated customer profile. Returns a RefinementState or null when no
 * refinement is warranted.
 *
 * Checks:
 * 1. Note conflicts     — avoided notes present in assigned fragrance
 * 2. Family conflicts   — avoided families matching assigned fragrance family
 * 3. Character signals  — "something fresher/warmer" in message text
 * 4. Budget signals     — "cheaper", "budget changed" (no role replacement,
 *                         but triggers fresh retrieval for better-value options)
 */
export function detectAffectedRoles(
  plan:    ConsultationPlan,
  profile: ConversationProfile,
  message: string
): RefinementState | null {
  const avoidedNotes    = (profile.avoidedNotes?.value    ?? []).map((n) => n.toLowerCase());
  const avoidedFamilies = (profile.avoidedFamilies?.value ?? []).map((f) => f.toLowerCase());
  const isBudgetChange  = BUDGET_RE.test(message);

  const affected: ConsultationRole[] = [];
  const reasons:  string[]           = [];

  // ── Cross-reference each role against profile avoidances ─────────────────
  for (const role of plan.roles) {
    if (!role.slug) continue;
    const fragrance = mkcCatalogue.find((k) => k.slug === role.slug);
    if (!fragrance) continue;

    const allNotes = [
      ...fragrance.notes.top,
      ...fragrance.notes.heart,
      ...fragrance.notes.base,
    ].map((n) => n.toLowerCase());

    const noteConflict = avoidedNotes.find((an) =>
      allNotes.some((n) => n.includes(an) || an.includes(n))
    );
    const familyConflict = avoidedFamilies.find((af) =>
      fragrance.family.some(
        (f) => f.toLowerCase().includes(af) || af.includes(f.toLowerCase())
      )
    );

    if (noteConflict) {
      affected.push(role);
      const label = `avoids ${noteConflict}`;
      if (!reasons.includes(label)) reasons.push(label);
    } else if (familyConflict) {
      affected.push(role);
      const label = `avoids ${familyConflict} family`;
      if (!reasons.includes(label)) reasons.push(label);
    }
  }

  // ── Character signal — replace the role most opposite to the preferred character
  if (affected.length === 0 && !isBudgetChange) {
    for (const signal of CHARACTER_SIGNALS) {
      if (!signal.pattern.test(message)) continue;
      const roleToReplace = plan.roles.find((r) => signal.replaces.includes(r.character));
      if (roleToReplace) {
        affected.push(roleToReplace);
        reasons.push(`customer prefers ${signal.prefers} character`);
      }
      break;
    }
  }

  // No conflicts and no budget signal — not a refinement turn
  if (affected.length === 0 && !isBudgetChange) return null;

  const reason = reasons.length > 0
    ? reasons.join("; ")
    : "budget guidance updated";

  return { affectedRoles: affected, reason, budgetRefinement: isBudgetChange };
}

/**
 * Identifies which role in the active ConsultationPlan the customer is
 * exploring alternatives for. Returns an ExplorationTarget describing the
 * role, optional character preference (direction change), and optional
 * Intelligence hint (score-based filtering).
 *
 * Role identification priority:
 * 1. Occasion keyword in role title — "evening", "travel", "daily"…
 * 2. Ordinal reference — "the second one", "first one"
 * 3. Character preference direction — role mismatching the requested character
 *    (or the matching role when exploring within the same character)
 * 4. selectedSlug — most recently focused fragrance
 * 5. Fallback — last role in the plan
 *
 * Returns null when the plan has no roles.
 */
export function detectExplorationTarget(
  plan:          ConsultationPlan,
  message:       string,
  selectedSlug?: string
): ExplorationTarget | null {
  if (plan.roles.length === 0) return null;

  const q = message.toLowerCase();

  // 1. Intelligence hint
  let intelligenceHint: { dimension: string; direction: "more" | "less" } | undefined;
  for (const hint of INTELLIGENCE_HINTS) {
    if (hint.patterns.some((p) => q.includes(p))) {
      intelligenceHint = { dimension: hint.dimension, direction: hint.direction };
      break;
    }
  }

  // 2. Character preference (direction change or within-character exploration)
  let characterPref: string | undefined;
  for (const entry of EXPLORATION_CHARACTER) {
    if (entry.pattern.test(message)) {
      characterPref = entry.character;
      break;
    }
  }

  // 3. Find target role
  let targetRole: ConsultationRole | null = null;

  // 3a. Role title occasion keyword
  for (const role of plan.roles) {
    const titleWords = role.title.toLowerCase().split(/\s+/);
    const matched = titleWords.some(
      (w) => ROLE_OCCASION_KEYWORDS.has(w) && q.includes(w)
    );
    if (matched) {
      targetRole = role;
      break;
    }
  }

  // 3b. Ordinal reference
  if (!targetRole) {
    const ordinalMatch = q.match(/\b(first|second|third)\b/);
    if (ordinalMatch) {
      const ordinalMap: Record<string, number> = { first: 1, second: 2, third: 3 };
      const pos = ordinalMap[ordinalMatch[1]];
      if (pos !== undefined) {
        targetRole = plan.roles.find((r) => r.position === pos) ?? null;
      }
    }
  }

  // 3c. Character preference direction
  if (!targetRole && characterPref) {
    const matchingRole = plan.roles.find((r) => r.character === characterPref);
    if (matchingRole) {
      // A role already fills this character — explore alternatives within it
      targetRole    = matchingRole;
      characterPref = undefined; // No direction change; same character
    } else {
      // No role of this character — customer wants to change the opposing role
      targetRole = plan.roles.find((r) => r.character !== characterPref) ?? null;
    }
  }

  // 3d. Selected slug fallback
  if (!targetRole && selectedSlug) {
    targetRole = plan.roles.find((r) => r.slug === selectedSlug) ?? null;
  }

  // 3e. Last role in plan
  if (!targetRole) {
    targetRole = plan.roles[plan.roles.length - 1] ?? plan.roles[0] ?? null;
  }

  if (!targetRole) return null;

  // 4. Build reason string
  let reason: string;
  if (characterPref) {
    reason = `customer wants ${characterPref} alternative for ${targetRole.title}`;
  } else if (intelligenceHint) {
    reason = `customer wants ${intelligenceHint.direction} ${intelligenceHint.dimension} option for ${targetRole.title}`;
  } else {
    reason = `customer wants another option for ${targetRole.title}`;
  }

  return { role: targetRole, characterPref, intelligenceHint, reason };
}
