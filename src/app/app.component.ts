import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResourceViewerComponent } from './components/resource-viewer/resource-viewer.component';
import { DataService } from './services/data/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('resourceViewer')
  resourceViewer: ResourceViewerComponent;

  private graphDataSubscription: Subscription;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.graphDataSubscription = this.dataService
      .graphData()
      .subscribe(graphData => {
        this.resourceViewer.setGraphData(graphData);
      });
  }

  ngOnDestroy(): void {
    if (this.graphDataSubscription) {
      this.graphDataSubscription.unsubscribe();
    }
  }
}
