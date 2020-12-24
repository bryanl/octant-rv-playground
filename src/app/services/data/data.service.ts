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
      description: 'apps/v1 Deployment',
      width: 18 * 10,

      apiVersion: 'apps/v1',
      kind: 'Deployment',
    },
    classes: 'apps-Deployment',
  },
  {
    data: {
      id: 'apps/v1 ReplicaSet nginx-1',
      label: '77bd6fc7d8',
      description: 'apps/v1 ReplicaSet',
      width: '18 * 10',
      parent: 'apps/v1 Deployment nginx',

      podsOk: 10,

      apiVersion: 'apps/v1',
      kind: 'ReplicaSet',
    },
    classes: 'apps-ReplicaSet',
  },
  {
    data: {
      id: 'apps/v1 ReplicaSet nginx-2',
      label: '9d6658964',
      description: 'apps/v1 ReplicaSet',
      width: 18 * 10,
      parent: 'apps/v1 Deployment nginx',

      podsOk: 3,
      podsWarning: 8,
      podsError: 2,
      status: 'error',

      apiVersion: 'apps/v1',
      kind: 'ReplicaSet',
    },
    classes: 'apps-ReplicaSet',
  },
  {
    data: {
      id: 'v1 ServiceAccount default',
      label: 'default',
      description: 'v1 ServiceAccount',
      width: 17 * 8,

      apiVersion: 'v1',
      kind: 'ServiceAccount',
    },
    classes: 'serviceaccount',
  },
  {
    data: {
      id: 'v1 Secret default-token-1',
      label: 'default-token-1',
      description: 'v1 Secret',
      width: 9 * 8,

      apiVersion: 'v1',
      kind: 'Secret',
    },
    classes: 'secret',
  },
  {
    data: {
      id: 'v1 Service service',
      label: 'service',
      description: 'v1 Service',
      width: 10 * 6,

      apiVersion: 'v1',
      kind: 'Service',
    },
    classes: 'service',
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
      {
        data: {
          id: 'service-1',
          target: 'apps/v1 ReplicaSet nginx-1',
          source: 'v1 Service service',
        },
      },
      {
        data: {
          id: 'service-2',
          target: 'apps/v1 ReplicaSet nginx-2',
          source: 'v1 Service service',
        },
      },
    ];
  }

  nodes(): NodeDefinition[] {
    return nodes;
  }

  layoutOptions(): LayoutOptions {
    return {
      name: 'cose-bilkent',
      padding: 170,
      animate: false,
      idealEdgeLength: 200,
      fit: true,

      // name: 'cola',
      // animate: false,
      // fit: true,
      // padding: 150,
      // nodeSpacing: (node: NodeSingular): number => {
      //   if (node.data('parent') === undefined) {
      //     return 70;
      //   }
      //   return 40;
      // },
      // nodeSep: 20,
    };
  }

  style(): Stylesheet[] {
    const podPercentage = (key: string): ((NodeSingular) => string) => {
      return (ele: NodeSingular): string => {
        const total = ['podsOk', 'podsWarning', 'podsError'].reduce<number>(
          (p, c) => (ele.data(c) ? parseInt(ele.data(c), 10) + p : p),
          0
        );

        const x = (ele.data(key) / total) * 100;
        return isNaN(x) ? '0' : `${x}%`;
      };
    };

    return [
      {
        selector: 'node',
        css: {
          'background-color': 'hsl(198, 0%, 91%)',
          'border-color': 'hsl(198, 66%, 57%)',
          'border-width': 1,
          'font-size': '10px',
          content: `data(description)`,
          'text-valign': 'center',
          'text-wrap': 'wrap',
          shape: 'round-rectangle',
          width: 'data(width)',
        },
      },
      {
        selector: 'node:selected',
        css: {
          'background-color': 'hsl(198, 81%, 88%)',
          'border-width': 2,
        },
      },
      {
        selector: '$node > node',
        css: {
          'border-color': 'gray',
          content: '',
          padding: '40px',
        },
      },
      {
        selector: '.apps-ReplicaSet',
        css: {
          'border-width': 1,
          'border-color': 'gray',
          content: '',
          shape: 'ellipse',
          width: '60%',
          height: '60%',
          'pie-size': '100%',
          'pie-1-background-color': 'hsl(93, 79%, 40%)',
          'pie-1-background-size': podPercentage('podsOk'),
          'pie-2-background-color': 'hsl(48, 94%, 57%)',
          'pie-2-background-size': podPercentage('podsWarning'),
          'pie-3-background-color': 'hsl(9, 100%, 43%)',
          'pie-3-background-size': podPercentage('podsError'),
        },
      },
      {
        selector: '.apps-ReplicaSet:selected',
        css: {
          'border-width': 2,
          'border-color': 'hsl(198, 66%, 57%)',
        },
      },
      {
        selector: 'edge',
        css: {
          'curve-style': 'bezier',
          'target-arrow-shape': 'triangle',
          width: 1,
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
     ${nodeStatus(data)}
    <span>${data.label}</span>
</div>`,
      },
      {
        ...defaultLabelPosition,
        query: '.apps-Deployment',
        tpl: data =>
          `
<div style="${styleToString(deploymentStyle)}">
     ${nodeStatus(data)}
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

const nodeStatus = (data): string => {
  const status = data.status || 'success';
  return `<clr-icon size="12" shape="check-circle" class="is-${status} is-solid"></clr-icon>`;
};

const defaultLabelPosition: CytoscapeNodeHtmlParams = {
  halign: 'center', // title vertical position. Can be 'left',''center, 'right'
  valign: 'bottom', // title vertical position. Can be 'top',''center, 'bottom'
  halignBox: 'center', // title vertical position. Can be 'left',''center, 'right'
  valignBox: 'bottom', // title relative box vertical position. Can be 'top',''center, 'bottom'
  cssClass: '', // any classes will be as attribute of <div> container for every title
};
