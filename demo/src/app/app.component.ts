// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { DashboardEmbedComponent } from './components/dashboard-embed/dashboard-embed.component';
import { PaginatedReportEmbedComponent } from './components/paginated-report-embed/paginated-report-embed.component';
import { QnaEmbedComponent } from './components/qna-embed/qna-embed.component';
import { ReportEmbedComponent } from './components/report-embed/report-embed.component';
import { TileEmbedComponent } from './components/tile-embed/tile-embed.component';
import { VisualEmbedComponent } from './components/visual-embed/visual-embed.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

  constructor(private cfr: ComponentFactoryResolver) {}
  
  changeComponent(event) {
    this.container.clear();
    switch (event.target.value) {
      case 'report':
        this.container.createComponent(this.cfr.resolveComponentFactory(ReportEmbedComponent));
        break;
      case 'dashboard':
        this.container.createComponent(this.cfr.resolveComponentFactory(DashboardEmbedComponent));
        break;
      case 'tile':
        this.container.createComponent(this.cfr.resolveComponentFactory(TileEmbedComponent));
        break;
      case 'visual':
        this.container.createComponent(this.cfr.resolveComponentFactory(VisualEmbedComponent));
        break;
      case 'qna':
        this.container.createComponent(this.cfr.resolveComponentFactory(QnaEmbedComponent));
        break;
      case 'paginated-report':
        this.container.createComponent(this.cfr.resolveComponentFactory(PaginatedReportEmbedComponent));
        break;
      default:
        console.log('Select valid component');
    }
  }
}
