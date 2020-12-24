import { EdgeDefinition, NodeDefinition } from 'cytoscape';

export interface GraphData {
  nodes?: NodeDefinition[];
  edges?: EdgeDefinition[];
}
