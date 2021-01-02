import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createCustomElement } from '@angular/elements';
import { ClarityModule } from '@clr/angular';
import { CytoscapeGraphComponent } from './cytoscape-graph/cytoscape-graph.component';
import { WrapperComponent } from './cytoscape-graph/wrapper/wrapper.component';
import { BadgeComponent } from './cytoscape-graph/badge/badge.component';

@NgModule({
  declarations: [CytoscapeGraphComponent, WrapperComponent, BadgeComponent],
  imports: [CommonModule, ClarityModule],
  exports: [CytoscapeGraphComponent],
})
export class CytoscapeModule {
  constructor(private injector: Injector) {
    const badgeComponent = createCustomElement(BadgeComponent, { injector });
    customElements.define('cy-badge', badgeComponent);
  }
}
