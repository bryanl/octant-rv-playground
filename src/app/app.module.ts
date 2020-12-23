import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CytoscapeModule } from './modules/cytoscape/cytoscape.module';
import { SlidingSidebarComponent } from './components/sliding-sidebar/sliding-sidebar.component';
import { SlidingSidebarToggleLabelPipe } from './components/sliding-sidebar/sliding-sidebar-toggle-label/sliding-sidebar-toggle-label.pipe';
import { GraphControlsComponent } from './components/graph-controls/graph-controls.component';
import { ZoomLevelPipe } from './components/graph-controls/zoom-level/zoom-level.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SlidingSidebarComponent,
    SlidingSidebarToggleLabelPipe,
    GraphControlsComponent,
    ZoomLevelPipe,
  ],
  imports: [
    BrowserModule,
    CytoscapeModule,
    AppRoutingModule,
    ClarityModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
