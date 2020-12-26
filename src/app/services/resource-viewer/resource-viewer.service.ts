import { Injectable } from '@angular/core';
import { LayoutOptions, NodeSingular, Stylesheet } from 'cytoscape';
import { GraphConfig } from '../../modules/cytoscape/cytoscape-graph/graph_config';
import { CytoscapeNodeHtmlParams } from '../../modules/cytoscape/cytoscape-graph/node-html-label';

@Injectable({
  providedIn: 'root',
})
export class ResourceViewerService {
  constructor() {}

  config(): GraphConfig {
    return {
      layoutOptions: this.layoutOptions(),
      style: this.style(),
      nodeHtmlParams: this.nodeHtmlParams(),
    };
  }

  private layoutOptions(): LayoutOptions {
    return {
      name: 'cose-bilkent',
      padding: 100,
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

  private style(): Stylesheet[] {
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

  private nodeHtmlParams(): CytoscapeNodeHtmlParams[] {
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
      {
        ...defaultLabelPosition,
        query: '.apps-DaemonSet',
        tpl: data =>
          `
<div style="${styleToString(deploymentStyle)}">
     ${nodeStatus(data)}
    <span>DaemonSet ${data.label}</span>
</div>`,
      },
    ];
  }
}

const defaultLabelPosition: CytoscapeNodeHtmlParams = {
  halign: 'center', // title vertical position. Can be 'left',''center, 'right'
  valign: 'bottom', // title vertical position. Can be 'top',''center, 'bottom'
  halignBox: 'center', // title vertical position. Can be 'left',''center, 'right'
  valignBox: 'bottom', // title relative box vertical position. Can be 'top',''center, 'bottom'
  cssClass: '', // any classes will be as attribute of <div> container for every title
};

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
