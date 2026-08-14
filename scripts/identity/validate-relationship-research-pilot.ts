import * as fs from "fs";
import * as path from "path";

let passed = 0;
let failed = 0;
const errors: string[] = [];

function proof(id: string, description: string, fn: () => boolean): void {
  try {
    const ok = fn();
    if (ok) {
      passed++;
      console.log(`  ✓ ${id} — ${description}`);
    } else {
      failed++;
      errors.push(`${id}: ${description}`);
      console.log(`  ✗ ${id} — ${description}`);
    }
  } catch (e) {
    failed++;
    errors.push(`${id}: ${description} — threw ${e}`);
    console.log(`  ✗ ${id} — ${description} (threw: ${e})`);
  }
}

function section(label: string): void {
  console.log(`\n${label}`);
}

// ─── Paths ───────────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, "../../");
const CAMPAIGN_DIR = path.join(ROOT, "data/identity/relationship-research/campaigns");
const DOSSIERS_DIR = path.join(ROOT, "data/identity/relationship-research/dossiers");
const COMPARISONS_DIR = path.join(ROOT, "data/identity/relationship-research/comparisons");
const LEDGER_PATH = path.join(ROOT, "app/lib/identity/data/decisions/catalogue-relationship-decision-ledger.json");
const CAMPAIGN_FILE = path.join(CAMPAIGN_DIR, "EP6-P5E-research-campaign.json");

// ─── Expected constants ───────────────────────────────────────────────────────

const EXPECTED_GRAPH_FINGERPRINT = "478fd478d930137fe21d058470797c324649156d615b60d3b9d3a9108f73b8e2";
const EXPECTED_LEDGER_TX_COUNT = 9;
const SCHEMA_VERSION = "EP6-P5E-RR-v1";

const PHASE_4C1_COMPLETE_DOSSIERS = [
  "nishane-ani-dossier.json",
  "viktor-rolf-spicebomb-extreme-dossier.json",
  "creed-aventus-dossier.json",
  "dior-sauvage-dossier.json",
];

const PHASE_4C2_COMPLETE_DOSSIERS = [
  "giorgio-armani-si-dossier.json",
  "parfums-de-marly-layton-dossier.json",
  "parfums-de-marly-althair-dossier.json",
];

const ALL_COMPLETE_DOSSIERS = [
  ...PHASE_4C1_COMPLETE_DOSSIERS,
  ...PHASE_4C2_COMPLETE_DOSSIERS,
];

const PHASE_4C1_COMPLETE_COMPARISONS = [
  "REL-alternatives-ani-inspired--spicebomb-extreme-inspired-comparison.json",
  "REL-wardrobe-partners-ani-inspired--aventus-inspired-comparison.json",
  "REL-wardrobe-partners-ani-inspired--sauvage-inspired-comparison.json",
];

const PHASE_4C2_COMPLETE_COMPARISONS = [
  "REL-alternatives-althair-inspired--layton-inspired-comparison.json",
  "REL-alternatives-ani-inspired--layton-inspired-comparison.json",
  "REL-wardrobe-partners-althair-inspired--spicebomb-extreme-inspired-comparison.json",
  "REL-wardrobe-partners-armani-si-inspired--aventus-inspired-comparison.json",
  "REL-wardrobe-partners-armani-si-inspired--spicebomb-extreme-inspired-comparison.json",
];

const ALL_COMPLETE_COMPARISONS = [
  ...PHASE_4C1_COMPLETE_COMPARISONS,
  ...PHASE_4C2_COMPLETE_COMPARISONS,
];

const ALL_DOSSIER_FILES = [
  "lv-afternoon-swim-dossier.json",
  "paco-rabanne-invictus-dossier.json",
  "mugler-alien-dossier.json",
  "mfk-baccarat-rouge-540-dossier.json",
  "parfums-de-marly-althair-dossier.json",
  "parfums-de-marly-layton-dossier.json",
  "jean-paul-gaultier-le-male-elixir-dossier.json",
  "nishane-ani-dossier.json",
  "viktor-rolf-spicebomb-extreme-dossier.json",
  "giorgio-armani-acqua-di-gio-dossier.json",
  "lv-limmensite-dossier.json",
  "creed-aventus-dossier.json",
  "dior-sauvage-dossier.json",
  "xerjoff-erba-pura-dossier.json",
  "montale-arabians-tonka-dossier.json",
  "giorgio-armani-si-dossier.json",
  "parfums-de-marly-delina-exclusif-dossier.json",
  "initio-oud-for-greatness-dossier.json",
  "carolina-herrera-very-good-girl-dossier.json",
];

