import 'cytoscape';
import { NodeSingular } from 'cytoscape';

declare module 'cytoscape' {
  export interface BaseLayoutOptions {
    animate?: boolean;
    fit?: boolean;
    padding?: number;
    nodeSpacing?: (node: NodeSingular) => number;
    nodeSep?: number;
  }

  namespace Css {
    import PropertyValueNode = cytoscape.Css.PropertyValueNode;

    export interface Node {
      'min-height'?: PropertyValueNode<number | string>;
      'min-width'?: PropertyValueNode<number | string>;
      'min-height-bias-bottom'?: PropertyValueNode<number | string>;
      padding?: PropertyValueNode<number | string>;

      'pie-size'?: PropertyValueNode<string>;
      'pie-1-background-color'?: PropertyValueNode<string>;
      'pie-1-background-size'?: PropertyValueNode<string>;
      'pie-2-background-color'?: PropertyValueNode<string>;
      'pie-2-background-size'?: PropertyValueNode<string>;
      'pie-3-background-color'?: PropertyValueNode<string>;
      'pie-3-background-size'?: PropertyValueNode<string>;
      'pie-4-background-color'?: PropertyValueNode<string>;
      'pie-4-background-size'?: PropertyValueNode<string>;
      'pie-5-background-color'?: PropertyValueNode<string>;
      'pie-5-background-size'?: PropertyValueNode<string>;
      'pie-6-background-color'?: PropertyValueNode<string>;
      'pie-6-background-size'?: PropertyValueNode<string>;
      'pie-7-background-color'?: PropertyValueNode<string>;
      'pie-7-background-size'?: PropertyValueNode<string>;
      'pie-8-background-color'?: PropertyValueNode<string>;
      'pie-8-background-size'?: PropertyValueNode<string>;
      'pie-9-background-color'?: PropertyValueNode<string>;
      'pie-9-background-size'?: PropertyValueNode<string>;
      'pie-10-background-color'?: PropertyValueNode<string>;
      'pie-10-background-size'?: PropertyValueNode<string>;
      'pie-11-background-color'?: PropertyValueNode<string>;
      'pie-11-background-size'?: PropertyValueNode<string>;
      'pie-12-background-color'?: PropertyValueNode<string>;
      'pie-12-background-size'?: PropertyValueNode<string>;
      'pie-13-background-color'?: PropertyValueNode<string>;
      'pie-13-background-size'?: PropertyValueNode<string>;
      'pie-14-background-color'?: PropertyValueNode<string>;
      'pie-14-background-size'?: PropertyValueNode<string>;
      'pie-15-background-color'?: PropertyValueNode<string>;
      'pie-15-background-size'?: PropertyValueNode<string>;
      'pie-16-background-color'?: PropertyValueNode<string>;
      'pie-16-background-size'?: PropertyValueNode<string>;
    }
  }
}
