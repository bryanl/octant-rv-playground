import { EdgeSingular, NodeSingular } from 'cytoscape';

export interface DagreGraphOptions {
  // dagre algo options, uses default value on undefined
  name: string;
  // the separation between adjacent nodes in the same rank
  nodeSep?: number;
  // the separation between adjacent edges in the same rank
  edgeSep?: number;
  // the separation between adjacent nodes in the same rank
  rankSep?: number;
  // 'TB' for top to bottom flow, 'LR' for left to right,
  rankDir?: 'TB' | 'LR';
  // Type of algorithm to assigns a rank to each node in the input graph.
  // Possible values: network-simplex, tight-tree or longest-path
  ranker?: 'network-simplex' | 'tight-tree' | 'longest-path';
  // whether to fit to viewport
  fit?: boolean;
  // fit padding
  padding?: number;
  // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  spacingFactor?: number;
  // whether labels should be included in determining the space used by a node
  nodeDimensionsIncludeLabels?: boolean;
  // whether to transition the node positions
  animate?: boolean;
  // whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
  // duration of animation in ms if enabled
  animationDuration?: number;
  // easing of animation if enabled
  animationEasing?: number;
  // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  boundingBox?: Position;
  // a function that applies a transform to the final node position
  transform?: (node: NodeSingular, pos: Position) => Position;
  // on layoutready
  ready?: () => void;
  // on layoutstop
  stop?: () => void;
  // number of ranks to keep between the source and target of the edge
  minLen?: (edge: EdgeSingular) => number;
  // higher weight edges are generally made shorter and straighter than lower weight edges
  edgeWeight?: (edge: EdgeSingular) => number;
  // whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
  animateFilter?: (node: NodeSingular, i: number) => boolean;
}

export class DagreGraph {
  readonly name = 'dagre';

  static getLayout(): DagreGraphOptions {
    return {
      name: 'dagre',
      fit: false,
      nodeDimensionsIncludeLabels: true,
      rankDir: 'LR',
    };
  }
}
