import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-graph-controls',
  templateUrl: './graph-controls.component.html',
  styleUrls: ['./graph-controls.component.scss'],
})
export class GraphControlsComponent implements OnInit {
  @Input()
  zoom: number;

  constructor() {}

  ngOnInit(): void {}
}
