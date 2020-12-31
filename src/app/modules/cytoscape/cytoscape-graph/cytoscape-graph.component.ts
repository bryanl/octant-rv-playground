import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as Cy from 'cytoscape';
import cytoscape, { NodeSingular, Position, SelectionType } from 'cytoscape';
import { CytoscapeClickEvent, CytoscapeGlobalScratchData, CytoscapeGlobalScratchNamespace } from '../types/graph';
import { GraphData } from '../types/graph-data';
import * as graphUtils from './graph-utils';
import { GraphConfig } from './graph_config';
import { WrapperComponent } from './wrapper/wrapper.component';

export interface GraphState {
  zoom?: number;
}

@Component({
  selector: 'app-cytoscape-graph',
  template: `<app-wrapper #wrapper></app-wrapper>`,
  styleUrls: ['./cytoscape-graph.component.scss'],
})
export class CytoscapeGraphComponent implements OnChanges, AfterViewInit {
  @ViewChild('wrapper')
  wrapper: WrapperComponent;

  @Input()
  pan: Position;

  @Input()
  selectionType: SelectionType;

  @Input()
  config: GraphConfig;

  @Input()
  zoom = 1;

  @Input()
  graphData: GraphData;

  @Output()
  state: EventEmitter<GraphState> = new EventEmitter<GraphState>();

  @Output()
  selected: EventEmitter<NodeSingular> = new EventEmitter<cytoscape.NodeSingular>();

  @Output()
  updateSummary: EventEmitter<CytoscapeClickEvent> = new EventEmitter<CytoscapeClickEvent>();

  @Output()
  ready: EventEmitter<Cy.Core> = new EventEmitter<cytoscape.Core>();

  loading = false;
  private customViewport: boolean;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const cy = this.getCy();
    if (!cy) {
      return;
    }

    let updateLayout = false;

    const graphData = changes.graphData;
    if (this.elementsNeedRelayout(graphData.previousValue.elements, graphData.currentValue.elements)) {
      updateLayout = true;
    }

    this.processGraphUpdate(cy, updateLayout);
  }

  getCy(): null | cytoscape.Core {
    if (this.wrapper) {
      return this.wrapper.getCy();
    }

    return null;
  }

  ngAfterViewInit(): void {
    this.cyInitialization(this.getCy());
  }

  zoomIn(): void {
    this.getCy().zoom(this.zoom + 0.01);
  }

  zoomOut(): void {
    this.getCy().zoom(this.zoom - 0.01);
  }

  maximize(): void {
    this.getCy().fit();
  }

  private cyInitialization(cy: Cy.Core): void {
    if (!cy) {
      return;
    }

    // TODO: move event handlers somewhere else
    cy.on('fit', (event: Cy.EventObject): void => {
      const cytoscapeEvent = graphUtils.getCytoscapeBaseEvent(cy, event);
      if (cytoscapeEvent) {
        this.customViewport = false;
      }
    });

    cy.on('nodehtml-create-or-update', 'node', (event: Cy.EventObjectNode, data: any): void => {
      const { label, isNew } = data;
      const { target } = event;
      const node = label.getNode();

      if (isNew) {
        node.setAttribute('data-node-id', target.id());
      }

      if (target.isParent) {
        return;
      }

      graphUtils.expandNodeBounds(target, node);
    });

    cy.on('layoutstop', (_: Cy.EventObject) => {
      graphUtils.safeFit(cy);
      graphUtils.fixLoopOverlap(cy);
    });

    cy.ready((event: Cy.EventObject) => {
      this.ready.emit(event.cy);
      this.processGraphUpdate(cy, true);
    });

    cy.on('destroy', (_: Cy.EventObject) => {
      this.wrapper.destroy();
      this.updateSummary.emit({ summaryType: 'graph', summaryTarget: undefined });
    });
  }

  private processGraphUpdate(cy: Cy.Core, updateLayout: boolean): void {
    if (!this.graphData) {
      return;
    }

    const globalScratchData: CytoscapeGlobalScratchData = {
      graphType: this.graphData.fetchParams.graphType,
      showNodeLabels: true, // TODO: is this right?
    };
    cy.scratch(CytoscapeGlobalScratchNamespace, globalScratchData);

    cy.startBatch();

    if (updateLayout) {
      cy.nodes().positions({ x: 0, y: 0 });
    }

    cy.json({ elements: this.graphData.elements });

    cy.endBatch();

    if (updateLayout) {
      graphUtils.runLayout(cy, this.config.layoutOptions);
    }

    cy.nodes().unselectify();
    cy.edges().unselectify();

    if (cy.$(':selected').length === 0) {
      this.handleTap({ summaryType: 'graph', summaryTarget: cy });
    }
  }

  private handleTap(event: CytoscapeClickEvent): void {
    this.updateSummary.emit(event);
  }

  private elementsNeedRelayout(prevElements: any, nextElements: any): boolean {
    if (prevElements === nextElements) {
      return false;
    }

    if (
      !prevElements ||
      !nextElements ||
      !prevElements.nodes ||
      !prevElements.edges ||
      !nextElements.nodes ||
      !nextElements.edges ||
      prevElements.nodes.length !== nextElements.nodes.length ||
      prevElements.edges.length !== nextElements.edges.length
    ) {
      return true;
    }

    return !(
      this.nodeOrEdgeArrayHasSameIds(nextElements.nodes, prevElements.nodes) &&
      this.nodeOrEdgeArrayHasSameIds(nextElements.edges, prevElements.edges)
    );
  }

  private nodeOrEdgeArrayHasSameIds<T extends Cy.NodeSingular | Cy.EdgeSingular>(a: Array<T>, b: Array<T>): boolean {
    const aIds = a.map(e => e.id).sort();
    return b
      .map(e => e.id)
      .sort()
      .every((eId, index) => eId === aIds[index]);
  }
}
