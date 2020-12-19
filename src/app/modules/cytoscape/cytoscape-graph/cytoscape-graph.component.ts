import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-cytoscape-graph',
  template: ` <div #cyGraph class="graphWrapper"></div> `,
  styleUrls: ['./cytoscape-graph.component.scss'],
})
export class CytoscapeGraphComponent implements OnInit {
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
  style: Stylesheet[] = [
    {
      selector: 'node',
      style: {
        label: 'data(id)',
      },
    },
  ];

  @Input()
  layoutOptions: LayoutOptions = {
    name: 'grid',
  };

  private cy: cy.Core;

  loading = false;

  constructor() {}

  ngOnInit(): void {}

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
    };

    this.cy = cytoscape(cyOptions);
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
  }
}
