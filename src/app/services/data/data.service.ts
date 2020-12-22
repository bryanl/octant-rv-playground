import { Injectable } from '@angular/core';
import {
  EdgeDefinition,
  LayoutOptions,
  NodeDefinition,
  NodeSingular,
  Stylesheet,
} from 'cytoscape';
import { CytoscapeNodeHtmlParams } from '../../modules/cytoscape/cytoscape-graph/node-html-label';

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

  layoutOptions(): LayoutOptions {
    return {
      name: 'cola',
      // @ts-ignore
      animate: false,
      fit: true,
      padding: 150,
      nodeSpacing: (node: NodeSingular): number => {
        if (node.data('parent') === undefined) {
          return 70;
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
        css: {
          shape: 'round-rectangle',
          'z-index': 100,
        },
      },
      {
        selector: '$node > node',
        style: {
          'min-height': '100%',
          'min-width': '100%',
          'min-height-bias-bottom': '50%',
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

  nodeHtmlParams(): CytoscapeNodeHtmlParams[] {
    const style = {
      'background-color': 'hsl(198, 0%, 0%)',
      'border-radius': '4px',
      color: '#fff',
      'font-size': '14px',
      'margin-top': '18px',
      padding: '0 7px 3px',
      opacity: '0.85',
    };

    console.log('f', styleToString(style));

    return [
      {
        query: 'node',
        tpl: data => '<div>' + data.label + '</div>',
        ...defaultLabelPosition,
      },
      {
        query: '$node > node',
        tpl: data => `<div style="${styleToString(style)}">${data.label}</div>`,
        ...defaultLabelPosition,
      },
    ];
  }
}

const styleToString = (obj: { [key: string]: any }): string =>
  Object.entries(obj).reduce((prev, [key, val]) => {
    return `${prev} ${key}: ${val};`;
  }, '');

const defaultLabelPosition: CytoscapeNodeHtmlParams = {
  halign: 'center', // title vertical position. Can be 'left',''center, 'right'
  valign: 'bottom', // title vertical position. Can be 'top',''center, 'bottom'
  halignBox: 'center', // title vertical position. Can be 'left',''center, 'right'
  valignBox: 'bottom', // title relative box vertical position. Can be 'top',''center, 'bottom'
  cssClass: '', // any classes will be as attribute of <div> container for every title
};
