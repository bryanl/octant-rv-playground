import * as Cy from 'cytoscape';
import * as attr from '../cytoscape-graph/graph-attributes';
import { CytoscapeClickEvent, CytoscapeMouseInEvent, CytoscapeMouseOutEvent } from '../types/graph';

export class GraphHighlighter {
  cy: Cy.Core;
  selected: CytoscapeClickEvent;
  hovered?: CytoscapeMouseInEvent;

  constructor(cy: Cy.Core) {
    this.cy = cy;
    this.selected = {
      summaryType: 'graph',
      summaryTarget: this.cy,
    };
  }

  onClick = (event: CytoscapeClickEvent) => {
    // ignore clicks on the currently selected element
    if (this.selected.summaryTarget === event.summaryTarget) {
      return;
    }

    this.selected = event;
    this.clearHover();
    this.unhighlight();

    // only highlight when selecting something other than the graph background
    if (this.selected.summaryType !== 'graph') {
      this.refresh();
    }
  };

  clearHover = () => {
    if (this.hovered) {
      this.hovered.summaryTarget.removeClass(attr.HoveredClass);
      this.hovered = undefined;
    }
  };

  onMouseIn = (event: CytoscapeMouseInEvent) => {
    // only highlight on hover when the graph is currently selected, otherwise leave the
    // selected element highlighted
    if (this.selected.summaryType === 'graph' && ['node', 'edge', 'group'].indexOf(event.summaryType) !== -1) {
      this.hovered = event;
      this.hovered.summaryTarget.addClass(attr.HoveredClass);
      this.refresh();
    }
  };

  onMouseOut = (event: CytoscapeMouseOutEvent) => {
    if (this.hovered && this.hovered.summaryTarget === event.summaryTarget) {
      this.clearHover();
      this.unhighlight();
    }
  };

  unhighlight = () => {
    this.cy.elements(`.${attr.DimClass}`).removeClass(attr.DimClass);
    this.cy.elements(`.${attr.HighlightClass}`).removeClass(attr.HighlightClass);
  };

  refresh = () => {
    const toHighlight = this.getHighlighted();
    if (!toHighlight) {
      return;
    }

    toHighlight.addClass(attr.HighlightClass);

    this.cy.elements().difference(toHighlight).addClass(attr.DimClass);
  };

  // Returns the nodes to highlight. Highlighting for a hovered element
  // is limited to its neighborhood.  Highlighting for a selected element
  // is extended to full incoming and outgoing paths.
  getHighlighted() {
    const isHover = this.selected.summaryType === 'graph';
    const event = isHover ? this.hovered : this.selected;
    if (event) {
      switch (event.summaryType) {
        case 'node':
          return this.getNodeHighlight(event.summaryTarget, isHover);
        case 'edge':
          return this.getEdgeHighlight(event.summaryTarget, isHover);
        case 'group':
          return this.getAppBoxHighlight(event.summaryTarget, isHover);
        default:
        // fall through
      }
    }
    return undefined;
  }

  includeParentNodes(nodes: any) {
    return nodes.reduce((all, current) => {
      all = all.add(current);
      if (current.isChild()) {
        all = all.add(current.parent());
      }
      return all;
    }, this.cy.collection());
  }

  getNodeHighlight(node: any, isHover: boolean) {
    const elems = isHover ? node.closedNeighborhood() : node.predecessors().add(node.successors());
    return this.includeParentNodes(elems.add(node));
  }

  getEdgeHighlight(edge: any, isHover: boolean) {
    let elems;
    if (isHover) {
      elems = edge.connectedNodes();
    } else {
      const source = edge.source();
      const target = edge.target();
      elems = source.add(target).add(source.predecessors()).add(target.successors());
    }
    return this.includeParentNodes(elems.add(edge));
  }

  getAppBoxHighlight(appBox: any, isHover: boolean) {
    let elems;
    if (isHover) {
      elems = appBox.children().reduce((prev, child) => {
        return prev.add(child.closedNeighborhood());
      }, this.cy.collection());
    } else {
      const children = appBox.children();
      elems = children.add(children.predecessors()).add(children.successors());
    }
    return this.includeParentNodes(elems);
  }
}
