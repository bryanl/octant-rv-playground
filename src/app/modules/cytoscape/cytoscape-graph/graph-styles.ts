import * as Cy from 'cytoscape';
import { CytoscapeOptions } from 'cytoscape';
import { CyNode } from '../types/cy-node';
import { CytoscapeGlobalScratchData, CytoscapeGlobalScratchNamespace, NodeType } from '../types/graph';
import * as color from './clarity-colors';
import { style } from './css-utils';
import * as attr from './graph-attributes';
import { decoratedNodeData } from './graph-utils';
import * as health from './health';

const labelStyleDefault = style({
  borderRadius: '3px',
  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 2px 8px 0 rgba(0, 0, 0, 0.19)',
  display: 'flex',
  fontSize: '9px',
  fontWeight: 'normal',
  marginTop: '4px',
  lineHeight: '11px',
  textAlign: 'center',
});

const contentStyleDefault = style({
  alignItems: 'center',
  backgroundColor: attr.NodeText.backgroundColor,
  color: attr.NodeText.color,
  display: 'flex',
  fontSize: attr.NodeText.fontSize,
  padding: '3px 5px',
  borderRadius: '3px',
  borderWidth: '1px',
});

const contentStyleWithBadges = style({
  borderBottomLeftRadius: 'unset',
  borderColor: attr.Badge.backgroundColor,
  borderStyle: 'solid',
  borderTopLeftRadius: 'unset',
  borderLeft: '0',
});

export class GraphStyles {
  static colorsDefined: boolean;

  static defineColors(): void {
    if (GraphStyles.colorsDefined) {
      return;
    }

    // TODO: define colors
  }

  static options(): CytoscapeOptions {
    // return { wheelSensitivity: 0.1, autounselectify: false, autoungrabify: true };
    return { autounselectify: false, autoungrabify: true };
  }

  static htmlNodeLabels(cy: Cy.Core): any {
    return [
      {
        query: 'node:visible',
        halign: 'center',
        valign: 'bottom',
        halignBox: 'center',
        valignBox: 'bottom',
        tpl: (data: any) => this.htmlLabelForNode(cy.$id(data.id)),
      },
    ];
  }

