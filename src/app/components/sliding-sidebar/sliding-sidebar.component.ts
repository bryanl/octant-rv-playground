import { Component, OnInit } from '@angular/core';
import { NodeSingular } from 'cytoscape';

@Component({
  selector: 'app-sliding-sidebar',
  templateUrl: './sliding-sidebar.component.html',
  styleUrls: ['./sliding-sidebar.component.scss'],
})
export class SlidingSidebarComponent implements OnInit {
  node: any;

  isClosed = true;

  constructor() {}

  ngOnInit(): void {}

  toggleClosed(): void {
    if (this.node) {
      this.isClosed = !this.isClosed;
    }
  }

  show(node: NodeSingular): void {
    this.node = node.data();
    if (this.node) {
      this.isClosed = false;
    }
  }
}
