import 'cytoscape';

declare module 'cytoscape' {
  namespace Css {
    export interface Node {
      'min-height'?: PropertyValueNode<number | string>;
      'min-width'?: PropertyValueNode<number | string>;
      'min-height-bias-bottom'?: PropertyValueNode<number | string>;
    }
  }
}
