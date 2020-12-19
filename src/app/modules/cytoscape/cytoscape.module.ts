import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CytoscapeGraphComponent } from './cytoscape-graph/cytoscape-graph.component';

@NgModule({
  declarations: [CytoscapeGraphComponent],
  imports: [CommonModule],
  exports: [CytoscapeGraphComponent],
})
export class CytoscapeModule {}
