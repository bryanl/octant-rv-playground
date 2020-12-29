import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NodeSingular } from 'cytoscape';
import {
  CytoscapeGraphComponent,
  GraphState,
} from '../../modules/cytoscape/cytoscape-graph/cytoscape-graph.component';
import { GraphConfig } from '../../modules/cytoscape/cytoscape-graph/graph_config';
import { GraphData } from '../../modules/cytoscape/cytoscape-graph/graph_data';
import { Node } from '../../services/data/data.service';
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

  graphData: GraphData;

  graphConfig: GraphConfig;

  zoom = 1;

  state: GraphState = {};

  constructor(private resourceViewerService: ResourceViewerService) {}

  ngOnInit(): void {
    this.graphConfig = this.resourceViewerService.config();
  }

  setGraphData(graphData: GraphData): void {
    this.graphData = graphData;
    this.graph.render();
  }

  handleGraphState(state: GraphState): void {
    this.state = state;
    this.zoom = state.zoom;
  }

  handleGraphSelected(node: NodeSingular): void {
    console.log('selected', node.data('id'));
    this.sidebar.isClosed = false;
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
}
