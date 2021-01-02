export interface CoseBilkentGraphOptions {
  name: 'cose-bilkent';
  // 'draft', 'default' or 'proof"
  // - 'draft' fast cooling rate
  // - 'default' moderate cooling rate
  // - "proof" slow cooling rate
  quality?: 'default' | 'draft' | 'proof';
  // include labels in node dimensions
  nodeDimensionsIncludeLabels?: boolean;
  // number of ticks per frame; higher is faster but more jerky
  refresh?: number;
  // Whether to fit the network view after when done
  fit?: boolean;
  // Padding on fit
  padding?: number;
  // Whether to enable incremental mode
  randomize?: boolean;
  // Node repulsion (non overlapping) multiplier
  nodeRepulsion?: number;
  // Ideal edge (non nested) length
  idealEdgeLength?: number;
  // Divisor to compute edge forces
  edgeElasticity?: number;
  // Nesting factor (multiplier) to compute ideal edge length for nested edges
  nestingFactor?: number;
  // Gravity force (constant)
  gravity?: number;
  // Maximum number of iterations to perform
  numIter?: number;
  // For enabling tiling
  tile?: boolean;
  // Type of layout animation. The option set is {'during', 'end', false}
  animate?: 'end' | 'during' | false;
  // Duration for animate:end
  animationDuration?: number;
  // Represents the amount of the vertical space to put between the zero degree members during the tiling
  // operation(can also be a function)
  tilingPaddingVertical?: number;
  // Represents the amount of the horizontal space to put between the zero degree members during the
  // tiling operation(can also be a function)
  tilingPaddingHorizontal?: number;
  // Gravity range (constant) for compounds
  gravityRangeCompound?: number;
  // Gravity force (constant) for compounds
  gravityCompound?: number;
  // Gravity range (constant)
  gravityRange?: number;
  // Initial cooling factor for incremental layout
  initialEnergyOnIncremental?: number;
  // Called on `layoutready`
  ready?: () => void;
  // Called on `layoutstop`
  stop?: () => void;
}

export class CoseBilkentGraph {
  readonly name = 'cose-bilkent';

  static getLayout(): CoseBilkentGraphOptions {
    return {
      name: 'cose-bilkent',
      animate: false,
      fit: false,
      nodeDimensionsIncludeLabels: true,
      idealEdgeLength: 125,
    };
  }
}
