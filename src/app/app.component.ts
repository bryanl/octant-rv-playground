import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  EdgeDefinition,
  LayoutOptions,
  NodeDefinition,
  NodeSingular,
  Stylesheet,
} from 'cytoscape';
import { SlidingSidebarComponent } from './components/sliding-sidebar/sliding-sidebar.component';
import {
  CytoscapeGraphComponent,
  GraphState,
} from './modules/cytoscape/cytoscape-graph/cytoscape-graph.component';
import { CytoscapeNodeHtmlParams } from './modules/cytoscape/cytoscape-graph/node-html-label';
import { DataService } from './services/data/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('graph')
  graph: CytoscapeGraphComponent;

  @ViewChild('sidebar')
  sidebar: SlidingSidebarComponent;

  title = 'rv-playground';

  nodes: NodeDefinition[];
  edges: EdgeDefinition[];
  layoutOptions: LayoutOptions;
  style: Stylesheet[];
  nodeHtmlParams: CytoscapeNodeHtmlParams[];

  zoom = 1;

  state: GraphState = {};

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.nodes = this.dataService.nodes();
    this.edges = this.dataService.edges();
    this.layoutOptions = this.dataService.layoutOptions();
    this.style = this.dataService.style();
    this.nodeHtmlParams = this.dataService.nodeHtmlParams();
  }

  ngAfterViewInit(): void {
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
