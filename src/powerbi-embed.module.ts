// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { NgModule } from '@angular/core';
import { PowerBIReportEmbedComponent } from './components/powerbi-report-embed/powerbi-report-embed.component';
import { PowerBIDashboardEmbedComponent } from './components/powerbi-dashboard-embed/powerbi-dashboard-embed.component';
import { PowerBITileEmbedComponent } from './components/powerbi-tile-embed/powerbi-tile-embed.component';
import { PowerBIPaginatedReportEmbedComponent } from './components/powerbi-paginated-report-embed/powerbi-paginated-report-embed.component';
import { PowerBIVisualEmbedComponent } from './components/powerbi-visual-embed/powerbi-visual-embed.component';
import { PowerBIQnaEmbedComponent } from './components/powerbi-qna-embed/powerbi-qna-embed.component';

@NgModule({
  declarations: [
    PowerBIReportEmbedComponent,
    PowerBIDashboardEmbedComponent,
    PowerBITileEmbedComponent,
    PowerBIPaginatedReportEmbedComponent,
    PowerBIVisualEmbedComponent,
    PowerBIQnaEmbedComponent,
  ],
  imports: [],
  exports: [
    PowerBIReportEmbedComponent,
    PowerBIDashboardEmbedComponent,
    PowerBITileEmbedComponent,
    PowerBIPaginatedReportEmbedComponent,
    PowerBIVisualEmbedComponent,
    PowerBIQnaEmbedComponent,
  ],
})
export class PowerBIEmbedModule {}
