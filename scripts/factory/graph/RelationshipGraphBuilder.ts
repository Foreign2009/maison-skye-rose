import { existsSync, readFileSync, readdirSync } from "fs";
import path from "path";
import { RelationshipGraph, type EdgeType } from "./RelationshipGraph";

export interface ExtractedRelationships {
  alternatives:    string[];
  wardrobePartners: string[];
}

export function extractRelationships(content: string): ExtractedRelationships {
  const result: ExtractedRelationships = { alternatives: [], wardrobePartners: [] };

  const altMatch = content.match(/alternatives\s*:\s*\[([^\]]*)\]/);
  if (altMatch) {
    result.alternatives = [...altMatch[1].matchAll(/"([^"]+)"/g)].map(m => m[1]);
  }

  const wpMatch = content.match(/wardrobePartners\s*:\s*\[([^\]]*)\]/);
  if (wpMatch) {
    result.wardrobePartners = [...wpMatch[1].matchAll(/"([^"]+)"/g)].map(m => m[1]);
  }

  return result;
}

function slugsFromDir(dir: string, exclude?: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(f => f.endsWith(".ts") && f !== exclude)
    .map(f => f.replace(/\.ts$/, ""));
}

export function buildGraphFromFiles(
  nativeDir: string,
  draftDir:  string,
): RelationshipGraph {
  const graph = new RelationshipGraph();

  const nativeSlugs = slugsFromDir(nativeDir, "index.ts");
  const draftSlugs  = slugsFromDir(draftDir);

  for (const slug of nativeSlugs) graph.addNode(slug, "native");
  for (const slug of draftSlugs)  graph.addNode(slug, "draft");

  const addEdgesFromFile = (dir: string, slug: string): void => {
    const filePath = path.join(dir, `${slug}.ts`);
    if (!existsSync(filePath)) return;
    const content = readFileSync(filePath, "utf-8");
    const rels = extractRelationships(content);
    for (const alt of rels.alternatives)      graph.addEdge(slug, alt, "alternatives");
    for (const wp  of rels.wardrobePartners)  graph.addEdge(slug, wp,  "wardrobePartners");
  };

  for (const slug of nativeSlugs) addEdgesFromFile(nativeDir, slug);
  for (const slug of draftSlugs)  addEdgesFromFile(draftDir,  slug);

  return graph;
}
