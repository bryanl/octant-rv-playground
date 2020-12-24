import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as cy from 'cytoscape';
import cytoscape, {
  CytoscapeOptions,
  EdgeDefinition,
  LayoutOptions,
  NodeDefinition,
  Position,
  SelectionType,
  Stylesheet,
} from 'cytoscape';
import dagre from 'cytoscape-dagre';
import coseBilkent from 'cytoscape-cose-bilkent';
import cola from 'cytoscape-cola';
import { CytoscapeNodeHtmlParams } from './node-html-label';
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
  nodes: NodeDefinition[];

  @Input()
  edges: EdgeDefinition[];

  @Input()
  pan: Position;

  @Input()
  selectionType: SelectionType;

  @Input()
  style: Stylesheet[];

  @Input()
  layoutOptions: LayoutOptions;

  @Input()
  nodeHtmlParams: CytoscapeNodeHtmlParams[];

  @Input()
  zoom = 1;

  @Output()
  state: EventEmitter<GraphState> = new EventEmitter<GraphState>();

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
      style: this.style,
      zoom: this.zoom,
      minZoom: -10,
      maxZoom: 10,
    };

    this.cy = cytoscape(cyOptions);

    if (this.nodeHtmlParams) {
      (this.cy as any).nodeHtmlLabel(this.nodeHtmlParams);
    }

    this.cy.startBatch();
    this.cy.nodes().remove();
    this.cy.edges().remove();
    if (this.nodes) {
      this.cy.add(this.nodes);
    }
    if (this.edges) {
      this.cy.add(this.edges);
    }
    this.cy.endBatch();
    if (this.layoutOptions) {
      this.cy.layout(this.layoutOptions).run();
    }

    this.cy.reset();
    this.cy.center();

    this.cy.on('zoom', this.emitState.bind(this));
    this.initialZoom = this.cy.zoom();
    this.initialPosition = this.cy.pan();

    this.emitState(null);
  }

  emitState(_): void {
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

  private update(): void {}
}
