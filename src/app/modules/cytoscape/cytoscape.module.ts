import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CytoscapeGraphComponent } from './cytoscape-graph/cytoscape-graph.component';
import { WrapperComponent } from './cytoscape-graph/wrapper/wrapper.component';

@NgModule({
  declarations: [CytoscapeGraphComponent, WrapperComponent],
  imports: [CommonModule],
  exports: [CytoscapeGraphComponent],
})
export class CytoscapeModule {}
