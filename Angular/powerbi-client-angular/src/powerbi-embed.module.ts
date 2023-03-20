// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { NgModule } from '@angular/core';
import { PowerBIEmbedComponent } from './components/powerbi-embed/powerbi-embed.component';
import { PowerBIDashboardEmbedComponent } from './components/powerbi-dashboard-embed/powerbi-dashboard-embed.component';
import { PowerBIPaginatedReportEmbedComponent } from './components/powerbi-paginated-report-embed/powerbi-paginated-report-embed.component';
import { PowerBIQnaEmbedComponent } from './components/powerbi-qna-embed/powerbi-qna-embed.component';
import { PowerBIReportEmbedComponent } from './components/powerbi-report-embed/powerbi-report-embed.component';
import { PowerBITileEmbedComponent } from './components/powerbi-tile-embed/powerbi-tile-embed.component';
import { PowerBIVisualEmbedComponent } from './components/powerbi-visual-embed/powerbi-visual-embed.component';
import { PowerBICreateReportEmbedComponent } from './components/powerbi-create-report/powerbi-create-report.component';

@NgModule({
  declarations: [
    PowerBIEmbedComponent,
    PowerBIDashboardEmbedComponent,
    PowerBIPaginatedReportEmbedComponent,
    PowerBIQnaEmbedComponent,
    PowerBIReportEmbedComponent,
    PowerBITileEmbedComponent,
    PowerBIVisualEmbedComponent,
    PowerBICreateReportEmbedComponent
  ],
  imports: [],
  exports: [
    PowerBIDashboardEmbedComponent,
    PowerBIPaginatedReportEmbedComponent,
    PowerBIQnaEmbedComponent,
    PowerBIReportEmbedComponent,
    PowerBITileEmbedComponent,
    PowerBIVisualEmbedComponent,
    PowerBICreateReportEmbedComponent
  ],
})
export class PowerBIEmbedModule {}