  static styles(): Cy.Stylesheet[] {
    GraphStyles.defineColors();

    const getCyGlobalData = (ele: Cy.NodeSingular | Cy.EdgeSingular): CytoscapeGlobalScratchData => {
      return ele.cy().scratch(CytoscapeGlobalScratchNamespace);
    };

    const getEdgeColor = (_: Cy.EdgeSingular): string => {
      return '#000';
    };

    const getEdgeLabel = (_: Cy.EdgeSingular): string => {
      return '';
    };

    const getNodeBackgroundImage = (_: Cy.NodeSingular): string => {
      return 'none';
    };

    const getNodeBackgroundPositionX = (ele: Cy.NodeSingular): string => {
      if (getNodeShape(ele) === 'round-tag') {
        return '0';
      }
      return '50%';
    };

    const getNodeBackgroundPositionY = (ele: Cy.NodeSingular): string => {
      if (getNodeShape(ele) === 'round-triangle') {
        return '6px';
      }
      return '50%';
    };

    const getNodeBorderColor = (ele: Cy.NodeSingular): string => {
      switch (ele.data(CyNode.healthStatus)) {
        case health.Degraded.name:
          return attr.Node.colorBorderDegraded;
        case health.Failure.name:
          return attr.Node.colorBorderFailure;
        default:
          return attr.Node.colorBorder;
      }
    };

    const getNodeShape = (ele: Cy.NodeSingular): Cy.Css.NodeShape => {
      const nodeData = decoratedNodeData(ele);
      switch (nodeData.nodeType) {
        case NodeType.Workload:
          return 'ellipse';
        case NodeType.Networking:
          return 'triangle';
        case NodeType.Configuration:
          return 'barrel';
        case NodeType.CustomResource:
          return 'heptagon';
        default:
          return 'star';
      }
    };

    const nodeSelectedStyle = {
      // TODO: get this using `CyNode.healthStatus`. If node has a non-ok status, return that node's color
      'border-color': '#6a0dad',
      'border-width': '3px',
    };

    return [
      // Node Defaults
      {
        selector: 'node',
        css: {
          'background-color': attr.Node.colorFill,
          'background-image': (ele: Cy.NodeSingular) => {
            return getNodeBackgroundImage(ele);
          },
          'background-width': '80%',
          'background-height': '80%',
          'background-position-x': getNodeBackgroundPositionX,
          'background-position-y': getNodeBackgroundPositionY,
          'border-color': (ele: Cy.NodeSingular) => {
            return getNodeBorderColor(ele);
          },
          'border-style': (ele: Cy.NodeSingular) => {
            return decoratedNodeData(ele).isIdle ? 'dotted' : 'solid';
          },
          'border-width': attr.Node.borderWidth,
          ghost: 'yes',
          'ghost-offset-x': 1,
          'ghost-offset-y': 1,
          'ghost-opacity': 0.4,
          height: attr.Node.height,
          shape: (ele: Cy.NodeSingular) => {
            return getNodeShape(ele);
          },
          width: attr.Node.width,
          'z-index': 10,
        },
      },
      // Node is an App Box
      {
        selector: `node[?isGroup]`,
        css: {
          'background-color': attr.NodeBox.colorFill,
        },
      },
      // Node is selected
      {
        selector: 'node:selected',
        style: nodeSelectedStyle,
      },
      // Node is highlighted (see GraphHighlighter.ts)
      {
        selector: `node.${attr.HighlightClass}`,
        style: {
          'font-size': attr.NodeText.fontSizeHover,
        },
      },
      // Node other than App Box is highlighted (see GraphHighlighter.ts)
      {
        selector: `node.${attr.HighlightClass}[^isGroup]`,
        style: {
          'background-color': (ele: Cy.NodeSingular) => {
            switch (ele.data(CyNode.healthStatus)) {
              case health.Degraded.name:
                return attr.Node.colorFillHoverDegraded;
              case health.Failure.name:
                return attr.Node.colorFillHoverFailure;
              default:
                return attr.Node.colorFillHover;
            }
          },
          'border-color': (ele: Cy.NodeSingular) => {
            switch (ele.data(CyNode.healthStatus)) {
              case health.Degraded.name:
                return attr.Node.colorFillHoverDegraded;
              case health.Failure.name:
                return attr.Node.colorFillHoverFailure;
              default:
                return attr.Node.colorFillHover;
            }
          },
        },
      },
      // Node is dimmed (see GraphHighlighter.ts)
      {
        selector: `node.${attr.DimClass}`,
        style: {
          opacity: 0.6,
        },
      },
      {
        selector: 'edge',
        css: {
          'curve-style': 'bezier',
          'font-size': attr.Edge.textFontSize,
          label: (ele: Cy.EdgeSingular) => {
            return getEdgeLabel(ele);
          },
          'line-color': (ele: Cy.EdgeSingular) => {
            return getEdgeColor(ele);
          },
          'line-style': 'solid',
          'target-arrow-shape': 'vee',
          'target-arrow-color': (ele: Cy.EdgeSingular) => {
            return getEdgeColor(ele);
          },
          'text-events': 'yes',
          'text-outline-color': attr.Edge.textOutlineColor,
          'text-outline-width': attr.Edge.textOutlineWidth,
          'text-wrap': 'wrap',
          width: attr.Edge.width,
        },
      },
      {
        selector: 'edge:selected',
        css: {
          width: attr.Edge.widthSelected,
          label: (ele: Cy.EdgeSingular) => getEdgeLabel(ele),
        },
      },
      {
        selector: 'edge[protocol="tcp"]',
        css: {
          'target-arrow-shape': 'triangle-cross',
          'line-style': 'solid',
        },
      },
      {
        selector: `edge.${attr.HighlightClass}`,
        style: {
          'font-size': attr.Edge.textFontSizeHover,
        },
      },
      {
        selector: `edge.${attr.HoveredClass}`,
        style: {
          label: (ele: Cy.EdgeSingular) => {
            return getEdgeLabel(ele);
          },
        },
      },
      {
        selector: `edge.${attr.DimClass}`,
        style: {
          opacity: 0.3,
        },
      },
      {
        selector: '*.find[^isGroup]',
        style: {
          'overlay-color': color.LabelAndBadge['6'],
          'overlay-padding': '7px',
          'overlay-opacity': 0.3,
        },
      },
      {
        selector: '*.span[^isGroup]',
        style: {
          'overlay-color': color.LabelAndBadge['11'],
          'overlay-padding': '7px',
          'overlay-opacity': 0.3,
        },
      },
    ];
  }

  static htmlLabelForNode(ele: Cy.NodeSingular): string {
    const getCyGlobalData = (node: Cy.NodeSingular): CytoscapeGlobalScratchData => {
      return node.cy().scratch(CytoscapeGlobalScratchNamespace);
    };

    let content: string;
    const cyGlobal = getCyGlobalData(ele);
    const data = decoratedNodeData(ele);

    let labelRawStyle = '';

    let isGroup: string;
    if (data) {
      isGroup = data.isGroup;
      content = data.label;
    }

    if (ele.hasClass(attr.HighlightClass)) {
      labelRawStyle += 'font-size: ' + attr.NodeText.fontSizeHover + ';';
    }

    if (ele.hasClass(attr.DimClass)) {
      labelRawStyle += 'opacity: 0.6;';
    }

    if (isGroup) {
      labelRawStyle += 'margin-top: 13px;';
    }

    const badges = `<cy-badge></cy-badge>`;
    const hasBadge = badges.length > 0;

    if (getCyGlobalData(ele).showNodeLabels) {
      let contentRawStyle = '';

      if (isGroup) {
        contentRawStyle += `background-color: ${attr.Node.parentBackgroundColor};`;
        contentRawStyle += `color: ${attr.Node.parentTextColor};`;
      }
      if (ele.hasClass(attr.HighlightClass)) {
        contentRawStyle += 'font-size: ' + attr.NodeText.fontSizeHover + ';';
      }

      content = `<span style="${contentStyleDefault} ${
        hasBadge ? contentStyleDefault : ''
      } ${contentRawStyle}">${badges}${content}</span>`;
    }

    return `<div style="${labelStyleDefault} ${labelRawStyle}">${content}</div>`;
  }
}
