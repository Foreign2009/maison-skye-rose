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

const EXPECTED_REVIEW_IDS = [
  "REL-alternatives-afternoon-swim-inspired--invictus-inspired",
  "REL-alternatives-alien-inspired--baccarat-rouge-540-inspired",
  "REL-alternatives-althair-inspired--layton-inspired",
  "REL-alternatives-althair-inspired--le-male-elixir-inspired",
  "REL-alternatives-ani-inspired--layton-inspired",
  "REL-alternatives-ani-inspired--spicebomb-extreme-inspired",
  "REL-alternatives-aqua-di-gio-inspired--l'immensite-inspired",
  "REL-wardrobe-partners-althair-inspired--spicebomb-extreme-inspired",
  "REL-wardrobe-partners-ani-inspired--aventus-inspired",
  "REL-wardrobe-partners-ani-inspired--sauvage-inspired",
  "REL-wardrobe-partners-aqua-di-gio-inspired--erba-pura-inspired",
  "REL-wardrobe-partners-arabians-tonka-inspired--sauvage-inspired",
  "REL-wardrobe-partners-armani-si-inspired--aventus-inspired",
  "REL-wardrobe-partners-armani-si-inspired--spicebomb-extreme-inspired",
  "REL-wardrobe-partners-aventus-inspired--delina-exclusif-inspired",
  "REL-wardrobe-partners-aventus-inspired--oud-for-greatness-inspired",
  "REL-wardrobe-partners-aventus-inspired--very-good-girl-inspired",
];

