import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  EdgeDefinition,
  LayoutOptions,
  NodeDefinition,
  NodeSingular,
  Stylesheet,
} from 'cytoscape';
import {
  CytoscapeGraphComponent,
  GraphState,
} from '../../modules/cytoscape/cytoscape-graph/cytoscape-graph.component';
import { CytoscapeNodeHtmlParams } from '../../modules/cytoscape/cytoscape-graph/node-html-label';
import { GraphData, Node } from '../../services/data/data.service';
import { ResourceViewerService } from '../../services/resource-viewer/resource-viewer.service';
import { SlidingSidebarComponent } from '../sliding-sidebar/sliding-sidebar.component';

@Component({
  selector: 'app-resource-viewer',
  templateUrl: './resource-viewer.component.html',
  styleUrls: ['./resource-viewer.component.scss'],
})
export class ResourceViewerComponent implements OnInit, AfterViewInit {
  @ViewChild('graph')
  graph: CytoscapeGraphComponent;

  @ViewChild('sidebar')
  sidebar: SlidingSidebarComponent;

  @Input()
  graphConfig: GraphData;

  nodes: NodeDefinition[];
  edges: EdgeDefinition[];
  layoutOptions: LayoutOptions;
  style: Stylesheet[];
  nodeHtmlParams: CytoscapeNodeHtmlParams[];

  zoom = 1;

  state: GraphState = {};

  constructor(private resourceViewerService: ResourceViewerService) {}

  ngOnInit(): void {
    this.nodes = this.graphConfig.nodes;
    this.edges = this.graphConfig.edges;

    const graphConfig = this.resourceViewerService.config();
    this.layoutOptions = graphConfig.layoutOptions;
    this.style = graphConfig.style;
    this.nodeHtmlParams = graphConfig.nodeHtmlParams;
  }

  ngAfterViewInit(): void {
    this.graph.render();
  }

  setNodes(nodes: Node[]): void {}

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
