import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GraphData } from './modules/cytoscape/cytoscape-graph/graph_data';
import { DataService } from './services/data/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  graphConfig: Observable<GraphData>;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.graphConfig = this.dataService.graphData();
    console.log({ ...this.graphConfig });
  }
}
