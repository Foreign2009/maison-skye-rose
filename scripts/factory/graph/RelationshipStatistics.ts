import { RelationshipGraph } from "./RelationshipGraph";
import { type GraphValidationResult } from "./RelationshipValidator";

export interface GraphStatistics {
  nodeCount:          number;
  nativeNodeCount:    number;
  draftNodeCount:     number;
  edgeCount:          number;
  alternativeEdges:   number;
  wpEdges:            number;
  missingReciprocals: number;
  orphanReferences:   number;
  selfReferences:     number;
  averageDegree:      number;
}

export function computeStatistics(
  graph:      RelationshipGraph,
  validation: GraphValidationResult,
): GraphStatistics {
  const nodes = graph.getNodes();
  const edges = graph.getEdges();

  return {
    nodeCount:          nodes.length,
    nativeNodeCount:    nodes.filter(n => n.source === "native").length,
    draftNodeCount:     nodes.filter(n => n.source === "draft").length,
    edgeCount:          edges.length,
    alternativeEdges:   edges.filter(e => e.type === "alternatives").length,
    wpEdges:            edges.filter(e => e.type === "wardrobePartners").length,
    missingReciprocals: validation.issues.filter(i => i.type === "MISSING_RECIPROCAL").length,
    orphanReferences:   validation.issues.filter(i => i.type === "ORPHAN_REFERENCE").length,
    selfReferences:     validation.issues.filter(i => i.type === "SELF_REFERENCE").length,
    averageDegree:
      nodes.length > 0
        ? Math.round(((edges.length * 2) / nodes.length) * 100) / 100
        : 0,
  };
}