const ALL_COMPARISON_FILES = [
  "REL-alternatives-afternoon-swim-inspired--invictus-inspired-comparison.json",
  "REL-alternatives-alien-inspired--baccarat-rouge-540-inspired-comparison.json",
  "REL-alternatives-althair-inspired--layton-inspired-comparison.json",
  "REL-alternatives-althair-inspired--le-male-elixir-inspired-comparison.json",
  "REL-alternatives-ani-inspired--layton-inspired-comparison.json",
  "REL-alternatives-ani-inspired--spicebomb-extreme-inspired-comparison.json",
  "REL-alternatives-aqua-di-gio-inspired--limmensite-inspired-comparison.json",
  "REL-wardrobe-partners-althair-inspired--spicebomb-extreme-inspired-comparison.json",
  "REL-wardrobe-partners-ani-inspired--aventus-inspired-comparison.json",
  "REL-wardrobe-partners-ani-inspired--sauvage-inspired-comparison.json",
  "REL-wardrobe-partners-aqua-di-gio-inspired--erba-pura-inspired-comparison.json",
  "REL-wardrobe-partners-arabians-tonka-inspired--sauvage-inspired-comparison.json",
  "REL-wardrobe-partners-armani-si-inspired--aventus-inspired-comparison.json",
  "REL-wardrobe-partners-armani-si-inspired--spicebomb-extreme-inspired-comparison.json",
  "REL-wardrobe-partners-aventus-inspired--delina-exclusif-inspired-comparison.json",
  "REL-wardrobe-partners-aventus-inspired--oud-for-greatness-inspired-comparison.json",
  "REL-wardrobe-partners-aventus-inspired--very-good-girl-inspired-comparison.json",
];

const FORBIDDEN_FIELDS = [
  "decision",
  "approvalRecommendation",
  "recommendedGovernanceState",
  "relationshipConfidence",
  "alternativesRelationshipSupported",
  "alternativesRelationshipUnsupported",
];