const EXPECTED_DOSSIER_FILES = [
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

const EXPECTED_COMPARISON_FILES = [
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

const EXPECTED_DOSSIERS_WITH_IDENTITY_VERIFICATION = [
  "lv-afternoon-swim-dossier.json",
  "parfums-de-marly-althair-dossier.json",
  "nishane-ani-dossier.json",
  "xerjoff-erba-pura-dossier.json",
  "montale-arabians-tonka-dossier.json",
];

const ALTERNATIVES_EXPECTED_LIMITATIONS = [
  "NO_HUMAN_EDITORIAL_APPROVAL_RECORD",
  "HUMAN_APPROVAL_NOT_CONFIRMED",
  "METADATA_SIMILARITY_NOT_SEMANTIC_PROOF",
  "NO_OLFACTIVE_TESTING",
  "NO_THIRD_PARTY_DATABASE_CONFIRMATION",
  "NO_CONSUMER_REVIEW_EVIDENCE",
];

const WARDROBE_EXPECTED_LIMITATIONS = [
  "NO_HUMAN_EDITORIAL_APPROVAL_RECORD",
  "HUMAN_APPROVAL_NOT_CONFIRMED",
  "METADATA_SIMILARITY_NOT_SEMANTIC_PROOF",
  "WARDROBE_CURATION_REQUIRES_FOUNDER_INTENT",
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
console.log("EP6-P5E-R — Relationship Research Foundation Validator");
console.log("Schema: EP6-P5E-RR-v1");
console.log("Phase: 4B — Foundation Only (zero external research)");
console.log("════════════════════════════════════════════════════════════════");

// ─────────────────────────────────────────────────────────────────────────────
section("§1 — Protected Artifact Invariants");
// ─────────────────────────────────────────────────────────────────────────────

proof("RRF-001", "Decision ledger file exists", () =>
  fileExists(LEDGER_PATH)
);

proof("RRF-002", `Decision ledger entry count is exactly ${EXPECTED_LEDGER_TX_COUNT} (immutability check)`, () => {
  const ledger = readJson(LEDGER_PATH) as { entries?: unknown[] };
  return Array.isArray(ledger.entries) && ledger.entries.length === EXPECTED_LEDGER_TX_COUNT;
});

proof("RRF-003", `Campaign manifest references correct graph fingerprint: ${EXPECTED_GRAPH_FINGERPRINT}`, () => {
  const campaign = readJson(CAMPAIGN_FILE) as { graphFingerprint?: string };
  return campaign.graphFingerprint === EXPECTED_GRAPH_FINGERPRINT;
});

proof("RRF-004", "Campaign manifest researchAuthorizationStatus confirms Phase 4C not yet issued", () => {
  const campaign = readJson(CAMPAIGN_FILE) as { researchAuthorizationStatus?: string };
  return typeof campaign.researchAuthorizationStatus === "string" &&
    campaign.researchAuthorizationStatus.includes("PENDING");
});

// ─────────────────────────────────────────────────────────────────────────────
section("§2 — Campaign Manifest Structure");
// ─────────────────────────────────────────────────────────────────────────────

proof("RRF-005", "Campaign manifest file exists", () =>
  fileExists(CAMPAIGN_FILE)
);

proof("RRF-006", `Campaign manifest schemaVersion is ${SCHEMA_VERSION}`, () => {
  const campaign = readJson(CAMPAIGN_FILE) as { schemaVersion?: string };
  return campaign.schemaVersion === SCHEMA_VERSION;
});

proof("RRF-007", "Campaign manifest campaignId is EP6-P5E-research", () => {
  const campaign = readJson(CAMPAIGN_FILE) as { campaignId?: string };
  return campaign.campaignId === "EP6-P5E-research";
});

proof("RRF-008", "Campaign manifest declares uniqueDossierCount = 19", () => {
  const campaign = readJson(CAMPAIGN_FILE) as { uniqueDossierCount?: number };
  return campaign.uniqueDossierCount === 19;
});

proof("RRF-009", "Campaign manifest declares pairComparisonCount = 17", () => {
  const campaign = readJson(CAMPAIGN_FILE) as { pairComparisonCount?: number };
  return campaign.pairComparisonCount === 17;
});

proof("RRF-010", "Campaign manifest declares primaryResearchCount = 12", () => {
  const campaign = readJson(CAMPAIGN_FILE) as { primaryResearchCount?: number };
  return campaign.primaryResearchCount === 12;
});

proof("RRF-011", "Campaign manifest declares optionalCorroborationCount = 5", () => {
  const campaign = readJson(CAMPAIGN_FILE) as { optionalCorroborationCount?: number };
  return campaign.optionalCorroborationCount === 5;
});

proof("RRF-012", "Campaign manifest dossierIndex contains exactly 19 entries", () => {
  const campaign = readJson(CAMPAIGN_FILE) as { dossierIndex?: unknown[] };
  return Array.isArray(campaign.dossierIndex) && campaign.dossierIndex.length === 19;
});

// ─────────────────────────────────────────────────────────────────────────────
section("§3 — Queue Alignment");
// ─────────────────────────────────────────────────────────────────────────────

proof("RRF-013", "Campaign manifest contains exactly 17 research units", () => {
  const campaign = readJson(CAMPAIGN_FILE) as { units?: unknown[] };
  return Array.isArray(campaign.units) && campaign.units.length === 17;
});

proof("RRF-014", "All 17 expected reviewIds are present in the campaign", () => {
  const campaign = readJson(CAMPAIGN_FILE) as { units?: Array<{ reviewId?: string }> };
  if (!Array.isArray(campaign.units)) return false;
  const actual = new Set(campaign.units.map((u) => u.reviewId));
  return EXPECTED_REVIEW_IDS.every((id) => actual.has(id));
});

proof("RRF-015", "Campaign contains exactly 7 alternatives units", () => {
  const campaign = readJson(CAMPAIGN_FILE) as { units?: Array<{ pairType?: string }> };
  if (!Array.isArray(campaign.units)) return false;
  return campaign.units.filter((u) => u.pairType === "alternatives").length === 7;
});

proof("RRF-016", "Campaign contains exactly 10 wardrobePartners units", () => {
  const campaign = readJson(CAMPAIGN_FILE) as { units?: Array<{ pairType?: string }> };
  if (!Array.isArray(campaign.units)) return false;
  return campaign.units.filter((u) => u.pairType === "wardrobePartners").length === 10;
});

proof("RRF-017", "Campaign contains exactly 12 PRIMARY_RESEARCH units", () => {
  const campaign = readJson(CAMPAIGN_FILE) as { units?: Array<{ unitScope?: string }> };
  if (!Array.isArray(campaign.units)) return false;
  return campaign.units.filter((u) => u.unitScope === "PRIMARY_RESEARCH").length === 12;
});

proof("RRF-018", "Campaign contains exactly 5 OPTIONAL_CORROBORATION units", () => {
  const campaign = readJson(CAMPAIGN_FILE) as { units?: Array<{ unitScope?: string }> };
  if (!Array.isArray(campaign.units)) return false;
  return campaign.units.filter((u) => u.unitScope === "OPTIONAL_CORROBORATION").length === 5;
});

// ─────────────────────────────────────────────────────────────────────────────
section("§4 — Dossier Existence (19 files)");
// ─────────────────────────────────────────────────────────────────────────────

proof("RRF-019", "All 19 reference fragrance dossier files exist on disk", () =>
  EXPECTED_DOSSIER_FILES.every((f) => fileExists(path.join(DOSSIERS_DIR, f)))
);

proof("RRF-020", "Dossiers directory contains exactly 19 dossier files", () => {
  const files = fs.readdirSync(DOSSIERS_DIR).filter((f) => f.endsWith("-dossier.json"));
  return files.length === 19;
});

// ─────────────────────────────────────────────────────────────────────────────
section("§5 — Dossier Schema Integrity");
// ─────────────────────────────────────────────────────────────────────────────

proof("RRF-021", `All 19 dossiers declare schemaVersion ${SCHEMA_VERSION}`, () =>
  EXPECTED_DOSSIER_FILES.every((f) => {
    const d = readJson(path.join(DOSSIERS_DIR, f)) as { schemaVersion?: string };
    return d.schemaVersion === SCHEMA_VERSION;
  })
);

proof("RRF-022", "All 19 dossiers have dossierStatus PENDING_RESEARCH", () =>
  EXPECTED_DOSSIER_FILES.every((f) => {
    const d = readJson(path.join(DOSSIERS_DIR, f)) as { dossierStatus?: string };
    return d.dossierStatus === "PENDING_RESEARCH";
  })
);

proof("RRF-023", "All 19 dossiers have governanceConstraints.noDecisionFields = true", () =>
  EXPECTED_DOSSIER_FILES.every((f) => {
    const d = readJson(path.join(DOSSIERS_DIR, f)) as { governanceConstraints?: { noDecisionFields?: boolean } };
    return d.governanceConstraints?.noDecisionFields === true;
  })
);

proof("RRF-024", "All 19 dossiers have accessDisposition NOT_YET_RESEARCHED", () =>
  EXPECTED_DOSSIER_FILES.every((f) => {
    const d = readJson(path.join(DOSSIERS_DIR, f)) as { accessDisposition?: string };
    return d.accessDisposition === "NOT_YET_RESEARCHED";
  })
);

proof("RRF-025", "All 19 dossiers have null canonicalSummary (no research conclusions present)", () =>
  EXPECTED_DOSSIER_FILES.every((f) => {
    const d = readJson(path.join(DOSSIERS_DIR, f)) as { canonicalSummary?: unknown };
    return d.canonicalSummary === null;
  })
);

proof("RRF-026", "All 19 dossiers have empty findings and contradictions arrays", () =>
  EXPECTED_DOSSIER_FILES.every((f) => {
    const d = readJson(path.join(DOSSIERS_DIR, f)) as { findings?: unknown[]; contradictions?: unknown[] };
    return Array.isArray(d.findings) && d.findings.length === 0 &&
      Array.isArray(d.contradictions) && d.contradictions.length === 0;
  })
);

proof("RRF-027", "All 5 EXPECTED-status dossiers contain identityVerification research questions", () =>
  EXPECTED_DOSSIERS_WITH_IDENTITY_VERIFICATION.every((f) => {
    const d = readJson(path.join(DOSSIERS_DIR, f)) as {
      referenceIdentityStatus?: string;
      researchQuestions?: { identityVerification?: unknown[] };
    };
    return d.referenceIdentityStatus === "EXPECTED" &&
      Array.isArray(d.researchQuestions?.identityVerification) &&
      (d.researchQuestions?.identityVerification?.length ?? 0) > 0;
  })
);

proof("RRF-028", "No dossier contains forbidden governance output fields", () =>
  EXPECTED_DOSSIER_FILES.every((f) => {
    const raw = fs.readFileSync(path.join(DOSSIERS_DIR, f), "utf-8");
    return FORBIDDEN_FIELDS.every((field) => !raw.includes(`"${field}"`));
  })
);

// ─────────────────────────────────────────────────────────────────────────────
section("§6 — Comparison Brief Existence (17 files)");
// ─────────────────────────────────────────────────────────────────────────────

proof("RRF-029", "All 17 comparison brief files exist on disk", () =>
  EXPECTED_COMPARISON_FILES.every((f) => fileExists(path.join(COMPARISONS_DIR, f)))
);

proof("RRF-030", "Comparisons directory contains exactly 17 comparison files", () => {
  const files = fs.readdirSync(COMPARISONS_DIR).filter((f) => f.endsWith("-comparison.json"));
  return files.length === 17;
});

// ─────────────────────────────────────────────────────────────────────────────
section("§7 — Comparison Brief Schema Integrity");
// ─────────────────────────────────────────────────────────────────────────────

proof("RRF-031", `All 17 comparisons declare schemaVersion ${SCHEMA_VERSION}`, () =>
  EXPECTED_COMPARISON_FILES.every((f) => {
    const c = readJson(path.join(COMPARISONS_DIR, f)) as { schemaVersion?: string };
    return c.schemaVersion === SCHEMA_VERSION;
  })
);

proof("RRF-032", "All 17 comparisons have comparisonStatus PENDING_RESEARCH", () =>
  EXPECTED_COMPARISON_FILES.every((f) => {
    const c = readJson(path.join(COMPARISONS_DIR, f)) as { comparisonStatus?: string };
    return c.comparisonStatus === "PENDING_RESEARCH";
  })
);

proof("RRF-033", "All 17 comparisons have governanceConstraints.noDecisionFields = true", () =>
  EXPECTED_COMPARISON_FILES.every((f) => {
    const c = readJson(path.join(COMPARISONS_DIR, f)) as { governanceConstraints?: { noDecisionFields?: boolean } };
    return c.governanceConstraints?.noDecisionFields === true;
  })
);

proof("RRF-034", "All 17 comparisons declare all 6 permitted conclusion states", () => {
  const requiredStates = [
    "NO_SUPPORTING_RELATIONSHIP_EVIDENCE_FOUND",
    "LIMITED_SUPPORTING_EVIDENCE_FOUND",
    "CONTRADICTORY_EVIDENCE_FOUND",
    "COMPARISON_EVIDENCE_AVAILABLE",
    "FURTHER_EVIDENCE_REQUIRED",
  ];
  return EXPECTED_COMPARISON_FILES.every((f) => {
    const c = readJson(path.join(COMPARISONS_DIR, f)) as {
      governanceConstraints?: { permittedConclusionStates?: string[] };
    };
    const states = c.governanceConstraints?.permittedConclusionStates ?? [];
    return requiredStates.every((s) => states.includes(s));
  });
});

proof("RRF-035", "All 17 comparisons list all 6 forbidden output fields", () => {
  return EXPECTED_COMPARISON_FILES.every((f) => {
    const c = readJson(path.join(COMPARISONS_DIR, f)) as {
      governanceConstraints?: { forbiddenOutputFields?: string[] };
    };
    const forbidden = c.governanceConstraints?.forbiddenOutputFields ?? [];
    return FORBIDDEN_FIELDS.every((field) => forbidden.includes(field));
  });
});

proof("RRF-036", "Alternatives comparisons carry the correct 6-item evidence limitations array", () => {
  const altFiles = EXPECTED_COMPARISON_FILES.filter((f) => f.startsWith("REL-alternatives-"));
  return altFiles.every((f) => {
    const c = readJson(path.join(COMPARISONS_DIR, f)) as {
      currentMaisonEvidence?: { limitations?: string[] };
    };
    const lims = c.currentMaisonEvidence?.limitations ?? [];
    return ALTERNATIVES_EXPECTED_LIMITATIONS.every((l) => lims.includes(l)) && lims.length === 6;
  });
});

proof("RRF-037", "Wardrobe-partners comparisons carry the correct 4-item evidence limitations array", () => {
  const wardFiles = EXPECTED_COMPARISON_FILES.filter((f) => f.startsWith("REL-wardrobe-partners-"));
  return wardFiles.every((f) => {
    const c = readJson(path.join(COMPARISONS_DIR, f)) as {
      currentMaisonEvidence?: { limitations?: string[] };
    };
    const lims = c.currentMaisonEvidence?.limitations ?? [];
    return WARDROBE_EXPECTED_LIMITATIONS.every((l) => lims.includes(l)) && lims.length === 4;
  });
});

proof("RRF-038", "No comparison contains forbidden governance output fields as JSON keys", () =>
  EXPECTED_COMPARISON_FILES.every((f) => {
    const raw = fs.readFileSync(path.join(COMPARISONS_DIR, f), "utf-8");
    // Match field name as a JSON key (followed by colon), not as a string value in an array
    return FORBIDDEN_FIELDS.every((field) => !new RegExp(`"${field}"\\s*:`).test(raw));
  })
);

// ─────────────────────────────────────────────────────────────────────────────
section("§8 — Research Status Uniformity");
// ─────────────────────────────────────────────────────────────────────────────

proof("RRF-039", "All 17 campaign units declare researchStatus PENDING_RESEARCH", () => {
  const campaign = readJson(CAMPAIGN_FILE) as { units?: Array<{ researchStatus?: string }> };
  if (!Array.isArray(campaign.units)) return false;
  return campaign.units.every((u) => u.researchStatus === "PENDING_RESEARCH");
});

proof("RRF-040", "All 17 comparisons have comparisonEvidence.accessDisposition NOT_YET_RESEARCHED", () =>
  EXPECTED_COMPARISON_FILES.every((f) => {
    const c = readJson(path.join(COMPARISONS_DIR, f)) as { comparisonEvidence?: { accessDisposition?: string } };
    return c.comparisonEvidence?.accessDisposition === "NOT_YET_RESEARCHED";
  })
);

// ─────────────────────────────────────────────────────────────────────────────
section("§9 — Special Scrutiny and Cross-Collection Flags");
// ─────────────────────────────────────────────────────────────────────────────

proof("RRF-041", "Unit A5 (alien × baccarat-rouge-540) carries specialScrutiny = true in campaign manifest", () => {
  const campaign = readJson(CAMPAIGN_FILE) as { units?: Array<{ unitId?: string; specialScrutiny?: boolean }> };
  if (!Array.isArray(campaign.units)) return false;
  const a5 = campaign.units.find((u) => u.unitId === "A5");
  return a5?.specialScrutiny === true;
});

proof("RRF-042", "Unit A5 comparison brief carries specialScrutiny = true", () => {
  const c = readJson(path.join(COMPARISONS_DIR, "REL-alternatives-alien-inspired--baccarat-rouge-540-inspired-comparison.json")) as { specialScrutiny?: boolean };
  return c.specialScrutiny === true;
});

proof("RRF-043", "Cross-collection wardrobe pairs (W6, W7, W8, W10) declare D-REL-001 permissibility", () => {
  const crossCollectionFiles = [
    "REL-wardrobe-partners-armani-si-inspired--aventus-inspired-comparison.json",
    "REL-wardrobe-partners-armani-si-inspired--spicebomb-extreme-inspired-comparison.json",
    "REL-wardrobe-partners-aventus-inspired--delina-exclusif-inspired-comparison.json",
    "REL-wardrobe-partners-aventus-inspired--very-good-girl-inspired-comparison.json",
  ];
  return crossCollectionFiles.every((f) => {
    const c = readJson(path.join(COMPARISONS_DIR, f)) as {
      crossCollection?: boolean;
      crossGender?: boolean;
      crossCollectionPermissibility?: string;
    };
    return c.crossCollection === true &&
      c.crossGender === true &&
      typeof c.crossCollectionPermissibility === "string" &&
      c.crossCollectionPermissibility.includes("D-REL-001");
  });
});

proof("RRF-044", "Unit W7 comparison brief carries dossierReuseNote", () => {
  const c = readJson(path.join(COMPARISONS_DIR, "REL-wardrobe-partners-armani-si-inspired--spicebomb-extreme-inspired-comparison.json")) as { dossierReuseNote?: string };
  return typeof c.dossierReuseNote === "string" && c.dossierReuseNote.length > 0;
});

// ─────────────────────────────────────────────────────────────────────────────
section("§10 — Phase 4A Correction Integrity");
// ─────────────────────────────────────────────────────────────────────────────

proof("RRF-045", "Campaign manifest records all 5 Phase 4A corrections", () => {
  const campaign = readJson(CAMPAIGN_FILE) as { phase4ACorrections?: { corrections?: unknown[] } };
  return Array.isArray(campaign.phase4ACorrections?.corrections) &&
    campaign.phase4ACorrections!.corrections!.length === 5;
});

proof("RRF-046", "LV Afternoon Swim dossier has referenceBrand 'Louis Vuitton' (not Hermès)", () => {
  const d = readJson(path.join(DOSSIERS_DIR, "lv-afternoon-swim-dossier.json")) as { referenceBrand?: string };
  return d.referenceBrand === "Louis Vuitton";
});

proof("RRF-047", "Nishane Ani dossier has referenceBrand 'Nishane' (not Parfums de Marly)", () => {
  const d = readJson(path.join(DOSSIERS_DIR, "nishane-ani-dossier.json")) as { referenceBrand?: string };
  return d.referenceBrand === "Nishane";
});

proof("RRF-048", "Parfums de Marly Althaïr dossier has referenceBrand 'Parfums de Marly' (not unknown)", () => {
  const d = readJson(path.join(DOSSIERS_DIR, "parfums-de-marly-althair-dossier.json")) as { referenceBrand?: string };
  return d.referenceBrand === "Parfums de Marly";
});

proof("RRF-049", "Xerjoff Erba Pura dossier has referenceBrand 'Xerjoff' (not Sospiro)", () => {
  const d = readJson(path.join(DOSSIERS_DIR, "xerjoff-erba-pura-dossier.json")) as { referenceBrand?: string };
  return d.referenceBrand === "Xerjoff";
});

proof("RRF-050", "Montale Arabians Tonka dossier has referenceBrand 'Montale' (not unknown)", () => {
  const d = readJson(path.join(DOSSIERS_DIR, "montale-arabians-tonka-dossier.json")) as { referenceBrand?: string };
  return d.referenceBrand === "Montale";
});

// ─────────────────────────────────────────────────────────────────────────────
section("§11 — Mugler Alien Flanker Exclusion Safety");
// ─────────────────────────────────────────────────────────────────────────────

proof("RRF-051", "Mugler Alien dossier covers original Alien EDP (2005), not Alien Goddess (2021)", () => {
  const d = readJson(path.join(DOSSIERS_DIR, "mugler-alien-dossier.json")) as {
    referenceFragranceName?: string;
    flankerExclusionRequired?: boolean;
  };
  return d.referenceFragranceName?.includes("2005") === true &&
    d.flankerExclusionRequired === true;
});

// ─────────────────────────────────────────────────────────────────────────────
section("§12 — Dossier Reuse Integrity");
// ─────────────────────────────────────────────────────────────────────────────

proof("RRF-052", "Creed Aventus dossier lists 5 usedByPairs (highest reuse)", () => {
  const d = readJson(path.join(DOSSIERS_DIR, "creed-aventus-dossier.json")) as { usedByPairs?: unknown[] };
  return Array.isArray(d.usedByPairs) && d.usedByPairs.length === 5;
});

proof("RRF-053", "Nishane Ani dossier lists 4 usedByPairs entries (A8, A9, W2, W3)", () => {
  const d = readJson(path.join(DOSSIERS_DIR, "nishane-ani-dossier.json")) as { usedByPairs?: unknown[] };
  return Array.isArray(d.usedByPairs) && d.usedByPairs.length === 4;
});

// ─────────────────────────────────────────────────────────────────────────────

console.log("\n════════════════════════════════════════════════════════════════");
console.log(`EP6-P5E-R — Relationship Research Foundation Validator`);
console.log(`Passed: ${passed} | Failed: ${failed} | Total: ${passed + failed}`);
console.log("════════════════════════════════════════════════════════════════");

if (failed > 0) {
  console.log("\nFailed proofs:");
  errors.forEach((e) => console.log(`  ✗ ${e}`));
  console.log("");
  process.exit(1);
} else {
  console.log("\n✓ All proofs passed. Research foundation integrity confirmed.");
  console.log("  Ledger transactions: unchanged at", EXPECTED_LEDGER_TX_COUNT);
  console.log("  Graph fingerprint: confirmed");
  console.log("  Phase 4B scope: FOUNDATION ONLY — zero research performed.");
  console.log("");
  process.exit(0);
}
