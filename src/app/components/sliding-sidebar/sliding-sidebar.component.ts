import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sliding-sidebar',
  templateUrl: './sliding-sidebar.component.html',
  styleUrls: ['./sliding-sidebar.component.scss'],
})
export class SlidingSidebarComponent implements OnInit {
  isClosed = true;

  constructor() {}

  ngOnInit(): void {}

  toggleClosed(): void {
    this.isClosed = !this.isClosed;
  }
}
