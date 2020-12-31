export enum GraphType {
  RESOURCE_VIEWER = 'resourceViewer',
}

export enum NodeType {
  SERVICE = 'service',
  WORKLOAD = 'workload',
}

export const CytoscapeGlobalScratchNamespace = '_global';

export type CytoscapeGlobalScratchData = {
  graphType: GraphType;
  showNodeLabels: boolean;
};

export interface CytoscapeBaseEvent {
  summaryType: SummaryType;
  summaryTarget: any;
}

export interface CytoscapeClickEvent extends CytoscapeBaseEvent {}

export interface Layout {
  name: string;
}

export type SummaryType = 'graph' | 'group' | 'node' | 'edge';

export interface GraphNodeData {
  id: string;
  parent?: string;
  isIdle?: boolean;
  isGroup?: string;
}

export interface GraphEdgeData {
  id?: string;
  source: string;
  target: string;
}

// Node data after decorating at fetch time
export interface DecoratedGraphNodeData extends GraphNodeData {}

// Edge data after decorating at fetch time
export interface DecoratedGraphEdgeData extends GraphEdgeData {}

export interface DecoratedGraphNodeWrapper {
  data: DecoratedGraphNodeData;
}

export interface DecoratedGraphEdgeWrapper {
  data: DecoratedGraphEdgeData;
}

export interface DecoratedGraphElements {
  nodes?: DecoratedGraphNodeWrapper[];
  edges?: DecoratedGraphEdgeWrapper[];
}
