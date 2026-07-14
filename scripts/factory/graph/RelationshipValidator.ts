import { RelationshipGraph, type EdgeType } from "./RelationshipGraph";

export interface ValidationIssue {
  type:    "MISSING_RECIPROCAL" | "ORPHAN_REFERENCE" | "SELF_REFERENCE";
  from:    string;
  to:      string;
  field:   EdgeType;
  message: string;
}

export interface GraphValidationResult {
  valid:  boolean;
  issues: ValidationIssue[];
}

export function validateGraph(graph: RelationshipGraph): GraphValidationResult {
  const issues: ValidationIssue[] = [];

  for (const edge of graph.getEdges()) {
    if (edge.from === edge.to) {
      issues.push({
        type:    "SELF_REFERENCE",
        from:    edge.from,
        to:      edge.to,
        field:   edge.type,
        message: `${edge.from} references itself in ${edge.type}`,
      });
      continue;
    }

    if (!graph.hasNode(edge.to)) {
      issues.push({
        type:    "ORPHAN_REFERENCE",
        from:    edge.from,
        to:      edge.to,
        field:   edge.type,
        message: `${edge.from}.${edge.type} → "${edge.to}" does not exist in the catalogue`,
      });
      continue;
    }

    if (!graph.hasEdge(edge.to, edge.from, edge.type)) {
      issues.push({
        type:    "MISSING_RECIPROCAL",
        from:    edge.from,
        to:      edge.to,
        field:   edge.type,
        message: `${edge.from}.${edge.type} → ${edge.to}  but ${edge.to} does not reciprocate`,
      });
    }
  }

  return { valid: issues.length === 0, issues };
}
