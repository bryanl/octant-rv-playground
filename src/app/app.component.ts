import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CytoscapeGraphComponent } from './modules/cytoscape/cytoscape-graph/cytoscape-graph.component';
import {
  EdgeDefinition,
  LayoutOptions,
  NodeDefinition,
  Stylesheet,
} from 'cytoscape';
import { DataService } from './services/data/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('graph')
  graph: CytoscapeGraphComponent;

  title = 'rv-playground';

  nodes: NodeDefinition[];
  edges: EdgeDefinition[];
  layoutOptions: LayoutOptions;
  style: Stylesheet[];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.nodes = this.dataService.nodes();
    this.edges = this.dataService.edges();
    this.layoutOptions = this.dataService.layoutOptions();
    this.style = this.dataService.style();
  }

  ngAfterViewInit(): void {
    this.graph.render();
  }
}
