import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import cytoscape, * as Cy from 'cytoscape';
import cola from 'cytoscape-cola';
import coseBilkent from 'cytoscape-cose-bilkent';
import dagre from 'cytoscape-dagre';
import { GraphStyles } from '../graph-styles';
import GroupCompoundLayout from '../layout/graph-compound-layout';

const nodeHtmlLabel = require('cy-node-html-label');

Cy.use(cola);
Cy.use(coseBilkent);
Cy.use(dagre);
cytoscape('layout', 'group-compound-layout', GroupCompoundLayout);
nodeHtmlLabel(Cy);

@Component({
  selector: 'app-wrapper',
  template: `<div #cyGraph class="graphWrapper"></div>`,
  styleUrls: ['./wrapper.component.scss'],
})
export class WrapperComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cyGraph')
  cyGraph: ElementRef;

  cy?: Cy.Core;

  constructor() {}

  ngAfterViewInit(): void {
    this.build();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  getCy(): Cy.Core {
    return this.cy;
  }

  private build(): void {
    if (this.cy) {
      this.destroy();
    }

    const options: Cy.CytoscapeOptions = {
      container: this.cyGraph.nativeElement,
      boxSelectionEnabled: false,
      style: GraphStyles.styles(),
      ...GraphStyles.options(),
    };

    this.cy = cytoscape(options);
    (this.cy as any).nodeHtmlLabel(GraphStyles.htmlNodeLabels(this.cy));
  }

  destroy(): void {
    if (this.cy) {
      this.cy.destroy();
      this.cy = undefined;
    }
  }
}
