// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { NgModule } from '@angular/core';
import { PowerBIReportEmbedComponent } from './components/powerbi-report-embed/powerbi-report-embed.component';
import { PowerBIDashboardEmbedComponent } from './components/powerbi-dashboard-embed/powerbi-dashboard-embed.component';

@NgModule({
  declarations: [PowerBIReportEmbedComponent, PowerBIDashboardEmbedComponent],
  imports: [
  ],
  exports: [PowerBIReportEmbedComponent]
})
export class PowerBIEmbedModule { }
