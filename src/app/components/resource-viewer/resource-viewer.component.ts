import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { LayoutOptions, NodeSingular } from 'cytoscape';
import { CytoscapeGraphComponent, GraphState } from '../../modules/cytoscape/cytoscape-graph/cytoscape-graph.component';
import { CytoscapeBaseEvent, CytoscapeClickEvent } from '../../modules/cytoscape/types/graph';
import { GraphData } from '../../modules/cytoscape/types/graph-data';
import { ResourceViewerService } from '../../services/resource-viewer/resource-viewer.service';
import { SlidingSidebarComponent } from '../sliding-sidebar/sliding-sidebar.component';

@Component({
  selector: 'app-resource-viewer',
  templateUrl: './resource-viewer.component.html',
  styleUrls: ['./resource-viewer.component.scss'],
})
export class ResourceViewerComponent implements OnInit {
  @ViewChild('graph')
  graph: CytoscapeGraphComponent;

  @ViewChild('sidebar')
  sidebar: SlidingSidebarComponent;

  @Input()
  graphData: GraphData;

  zoom = 1;

  state: GraphState = {};

  layoutOptions: LayoutOptions;

  constructor(private resourceViewerService: ResourceViewerService) {}

  ngOnInit(): void {
    this.layoutOptions = this.resourceViewerService.layoutOptions();
  }

  handleGraphState(state: GraphState): void {
    this.state = state;
    this.zoom = state.zoom;
  }

  handleGraphSelected(node: NodeSingular): void {
    this.sidebar.show(node);
  }

  handleZoomIn(): void {
    this.graph.zoomIn();
  }

  handleZoomOut(): void {
    this.graph.zoomOut();
  }

  handleMaximize(): void {
    this.graph.maximize();
  }

  handleDoubleTap(event: CytoscapeBaseEvent): void {
    console.log('double tap', event.summaryTarget);
  }

  handleUpdateSummary(event: CytoscapeClickEvent): void {
    setTimeout(() => {
      this.sidebar.show(event.summaryTarget);
    });
  }
}
