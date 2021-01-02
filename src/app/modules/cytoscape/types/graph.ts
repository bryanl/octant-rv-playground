import { NullLayoutOptions } from 'cytoscape';
import { CoseBilkentGraph } from '../graphs/cose-bilkent';
import { DagreGraph } from '../graphs/dagre-graph';

export enum GraphType {
  RESOURCE_VIEWER = 'resourceViewer',
}

export enum NodeType {
  Workload = 'workload',
  Networking = 'networking',
  Configuration = 'configuration',
  CustomResource = 'custom-resource',
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
export interface CytoscapeMouseInEvent extends CytoscapeBaseEvent {}
export interface CytoscapeMouseOutEvent extends CytoscapeBaseEvent {}

export type Layout = CoseBilkentGraph | DagreGraph | NullLayoutOptions;

export type SummaryType = 'graph' | 'group' | 'node' | 'edge';

export interface GraphNodeData {
  id: string;
  isIdle?: boolean;
  isGroup?: string;
  nodeType: string;
  label: string;
  targets: string[];
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
