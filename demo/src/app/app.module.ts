// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PowerBIEmbedModule } from 'powerbi-embed';
import { AppComponent } from './app.component';
import { DashboardEmbedComponent } from './components/dashboard-embed/dashboard-embed.component';
import { PaginatedReportEmbedComponent } from './components/paginated-report-embed/paginated-report-embed.component';
import { QnaEmbedComponent } from './components/qna-embed/qna-embed.component';
import { ReportEmbedComponent } from './components/report-embed/report-embed.component';
import { TileEmbedComponent } from './components/tile-embed/tile-embed.component';
import { VisualEmbedComponent } from './components/visual-embed/visual-embed.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardEmbedComponent,
    ReportEmbedComponent,
    TileEmbedComponent,
    PaginatedReportEmbedComponent,
    VisualEmbedComponent,
    QnaEmbedComponent,
  ],
  imports: [BrowserModule, HttpClientModule, PowerBIEmbedModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
