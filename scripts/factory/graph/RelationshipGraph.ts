export type EdgeType = "alternatives" | "wardrobePartners";

export interface GraphNode {
  slug:   string;
  source: "native" | "draft";
}

export interface GraphEdge {
  from: string;
  to:   string;
  type: EdgeType;
}

export class RelationshipGraph {
  private nodes = new Map<string, GraphNode>();
  private edges: GraphEdge[] = [];

  addNode(slug: string, source: "native" | "draft"): void {
    if (!this.nodes.has(slug)) {
      this.nodes.set(slug, { slug, source });
    }
  }

  addEdge(from: string, to: string, type: EdgeType): void {
    if (!this.edges.some(e => e.from === from && e.to === to && e.type === type)) {
      this.edges.push({ from, to, type });
    }
  }

  hasEdge(from: string, to: string, type: EdgeType): boolean {
    return this.edges.some(e => e.from === from && e.to === to && e.type === type);
  }

  hasNode(slug: string): boolean {
    return this.nodes.has(slug);
  }

  getNodes(): GraphNode[] {
    return Array.from(this.nodes.values());
  }

  getEdges(): GraphEdge[] {
    return [...this.edges];
  }

  getEdgesFrom(slug: string): GraphEdge[] {
    return this.edges.filter(e => e.from === slug);
  }

  getEdgesTo(slug: string): GraphEdge[] {
    return this.edges.filter(e => e.to === slug);
  }

  getMissingReciprocals(): GraphEdge[] {
    return this.edges.filter(e => !this.hasEdge(e.to, e.from, e.type));
  }

  getOrphanReferences(): GraphEdge[] {
    return this.edges.filter(e => !this.nodes.has(e.to));
  }

  nodeCount(): number { return this.nodes.size; }
  edgeCount(): number { return this.edges.length; }
}
