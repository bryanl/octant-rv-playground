import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CytoscapeGraphComponent } from './modules/cytoscape/cytoscape-graph/cytoscape-graph.component';
import { EdgeDefinition, LayoutOptions, NodeDefinition } from 'cytoscape';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('graph')
  graph: CytoscapeGraphComponent;

  title = 'rv-playground';

  nodes: NodeDefinition[] = [
    {
      data: { id: 'one' },
    },
    {
      data: { id: 'two' },
    },
  ];
  edges: EdgeDefinition[] = [
    {
      data: {
        id: 'edge',
        source: 'one',
        target: 'two',
      },
    },
  ];
  layoutOptions: LayoutOptions = {
    name: 'circle',
  };

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.graph.render();
  }
}
