import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResourceViewerComponent } from './components/resource-viewer/resource-viewer.component';
import { DecoratedGraphEdgeWrapper, DecoratedGraphNodeWrapper, GraphType } from './modules/cytoscape/types/graph';
import { GraphData } from './modules/cytoscape/types/graph-data';
import { DataService } from './services/data/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('resourceViewer')
  resourceViewer: ResourceViewerComponent;

  graphData: Observable<GraphData>;

  private graphDataSubscription: Subscription;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.graphData = this.dataService.graphData().pipe(
      map(og => {
        return {
          elements: {
            nodes: og.nodes as DecoratedGraphNodeWrapper[],
            edges: og.edges as DecoratedGraphEdgeWrapper[],
          },
          fetchParams: {
            graphType: GraphType.RESOURCE_VIEWER,
          },
        };
      })
    );
  }

  ngOnDestroy(): void {
    if (this.graphDataSubscription) {
      this.graphDataSubscription.unsubscribe();
    }
  }
}
