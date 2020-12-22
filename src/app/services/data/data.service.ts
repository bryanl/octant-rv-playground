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
    classes: 'apps-Deployment',
  },
  {
    data: {
      id: 'apps/v1 ReplicaSet nginx-1',
      label: '77bd6fc7d8',
      parent: 'apps/v1 Deployment nginx',
    },
    classes: 'apps-ReplicaSet',
  },
  {
    data: {
      id: 'apps/v1 ReplicaSet nginx-2',
      label: '9d6658964',
      parent: 'apps/v1 Deployment nginx',
    },
    classes: 'apps-ReplicaSet',
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
        selectable: false,
      },
      {
        data: {
          id: 'secret',
          source: 'apps/v1 Deployment nginx',
          target: 'v1 Secret default-token-1',
        },
        selectable: false,
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
        return 40;
      },
      nodeSep: 20,
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
          padding: '40px',
        },
      },
      {
        selector: 'edge',
        css: {
          'curve-style': 'bezier',
          'target-arrow-shape': 'triangle',
        },
      },
    ];
  }

  nodeHtmlParams(): CytoscapeNodeHtmlParams[] {
    const deploymentStyle = {
      'background-color': 'hsl(198, 0%, 0%)',
      'border-radius': '4px',
      color: '#fff',
      'font-family': 'var(--clr-font)',
      'font-size': '14px',
      'margin-top': '50px',
      padding: '0 7px 3px',
      opacity: '0.85',
    };

    const replicasetStyle = {
      'background-color': 'hsl(198, 0%, 98%)',
      'border-radius': '4px',
      'box-shadow': '2px 2px 4px #ccc',
      'font-size': '12px',
      'margin-top': '4px',
      padding: '0 5px',
      opacity: '0.85',
    };

    return [
      {
        ...defaultLabelPosition,
        query: 'node',
        tpl: data =>
          `
<div style="${styleToString(replicasetStyle)}">
    <clr-icon size="12" shape="check-circle" class="is-success is-solid"></clr-icon>
    <span>${data.label}</span>
</div>`,
      },
      {
        ...defaultLabelPosition,
        query: '.apps-Deployment',
        tpl: data =>
          `
<div style="${styleToString(deploymentStyle)}">
    <clr-icon size="12" shape="check-circle" class="is-success is-solid"></clr-icon>
    <span>Deployment ${data.label}</span>
</div>`,
      },
    ];
  }
}

interface Style {
  [key: string]: string;
}

const styleToString = (obj: Style): string =>
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