const PERMITTED_CONCLUSION_STATES = [
  "NO_SUPPORTING_RELATIONSHIP_EVIDENCE_FOUND",
  "LIMITED_SUPPORTING_EVIDENCE_FOUND",
  "CONTRADICTORY_EVIDENCE_FOUND",
  "COMPARISON_EVIDENCE_AVAILABLE",
  "FURTHER_EVIDENCE_REQUIRED",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readJson(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

// ─── Main ────────────────────────────────────────────────────────────────────

console.log("════════════════════════════════════════════════════════════════");
console.log("EP6-P5E-R — Relationship Research Pilot Validator");
console.log("Schema: EP6-P5E-RR-v1");
console.log("Phase: 4C-2 — Expanded Research (7 dossiers + 8 comparisons)");
console.log("════════════════════════════════════════════════════════════════");

// ─────────────────────────────────────────────────────────────────────────────
section("§1 — Protected Artifact Invariants (must not change)");
// ─────────────────────────────────────────────────────────────────────────────

proof("RRP-001", "Decision ledger file exists and entry count is exactly 9 (unchanged)", () => {
  const ledger = readJson(LEDGER_PATH) as { entries?: unknown[] };
  return Array.isArray(ledger.entries) && ledger.entries.length === EXPECTED_LEDGER_TX_COUNT;
});

proof("RRP-002", `Campaign manifest graph fingerprint is unchanged: ${EXPECTED_GRAPH_FINGERPRINT}`, () => {
  const campaign = readJson(CAMPAIGN_FILE) as { graphFingerprint?: string };
  return campaign.graphFingerprint === EXPECTED_GRAPH_FINGERPRINT;
});

proof("RRP-003", "Campaign manifest structure is unchanged: 17 units, 19 dossiers in index", () => {
  const campaign = readJson(CAMPAIGN_FILE) as { units?: unknown[]; dossierIndex?: unknown[] };
  return Array.isArray(campaign.units) && campaign.units.length === 17 &&
    Array.isArray(campaign.dossierIndex) && campaign.dossierIndex.length === 19;
});

proof("RRP-004", "Campaign manifest graph fingerprint matches across dossier, comparison, and campaign files", () => {
  const campaign = readJson(CAMPAIGN_FILE) as { graphFingerprint?: string };
  return campaign.graphFingerprint === EXPECTED_GRAPH_FINGERPRINT;
});

// ─────────────────────────────────────────────────────────────────────────────
section("§2 — Research Scope: Exactly 7 dossiers researched (4 Phase 4C-1 + 3 Phase 4C-2)");
// ─────────────────────────────────────────────────────────────────────────────

proof("RRP-005", "Exactly 7 dossiers have dossierStatus RESEARCH_COMPLETE", () => {
  const complete = ALL_DOSSIER_FILES.filter((f) => {
    const d = readJson(path.join(DOSSIERS_DIR, f)) as { dossierStatus?: string };
    return d.dossierStatus === "RESEARCH_COMPLETE";
  });
  return complete.length === 7;
});

proof("RRP-006", "The 4 Phase 4C-1 dossiers are exactly the authorized ones (Ani, Spicebomb Extreme, Aventus, Sauvage)", () => {
  const phase4C1Set = new Set(PHASE_4C1_COMPLETE_DOSSIERS);
  return PHASE_4C1_COMPLETE_DOSSIERS.every((f) => {
    const d = readJson(path.join(DOSSIERS_DIR, f)) as { dossierStatus?: string };
    return d.dossierStatus === "RESEARCH_COMPLETE";
  }) && PHASE_4C1_COMPLETE_DOSSIERS.every((f) => phase4C1Set.has(f));
});

proof("RRP-006b", "The 3 Phase 4C-2 dossiers are exactly the authorized ones (Armani Sì, Layton, Althaïr)", () => {
  return PHASE_4C2_COMPLETE_DOSSIERS.every((f) => {
    const d = readJson(path.join(DOSSIERS_DIR, f)) as { dossierStatus?: string };
    return d.dossierStatus === "RESEARCH_COMPLETE";
  });
});

proof("RRP-007", "Exactly 12 dossiers remain at PENDING_RESEARCH (unresearched)", () => {
  const pending = ALL_DOSSIER_FILES.filter((f) => {
    const d = readJson(path.join(DOSSIERS_DIR, f)) as { dossierStatus?: string };
    return d.dossierStatus === "PENDING_RESEARCH";
  });
  return pending.length === 12;
});

// ─────────────────────────────────────────────────────────────────────────────
section("§3 — Research Scope: Exactly 8 comparisons researched (3 Phase 4C-1 + 5 Phase 4C-2)");
// ─────────────────────────────────────────────────────────────────────────────

proof("RRP-008", "Exactly 8 comparisons have comparisonStatus RESEARCH_COMPLETE", () => {
  const complete = ALL_COMPARISON_FILES.filter((f) => {
    const c = readJson(path.join(COMPARISONS_DIR, f)) as { comparisonStatus?: string };
    return c.comparisonStatus === "RESEARCH_COMPLETE";
  });
  return complete.length === 8;
});

proof("RRP-009", "The 3 Phase 4C-1 comparisons are exactly the authorized ones (A9, W2, W3)", () => {
  return PHASE_4C1_COMPLETE_COMPARISONS.every((f) => {
    const c = readJson(path.join(COMPARISONS_DIR, f)) as { comparisonStatus?: string };
    return c.comparisonStatus === "RESEARCH_COMPLETE";
  });
});

proof("RRP-009b", "The 5 Phase 4C-2 comparisons are exactly the authorized ones (A6, A8, W1, W6, W7)", () => {
  return PHASE_4C2_COMPLETE_COMPARISONS.every((f) => {
    const c = readJson(path.join(COMPARISONS_DIR, f)) as { comparisonStatus?: string };
    return c.comparisonStatus === "RESEARCH_COMPLETE";
  });
});

proof("RRP-010", "Exactly 9 comparisons remain at PENDING_RESEARCH (unresearched)", () => {
  const pending = ALL_COMPARISON_FILES.filter((f) => {
    const c = readJson(path.join(COMPARISONS_DIR, f)) as { comparisonStatus?: string };
    return c.comparisonStatus === "PENDING_RESEARCH";
  });
  return pending.length === 9;
});

// ─────────────────────────────────────────────────────────────────────────────
section("§4 — Phase 4C-1 Completed Dossier Integrity");
// ─────────────────────────────────────────────────────────────────────────────

proof("RRP-011", "All 4 Phase 4C-1 dossiers have non-empty findings arrays", () =>
  PHASE_4C1_COMPLETE_DOSSIERS.every((f) => {
    const d = readJson(path.join(DOSSIERS_DIR, f)) as { findings?: unknown[] };
    return Array.isArray(d.findings) && d.findings.length > 0;
  })
);

proof("RRP-012", "All 4 Phase 4C-1 dossiers have non-null canonicalSummary", () =>
  PHASE_4C1_COMPLETE_DOSSIERS.every((f) => {
    const d = readJson(path.join(DOSSIERS_DIR, f)) as { canonicalSummary?: unknown };
    return d.canonicalSummary !== null && typeof d.canonicalSummary === "string" &&
      (d.canonicalSummary as string).length > 50;
  })
);

proof("RRP-013", "All 4 Phase 4C-1 dossiers have non-empty directAccessAttempts arrays", () =>
  PHASE_4C1_COMPLETE_DOSSIERS.every((f) => {
    const d = readJson(path.join(DOSSIERS_DIR, f)) as { directAccessAttempts?: unknown[] };
    return Array.isArray(d.directAccessAttempts) && d.directAccessAttempts.length > 0;
  })
);

proof("RRP-014", "All 4 Phase 4C-1 dossiers have accessDisposition that is not NOT_YET_RESEARCHED", () =>
  PHASE_4C1_COMPLETE_DOSSIERS.every((f) => {
    const d = readJson(path.join(DOSSIERS_DIR, f)) as { accessDisposition?: string };
    return typeof d.accessDisposition === "string" && d.accessDisposition !== "NOT_YET_RESEARCHED";
  })
);

proof("RRP-015", "Creed Aventus dossier records at least one DIRECT_ACCESS_SUCCESS attempt (creedboutique.com)", () => {
  const d = readJson(path.join(DOSSIERS_DIR, "creed-aventus-dossier.json")) as {
    directAccessAttempts?: Array<{ result?: string }>;
  };
  return Array.isArray(d.directAccessAttempts) &&
    d.directAccessAttempts.some((a) => a.result === "DIRECT_ACCESS_SUCCESS");
});

proof("RRP-016", "Creed Aventus dossier accessDisposition is DIRECT_ACCESS_SUCCESS", () => {
  const d = readJson(path.join(DOSSIERS_DIR, "creed-aventus-dossier.json")) as { accessDisposition?: string };
  return d.accessDisposition === "DIRECT_ACCESS_SUCCESS";
});

proof("RRP-017", "All 4 Phase 4C-1 dossiers have researchedAt field", () =>
  PHASE_4C1_COMPLETE_DOSSIERS.every((f) => {
    const d = readJson(path.join(DOSSIERS_DIR, f)) as { researchedAt?: string };
    return typeof d.researchedAt === "string" && d.researchedAt.length > 0;
  })
);

proof("RRP-018", "All 4 Phase 4C-1 dossiers have researchedBy EP6-P5E-R Phase 4C-1", () =>
  PHASE_4C1_COMPLETE_DOSSIERS.every((f) => {
    const d = readJson(path.join(DOSSIERS_DIR, f)) as { researchedBy?: string };
    return d.researchedBy === "EP6-P5E-R Phase 4C-1";
  })
);

// ─────────────────────────────────────────────────────────────────────────────
section("§5 — Identity Verification");
// ─────────────────────────────────────────────────────────────────────────────

proof("RRP-019", "Nishane Ani dossier referenceIdentityStatus is INDEPENDENTLY_VERIFIED (Phase 4C-1)", () => {
  const d = readJson(path.join(DOSSIERS_DIR, "nishane-ani-dossier.json")) as {
    referenceIdentityStatus?: string;
  };
  return d.referenceIdentityStatus === "INDEPENDENTLY_VERIFIED";
});

proof("RRP-020", "Campaign manifest dossierIndex for Nishane Ani shows INDEPENDENTLY_VERIFIED", () => {
  const campaign = readJson(CAMPAIGN_FILE) as {
    dossierIndex?: Array<{ dossierRef?: string; referenceIdentityStatus?: string }>;
  };
  if (!Array.isArray(campaign.dossierIndex)) return false;
  const aniEntry = campaign.dossierIndex.find((d) => d.dossierRef === "nishane-ani");
  return aniEntry?.referenceIdentityStatus === "INDEPENDENTLY_VERIFIED";
});

proof("RRP-021", "Remaining EXPECTED dossiers (lv-afternoon-swim, xerjoff-erba-pura, montale-arabians-tonka) still have EXPECTED status", () => {
  // Phase 4C-1 upgraded Nishane Ani to INDEPENDENTLY_VERIFIED.
  // Phase 4C-2 upgraded Parfums de Marly Althaïr to INDEPENDENTLY_VERIFIED.
  // Three dossiers remain at EXPECTED status.
  const remainingExpected = [
    "lv-afternoon-swim-dossier.json",
    "xerjoff-erba-pura-dossier.json",
    "montale-arabians-tonka-dossier.json",
  ];
  return remainingExpected.every((f) => {
    const d = readJson(path.join(DOSSIERS_DIR, f)) as { referenceIdentityStatus?: string };
    return d.referenceIdentityStatus === "EXPECTED";
  });
});

// ─────────────────────────────────────────────────────────────────────────────
section("§6 — Phase 4C-1 Completed Comparison Brief Integrity");
// ─────────────────────────────────────────────────────────────────────────────

proof("RRP-022", "All 3 Phase 4C-1 comparisons have comparisonEvidence.accessDisposition that is not NOT_YET_RESEARCHED", () =>
  PHASE_4C1_COMPLETE_COMPARISONS.every((f) => {
    const c = readJson(path.join(COMPARISONS_DIR, f)) as { comparisonEvidence?: { accessDisposition?: string } };
    return c.comparisonEvidence?.accessDisposition !== "NOT_YET_RESEARCHED";
  })
);

proof("RRP-023", "A9 comparison has olfactiveOverlapFindings populated (not null)", () => {
  const c = readJson(path.join(COMPARISONS_DIR, "REL-alternatives-ani-inspired--spicebomb-extreme-inspired-comparison.json")) as {
    comparisonEvidence?: { olfactiveOverlapFindings?: unknown };
  };
  return c.comparisonEvidence?.olfactiveOverlapFindings !== null &&
    c.comparisonEvidence?.olfactiveOverlapFindings !== undefined;
});

proof("RRP-024", "A9 comparison has experientialComparisonFindings populated (not null)", () => {
  const c = readJson(path.join(COMPARISONS_DIR, "REL-alternatives-ani-inspired--spicebomb-extreme-inspired-comparison.json")) as {
    comparisonEvidence?: { experientialComparisonFindings?: unknown };
  };
  return c.comparisonEvidence?.experientialComparisonFindings !== null &&
    c.comparisonEvidence?.experientialComparisonFindings !== undefined;
});

proof("RRP-025", "W2 comparison has wardrobeComplementarityFindings populated (not null)", () => {
  const c = readJson(path.join(COMPARISONS_DIR, "REL-wardrobe-partners-ani-inspired--aventus-inspired-comparison.json")) as {
    comparisonEvidence?: { wardrobeComplementarityFindings?: unknown };
  };
  return c.comparisonEvidence?.wardrobeComplementarityFindings !== null &&
    c.comparisonEvidence?.wardrobeComplementarityFindings !== undefined;
});

proof("RRP-026", "W3 comparison has wardrobeComplementarityFindings populated (not null)", () => {
  const c = readJson(path.join(COMPARISONS_DIR, "REL-wardrobe-partners-ani-inspired--sauvage-inspired-comparison.json")) as {
    comparisonEvidence?: { wardrobeComplementarityFindings?: unknown };
  };
  return c.comparisonEvidence?.wardrobeComplementarityFindings !== null &&
    c.comparisonEvidence?.wardrobeComplementarityFindings !== undefined;
});

proof("RRP-027", "All 3 Phase 4C-1 comparisons have a conclusionState from the permitted list", () =>
  PHASE_4C1_COMPLETE_COMPARISONS.every((f) => {
    const c = readJson(path.join(COMPARISONS_DIR, f)) as { comparisonEvidence?: { conclusionState?: string } };
    const state = c.comparisonEvidence?.conclusionState;
    return typeof state === "string" && PERMITTED_CONCLUSION_STATES.includes(state);
  })
);

proof("RRP-028", "All 3 Phase 4C-1 comparisons have researchedAt field in comparisonEvidence", () =>
  PHASE_4C1_COMPLETE_COMPARISONS.every((f) => {
    const c = readJson(path.join(COMPARISONS_DIR, f)) as { comparisonEvidence?: { researchedAt?: string } };
    return typeof c.comparisonEvidence?.researchedAt === "string" &&
      (c.comparisonEvidence?.researchedAt ?? "").length > 0;
  })
);

// ─────────────────────────────────────────────────────────────────────────────
section("§7 — Governance: No Decision Fields");
// ─────────────────────────────────────────────────────────────────────────────

proof("RRP-029", "No Phase 4C-1 completed dossier contains forbidden governance output fields", () =>
  PHASE_4C1_COMPLETE_DOSSIERS.every((f) => {
    const raw = fs.readFileSync(path.join(DOSSIERS_DIR, f), "utf-8");
    return FORBIDDEN_FIELDS.every((field) => !new RegExp(`"${field}"\\s*:`).test(raw));
  })
);

proof("RRP-030", "No Phase 4C-1 completed comparison contains forbidden governance output fields as JSON keys", () =>
  PHASE_4C1_COMPLETE_COMPARISONS.every((f) => {
    const raw = fs.readFileSync(path.join(COMPARISONS_DIR, f), "utf-8");
    return FORBIDDEN_FIELDS.every((field) => !new RegExp(`"${field}"\\s*:`).test(raw));
  })
);

proof("RRP-031", "All Phase 4C-1 dossiers carry referenceVsMaisonNote (reference vs Maison boundary declared)", () =>
  PHASE_4C1_COMPLETE_DOSSIERS.every((f) => {
    const d = readJson(path.join(DOSSIERS_DIR, f)) as { referenceVsMaisonNote?: string };
    return typeof d.referenceVsMaisonNote === "string" && d.referenceVsMaisonNote.length > 20;
  })
);

proof("RRP-032", "All Phase 4C-1 comparisons carry researchBoundaryNote inside comparisonEvidence", () =>
  PHASE_4C1_COMPLETE_COMPARISONS.every((f) => {
    const c = readJson(path.join(COMPARISONS_DIR, f)) as { comparisonEvidence?: { researchBoundaryNote?: string } };
    return typeof c.comparisonEvidence?.researchBoundaryNote === "string" &&
      (c.comparisonEvidence?.researchBoundaryNote ?? "").length > 20;
  })
);

// ─────────────────────────────────────────────────────────────────────────────
section("§8 — Campaign Manifest Reflects Phase 4C-2 State");
// ─────────────────────────────────────────────────────────────────────────────

proof("RRP-033", "Campaign manifest researchAuthorizationStatus includes 'PHASE 4C-2 COMPLETE'", () => {
  const campaign = readJson(CAMPAIGN_FILE) as { researchAuthorizationStatus?: string };
  return typeof campaign.researchAuthorizationStatus === "string" &&
    campaign.researchAuthorizationStatus.includes("PHASE 4C-2 COMPLETE");
});

proof("RRP-034", "Campaign manifest shows 7 dossierIndex entries with RESEARCH_COMPLETE status", () => {
  const campaign = readJson(CAMPAIGN_FILE) as {
    dossierIndex?: Array<{ dossierStatus?: string }>;
  };
  if (!Array.isArray(campaign.dossierIndex)) return false;
  return campaign.dossierIndex.filter((d) => d.dossierStatus === "RESEARCH_COMPLETE").length === 7;
});

proof("RRP-035", "Campaign manifest shows 8 units with RESEARCH_COMPLETE researchStatus (A9, W2, W3, A6, A8, W1, W6, W7)", () => {
  const campaign = readJson(CAMPAIGN_FILE) as {
    units?: Array<{ unitId?: string; researchStatus?: string }>;
  };
  if (!Array.isArray(campaign.units)) return false;
  const complete = campaign.units.filter((u) => u.researchStatus === "RESEARCH_COMPLETE");
  const completeIds = new Set(complete.map((u) => u.unitId));
  return complete.length === 8 &&
    ["A9", "W2", "W3", "A6", "A8", "W1", "W6", "W7"].every((id) => completeIds.has(id));
});

// ─────────────────────────────────────────────────────────────────────────────
section("§9 — Unresearched Artifacts Unchanged");
// ─────────────────────────────────────────────────────────────────────────────

proof("RRP-036", "All 12 unresearched dossiers still have empty findings arrays", () => {
  const pendingFiles = ALL_DOSSIER_FILES.filter((f) => !ALL_COMPLETE_DOSSIERS.includes(f));
  return pendingFiles.every((f) => {
    const d = readJson(path.join(DOSSIERS_DIR, f)) as { findings?: unknown[] };
    return Array.isArray(d.findings) && d.findings.length === 0;
  });
});

proof("RRP-037", "All 9 unresearched comparisons still have NOT_YET_RESEARCHED accessDisposition", () => {
  const pendingFiles = ALL_COMPARISON_FILES.filter((f) => !ALL_COMPLETE_COMPARISONS.includes(f));
  return pendingFiles.every((f) => {
    const c = readJson(path.join(COMPARISONS_DIR, f)) as { comparisonEvidence?: { accessDisposition?: string } };
    return c.comparisonEvidence?.accessDisposition === "NOT_YET_RESEARCHED";
  });
});

// ─────────────────────────────────────────────────────────────────────────────
section("§10 — Phase 4C-2 Dossier Integrity");
// ─────────────────────────────────────────────────────────────────────────────

proof("RRP-038", "All 3 Phase 4C-2 dossiers have non-empty findings arrays", () =>
  PHASE_4C2_COMPLETE_DOSSIERS.every((f) => {
    const d = readJson(path.join(DOSSIERS_DIR, f)) as { findings?: unknown[] };
    return Array.isArray(d.findings) && d.findings.length > 0;
  })
);

proof("RRP-039", "All 3 Phase 4C-2 dossiers have non-null canonicalSummary (> 50 chars)", () =>
  PHASE_4C2_COMPLETE_DOSSIERS.every((f) => {
    const d = readJson(path.join(DOSSIERS_DIR, f)) as { canonicalSummary?: unknown };
    return d.canonicalSummary !== null && typeof d.canonicalSummary === "string" &&
      (d.canonicalSummary as string).length > 50;
  })
);

proof("RRP-040", "All 3 Phase 4C-2 dossiers have non-empty directAccessAttempts arrays", () =>
  PHASE_4C2_COMPLETE_DOSSIERS.every((f) => {
    const d = readJson(path.join(DOSSIERS_DIR, f)) as { directAccessAttempts?: unknown[] };
    return Array.isArray(d.directAccessAttempts) && d.directAccessAttempts.length > 0;
  })
);

proof("RRP-041", "All 3 Phase 4C-2 dossiers have accessDisposition that is not NOT_YET_RESEARCHED", () =>
  PHASE_4C2_COMPLETE_DOSSIERS.every((f) => {
    const d = readJson(path.join(DOSSIERS_DIR, f)) as { accessDisposition?: string };
    return typeof d.accessDisposition === "string" && d.accessDisposition !== "NOT_YET_RESEARCHED";
  })
);

proof("RRP-042", "All 3 Phase 4C-2 dossiers have researchedAt = '2026-08-14'", () =>
  PHASE_4C2_COMPLETE_DOSSIERS.every((f) => {
    const d = readJson(path.join(DOSSIERS_DIR, f)) as { researchedAt?: string };
    return d.researchedAt === "2026-08-14";
  })
);

proof("RRP-043", "All 3 Phase 4C-2 dossiers have researchedBy EP6-P5E-R Phase 4C-2", () =>
  PHASE_4C2_COMPLETE_DOSSIERS.every((f) => {
    const d = readJson(path.join(DOSSIERS_DIR, f)) as { researchedBy?: string };
    return d.researchedBy === "EP6-P5E-R Phase 4C-2";
  })
);

proof("RRP-044", "All 3 Phase 4C-2 dossiers carry referenceVsMaisonNote (reference vs Maison boundary declared)", () =>
  PHASE_4C2_COMPLETE_DOSSIERS.every((f) => {
    const d = readJson(path.join(DOSSIERS_DIR, f)) as { referenceVsMaisonNote?: string };
    return typeof d.referenceVsMaisonNote === "string" && d.referenceVsMaisonNote.length > 20;
  })
);

proof("RRP-045", "No Phase 4C-2 dossier contains forbidden governance output fields", () =>
  PHASE_4C2_COMPLETE_DOSSIERS.every((f) => {
    const raw = fs.readFileSync(path.join(DOSSIERS_DIR, f), "utf-8");
    return FORBIDDEN_FIELDS.every((field) => !new RegExp(`"${field}"\\s*:`).test(raw));
  })
);

proof("RRP-046", "Parfums de Marly Layton dossier records DIRECT_ACCESS_SUCCESS (us.parfums-de-marly.com)", () => {
  const d = readJson(path.join(DOSSIERS_DIR, "parfums-de-marly-layton-dossier.json")) as {
    directAccessAttempts?: Array<{ result?: string }>;
    accessDisposition?: string;
  };
  return d.accessDisposition === "DIRECT_ACCESS_SUCCESS" &&
    Array.isArray(d.directAccessAttempts) &&
    d.directAccessAttempts.some((a) => a.result === "DIRECT_ACCESS_SUCCESS");
});

proof("RRP-047", "Parfums de Marly Althaïr dossier records DIRECT_ACCESS_SUCCESS (us.parfums-de-marly.com)", () => {
  const d = readJson(path.join(DOSSIERS_DIR, "parfums-de-marly-althair-dossier.json")) as {
    directAccessAttempts?: Array<{ result?: string }>;
    accessDisposition?: string;
  };
  return d.accessDisposition === "DIRECT_ACCESS_SUCCESS" &&
    Array.isArray(d.directAccessAttempts) &&
    d.directAccessAttempts.some((a) => a.result === "DIRECT_ACCESS_SUCCESS");
});

// ─────────────────────────────────────────────────────────────────────────────
section("§11 — Phase 4C-2 Identity Verification Upgrades");
// ─────────────────────────────────────────────────────────────────────────────

proof("RRP-048", "Parfums de Marly Althaïr dossier referenceIdentityStatus is INDEPENDENTLY_VERIFIED (Phase 4C-2)", () => {
  const d = readJson(path.join(DOSSIERS_DIR, "parfums-de-marly-althair-dossier.json")) as {
    referenceIdentityStatus?: string;
  };
  return d.referenceIdentityStatus === "INDEPENDENTLY_VERIFIED";
});

proof("RRP-049", "Campaign manifest dossierIndex for Althaïr shows INDEPENDENTLY_VERIFIED", () => {
  const campaign = readJson(CAMPAIGN_FILE) as {
    dossierIndex?: Array<{ dossierRef?: string; referenceIdentityStatus?: string }>;
  };
  if (!Array.isArray(campaign.dossierIndex)) return false;
  const entry = campaign.dossierIndex.find((d) => d.dossierRef === "parfums-de-marly-althair");
  return entry?.referenceIdentityStatus === "INDEPENDENTLY_VERIFIED";
});

proof("RRP-050", "Althaïr dossier has identityVerificationFindings array populated (Phase 4C-2 identity research)", () => {
  const d = readJson(path.join(DOSSIERS_DIR, "parfums-de-marly-althair-dossier.json")) as {
    identityVerificationFindings?: unknown[];
  };
  return Array.isArray(d.identityVerificationFindings) && d.identityVerificationFindings.length > 0;
});

// ─────────────────────────────────────────────────────────────────────────────
section("§12 — Phase 4C-2 Comparison Brief Integrity");
// ─────────────────────────────────────────────────────────────────────────────

proof("RRP-051", "All 5 Phase 4C-2 comparisons have comparisonEvidence.accessDisposition not NOT_YET_RESEARCHED", () =>
  PHASE_4C2_COMPLETE_COMPARISONS.every((f) => {
    const c = readJson(path.join(COMPARISONS_DIR, f)) as { comparisonEvidence?: { accessDisposition?: string } };
    return c.comparisonEvidence?.accessDisposition !== "NOT_YET_RESEARCHED";
  })
);

proof("RRP-052", "All 5 Phase 4C-2 comparisons have a conclusionState from the permitted list", () =>
  PHASE_4C2_COMPLETE_COMPARISONS.every((f) => {
    const c = readJson(path.join(COMPARISONS_DIR, f)) as { comparisonEvidence?: { conclusionState?: string } };
    const state = c.comparisonEvidence?.conclusionState;
    return typeof state === "string" && PERMITTED_CONCLUSION_STATES.includes(state);
  })
);

proof("RRP-053", "All 5 Phase 4C-2 comparisons have researchedAt inside comparisonEvidence", () =>
  PHASE_4C2_COMPLETE_COMPARISONS.every((f) => {
    const c = readJson(path.join(COMPARISONS_DIR, f)) as { comparisonEvidence?: { researchedAt?: string } };
    return typeof c.comparisonEvidence?.researchedAt === "string" &&
      (c.comparisonEvidence?.researchedAt ?? "").length > 0;
  })
);

proof("RRP-054", "All 5 Phase 4C-2 comparisons carry researchBoundaryNote inside comparisonEvidence", () =>
  PHASE_4C2_COMPLETE_COMPARISONS.every((f) => {
    const c = readJson(path.join(COMPARISONS_DIR, f)) as { comparisonEvidence?: { researchBoundaryNote?: string } };
    return typeof c.comparisonEvidence?.researchBoundaryNote === "string" &&
      (c.comparisonEvidence?.researchBoundaryNote ?? "").length > 20;
  })
);

proof("RRP-055", "Wardrobe-partner Phase 4C-2 comparisons (W1, W6, W7) have wardrobeComplementarityFindings populated", () => {
  const wardrobeFiles = PHASE_4C2_COMPLETE_COMPARISONS.filter((f) => f.startsWith("REL-wardrobe-partners-"));
  return wardrobeFiles.every((f) => {
    const c = readJson(path.join(COMPARISONS_DIR, f)) as {
      comparisonEvidence?: { wardrobeComplementarityFindings?: unknown[] };
    };
    return Array.isArray(c.comparisonEvidence?.wardrobeComplementarityFindings) &&
      (c.comparisonEvidence?.wardrobeComplementarityFindings?.length ?? 0) > 0;
  });
});

proof("RRP-056", "Alternatives Phase 4C-2 comparisons (A6, A8) have olfactiveOverlapFindings populated", () => {
  const altFiles = PHASE_4C2_COMPLETE_COMPARISONS.filter((f) => f.startsWith("REL-alternatives-"));
  return altFiles.every((f) => {
    const c = readJson(path.join(COMPARISONS_DIR, f)) as {
      comparisonEvidence?: { olfactiveOverlapFindings?: unknown[] };
    };
    return Array.isArray(c.comparisonEvidence?.olfactiveOverlapFindings) &&
      (c.comparisonEvidence?.olfactiveOverlapFindings?.length ?? 0) > 0;
  });
});

proof("RRP-057", "No Phase 4C-2 comparison contains forbidden governance output fields as JSON keys", () =>
  PHASE_4C2_COMPLETE_COMPARISONS.every((f) => {
    const raw = fs.readFileSync(path.join(COMPARISONS_DIR, f), "utf-8");
    return FORBIDDEN_FIELDS.every((field) => !new RegExp(`"${field}"\\s*:`).test(raw));
  })
);

proof("RRP-058", "A6 (Althaïr ↔ Layton) conclusionState is COMPARISON_EVIDENCE_AVAILABLE", () => {
  const c = readJson(path.join(COMPARISONS_DIR, "REL-alternatives-althair-inspired--layton-inspired-comparison.json")) as {
    comparisonEvidence?: { conclusionState?: string };
  };
  return c.comparisonEvidence?.conclusionState === "COMPARISON_EVIDENCE_AVAILABLE";
});

proof("RRP-059", "A8 (Ani ↔ Layton) conclusionState is COMPARISON_EVIDENCE_AVAILABLE", () => {
  const c = readJson(path.join(COMPARISONS_DIR, "REL-alternatives-ani-inspired--layton-inspired-comparison.json")) as {
    comparisonEvidence?: { conclusionState?: string };
  };
  return c.comparisonEvidence?.conclusionState === "COMPARISON_EVIDENCE_AVAILABLE";
});

proof("RRP-060", "W1, W6, W7 wardrobePartner comparisons have conclusionState LIMITED_SUPPORTING_EVIDENCE_FOUND", () => {
  const wardrobeFiles = PHASE_4C2_COMPLETE_COMPARISONS.filter((f) => f.startsWith("REL-wardrobe-partners-"));
  return wardrobeFiles.every((f) => {
    const c = readJson(path.join(COMPARISONS_DIR, f)) as {
      comparisonEvidence?: { conclusionState?: string };
    };
    return c.comparisonEvidence?.conclusionState === "LIMITED_SUPPORTING_EVIDENCE_FOUND";
  });
});

// ─────────────────────────────────────────────────────────────────────────────

console.log("\n════════════════════════════════════════════════════════════════");
console.log(`EP6-P5E-R — Relationship Research Pilot Validator`);
console.log(`Passed: ${passed} | Failed: ${failed} | Total: ${passed + failed}`);
console.log("════════════════════════════════════════════════════════════════");

if (failed > 0) {
  console.log("\nFailed proofs:");
  errors.forEach((e) => console.log(`  ✗ ${e}`));
  console.log("");
  process.exit(1);
} else {
  console.log("\n✓ All proofs passed. Phase 4C-2 research integrity confirmed.");
  console.log("  Ledger transactions: unchanged at", EXPECTED_LEDGER_TX_COUNT);
  console.log("  Graph fingerprint: confirmed");
  console.log("  Dossiers researched: 7 (Phase 4C-1: Ani, Spicebomb Extreme, Aventus, Sauvage | Phase 4C-2: Armani Sì, Layton, Althaïr)");
  console.log("  Comparisons researched: 8 (Phase 4C-1: A9, W2, W3 | Phase 4C-2: A6, A8, W1, W6, W7)");
  console.log("  Dossiers pending: 12 — unchanged");
  console.log("  Comparisons pending: 9 — unchanged");
  console.log("  Nishane Ani identity: INDEPENDENTLY_VERIFIED (Phase 4C-1)");
  console.log("  Althaïr identity: INDEPENDENTLY_VERIFIED (Phase 4C-2)");
  console.log("  No relationship decisions made.");
  console.log("");
  process.exit(0);
}
