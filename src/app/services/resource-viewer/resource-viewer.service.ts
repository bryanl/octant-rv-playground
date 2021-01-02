import { Injectable } from '@angular/core';
import { LayoutOptions } from 'cytoscape';

@Injectable({
  providedIn: 'root',
})
export class ResourceViewerService {
  constructor() {}

  layoutOptions(): LayoutOptions {
    return {
      // name: 'cose',
      // animate: false,

      name: 'cose-bilkent',
      padding: 100,
      animate: false,
      idealEdgeLength: 75,
      fit: true,

      // name: 'cola',
      // animate: false,
      // fit: true,
      // // padding: 150,
      // nodeSpacing: (node: NodeSingular): number => {
      //   if (node.data('parent') === undefined) {
      //     return 70;
      //   }
      //   return 40;
      // },
      // nodeSep: 20,
    };
  }
}
