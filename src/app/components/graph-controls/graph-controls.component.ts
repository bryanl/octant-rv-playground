import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-graph-controls',
  templateUrl: './graph-controls.component.html',
  styleUrls: ['./graph-controls.component.scss'],
})
export class GraphControlsComponent implements OnInit {
  @Input()
  zoom: number;

  @Output()
  zoomIn: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  zoomOut: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  maximize: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  triggerZoomIn(): void {
    this.zoomIn.emit();
  }

  triggerZoomOut(): void {
    this.zoomOut.emit();
  }

  triggerMaximize(): void {
    this.maximize.emit();
  }
}
