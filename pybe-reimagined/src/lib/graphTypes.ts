import graphJson from '../../content/graph.json';

export interface GraphNode {
  id: string;
  label: string;
  stage: 'sensorimotor' | 'preoperational' | 'concrete' | 'formal';
  topic: string;
  href: string | null;
  ready: boolean;
}

export interface GraphEdge {
  from: string;
  to: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export const GRAPH: GraphData = graphJson as GraphData;