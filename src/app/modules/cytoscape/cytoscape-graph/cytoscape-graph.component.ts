import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import * as cy from 'cytoscape';
import cytoscape, {
  CytoscapeOptions,
  NodeSingular,
  Position,
  SelectionType,
} from 'cytoscape';
import cola from 'cytoscape-cola';
import coseBilkent from 'cytoscape-cose-bilkent';
import dagre from 'cytoscape-dagre';
import { GraphConfig } from './graph_config';
import { GraphData } from './graph_data';

const nodeHtmlLabel = require('cytoscape-node-html-label');

cy.use(dagre);
cy.use(coseBilkent);
cy.use(cola);
nodeHtmlLabel(cy);

export interface GraphState {
  zoom?: number;
}

@Component({
  selector: 'app-cytoscape-graph',
  template: ` <div #cyGraph class="graphWrapper"></div> `,
  styleUrls: ['./cytoscape-graph.component.scss'],
})
export class CytoscapeGraphComponent {
  @ViewChild('cyGraph')
  cyGraph: ElementRef;

  @Input()
  data: GraphData;

  @Input()
  pan: Position;

  @Input()
  selectionType: SelectionType;

  @Input()
  config: GraphConfig;

  @Input()
  zoom = 1;

  @Output()
  state: EventEmitter<GraphState> = new EventEmitter<GraphState>();

  @Output()
  selected: EventEmitter<NodeSingular> = new EventEmitter<cytoscape.NodeSingular>();

  private cy: cy.Core;

  loading = false;
  private initialZoom: number;
  private initialPosition: cytoscape.Position;

  constructor() {}

  render(): void {
    this.runWhileLoading(this.rerender.bind(this));
  }

  private runWhileLoading(f: () => void): void {
    this.loading = true;
    setTimeout(() => {
      f();
      setTimeout(() => {
        this.loading = false;
      }, 30);
    }, 0);
  }

  private rerender(): void {
    if (!this.cyGraph) {
      console.warn(`No cyGraph found`);
      return;
    }

    const cyOptions: CytoscapeOptions = {
      container: this.cyGraph.nativeElement,
      pan: this.pan,
      selectionType: this.selectionType,
      style: this.config ? this.config.style : undefined,
      zoom: this.zoom,
      minZoom: -10,
      maxZoom: 10,
    };

    this.cy = cytoscape(cyOptions);

    if (this.config.nodeHtmlParams) {
      (this.cy as any).nodeHtmlLabel(this.config.nodeHtmlParams);
    }

    this.cy.startBatch();
    this.cy.nodes().remove();
    this.cy.edges().remove();
    if (this.data) {
      if (this.data.nodes) {
        this.cy.add(this.data.nodes);
      }

      if (this.data.edges) {
        this.cy.add(this.data.edges);
      }
    }
    this.cy.endBatch();
    if (this.config.layoutOptions) {
      this.cy.layout(this.config.layoutOptions).run();
    }

    this.cy.reset();
    this.cy.center();

    this.cy.on('zoom', this.emitState.bind(this));
    this.cy.on('select', this.emitSelected.bind(this));

    this.initialZoom = this.cy.zoom();
    this.initialPosition = this.cy.pan();

    this.emitState();
  }

  emitSelected(ev): void {
    this.selected.emit(ev.target);
  }

  emitState(): void {
    this.zoom = this.cy.zoom();

    const state: GraphState = {
      zoom: this.cy.zoom(),
    };
    this.state.emit(state);
  }

  zoomIn(): void {
    this.cy.zoom(this.zoom + 0.01);
  }

  zoomOut(): void {
    this.cy.zoom(this.zoom - 0.01);
  }

  maximize(): void {
    this.cy.fit();
  }
}
