// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Component, OnInit } from '@angular/core';
import { IEmbedConfiguration, models } from 'powerbi-client';
import { HttpService } from 'src/app/services/httpservice.service';
import { ConfigResponse } from 'src/interfaces';
import { paginatedReportUrl } from '../../constants';

@Component({
  selector: 'paginated-report-embed',
  templateUrl: './paginated-report-embed.component.html',
  styleUrls: ['./paginated-report-embed.component.css'],
})
export class PaginatedReportEmbedComponent implements OnInit {
  // Overall status message of embedding
  displayMessage = '';

  // CSS Class to be applied to the container
  paginatedReportClass = 'paginated-report-container';

  // Initialize the config object
  // Paginated report does not support bootstrapping
  paginatedReportConfig: IEmbedConfiguration = {};

  constructor(public httpService: HttpService) {}

  async ngOnInit() {
    await this.embedPaginatedReport();
  }

  async embedPaginatedReport() {
    let paginatedReportConfigResponse: ConfigResponse;

    // Get the embed config from the service and set the paginatedReportConfigResponse
    try {
      paginatedReportConfigResponse = await this.httpService.getEmbedConfig(paginatedReportUrl).toPromise();
    } catch (error) {
      console.error(
        `Failed to fetch config for paginated report. Status: ${error.statusText} Status Code: ${error.status}`
      );
      return;
    }

    // Update the paginatedReportConfig to embed the PowerBI paginated report
    this.paginatedReportConfig = {
      type: 'report',
      tokenType: models.TokenType.Embed,
      id: paginatedReportConfigResponse.Id,
      embedUrl: paginatedReportConfigResponse.EmbedUrl,
      accessToken: paginatedReportConfigResponse.EmbedToken.Token,
    };

    this.displayMessage = 'Access token is successfully set. Loading Power BI paginated report.';
  }
}
