// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { NgModule } from '@angular/core';
import { PowerBIReportEmbedComponent } from './components/powerbi-report-embed/powerbi-report-embed.component';
import { PowerBIDashboardEmbedComponent } from './components/powerbi-dashboard-embed/powerbi-dashboard-embed.component';
import { PowerBITileEmbedComponent } from './components/powerbi-tile-embed/powerbi-tile-embed.component';
import { PowerBIVisualEmbedComponent } from './components/powerbi-visual-embed/powerbi-visual-embed.component';
import { PowerBIQnaEmbedComponent } from './components/powerbi-qna-embed/powerbi-qna-embed.component';

@NgModule({
  declarations: [
    PowerBIReportEmbedComponent,
    PowerBIDashboardEmbedComponent,
    PowerBITileEmbedComponent,
    PowerBIVisualEmbedComponent,
    PowerBIQnaEmbedComponent,
  ],
  imports: [],
  exports: [
    PowerBIReportEmbedComponent,
    PowerBIDashboardEmbedComponent,
    PowerBITileEmbedComponent,
    PowerBIVisualEmbedComponent,
    PowerBIQnaEmbedComponent
  ],
})
export class PowerBIEmbedModule { }
