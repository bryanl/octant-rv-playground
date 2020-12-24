import { LayoutOptions, Stylesheet } from 'cytoscape';
import { CytoscapeNodeHtmlParams } from './node-html-label';

/**
 * GraphConfig specifies configuration for a cytoscape graph.
 */
export interface GraphConfig {
  /**
   * Layout options for the graph.
   */
  layoutOptions?: LayoutOptions;
  /**
   * Style configuration for the graph.
   */
  style: Stylesheet[];
  /**
   * Parameters for configuring a node's HTML label.
   */
  nodeHtmlParams?: CytoscapeNodeHtmlParams[];
}
