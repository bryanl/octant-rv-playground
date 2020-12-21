import { Injectable } from '@angular/core';
import {
  EdgeDefinition,
  LayoutOptions,
  NodeDataDefinition,
  NodeDefinition,
  NodeSingular,
  Stylesheet,
} from 'cytoscape';

const nodes: NodeDefinition[] = [
  {
    data: {
      id: 'apps/v1 Deployment nginx',
      label: 'nginx',
    },
    classes: 'compound',
  },
  {
    data: {
      id: 'apps/v1 ReplicaSet nginx-1',
      label: '1',
      parent: 'apps/v1 Deployment nginx',
    },
    classes: 'replicaset',
  },
  {
    data: {
      id: 'apps/v1 ReplicaSet nginx-2',
      label: '2',
      parent: 'apps/v1 Deployment nginx',
    },
    classes: 'replicaset',
  },
  {
    data: {
      id: 'v1 ServiceAccount default',
      label: 'default',
    },
    classes: 'serviceaccount',
  },
  {
    data: {
      id: 'v1 Secret default-token-1',
      label: 'default-token-1',
    },
    classes: 'secret',
  },
];

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}

  edges(): EdgeDefinition[] {
    return [
      {
        data: {
          id: 'serviceaccount',
          source: 'apps/v1 Deployment nginx',
          target: 'v1 ServiceAccount default',
        },
      },
      {
        data: {
          id: 'secret',
          source: 'apps/v1 Deployment nginx',
          target: 'v1 Secret default-token-1',
        },
      },
    ];
  }

  nodes(): NodeDefinition[] {
    return nodes;
  }

  layoutOptions(): any {
    const self = this;
    return {
      name: 'cola',
      animate: false,
      nodeDimensionsIncludeLabels: true,
      nodeSpacing: (node: NodeSingular): number => {
        if (node.data('parent') === undefined) {
          return 50;
        }
        return 10;
      },

      // name: 'cose-bilkent',
    };
  }

  style(): Stylesheet[] {
    return [
      {
        selector: 'node',
        style: {
          label: 'data(label)',
          shape: 'round-rectangle',
          'text-valign': 'bottom',
          'z-index': 100,
        },
      },
      {
        selector: 'edge',
        css: {
          'curve-style': 'taxi',
          'target-arrow-shape': 'triangle',
          'source-endpoint': 'inside-to-node',
          // @ts-ignore
          'z-compound-depth': 'bottom',
        },
      },
    ];
  }
}
