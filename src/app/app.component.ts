import { Component, OnInit } from '@angular/core';
import { DataService, GraphData } from './services/data/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  graphConfig: GraphData;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.graphConfig = this.dataService.graphData();
    console.log({ ...this.graphConfig });
  }
}
