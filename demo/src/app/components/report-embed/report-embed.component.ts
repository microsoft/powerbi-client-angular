/* Copyright (c) Microsoft Corporation.
Licensed under the MIT License. */

import { Component, OnInit } from '@angular/core';
import { IReportEmbedConfiguration, models } from 'powerbi-client';
import { HttpService } from 'src/app/services/httpservice.service';
import { ConfigResponse } from 'src/interfaces';

@Component({
  selector: 'report-embed',
  templateUrl: './report-embed.component.html',
  styleUrls: ['./report-embed.component.css']
})
export class ReportEmbedComponent implements OnInit {

  // Overall status message of embedding
  displayMessage = 'The report is bootstrapped. Click the Embed Report button to set the access token.';

  // CSS Class to be passed to the library
  reportClass = 'report-style-class';

  // Flag which specify the type of embedding
  phasedEmbeddingFlag = false;

  // Pass the basic embed configurations to the library to bootstrap the report on first load
  // Values for properties like embedUrl, accessToken and settings will be set on click of button
  reportConfig: IReportEmbedConfiguration = {
    type: 'report',
    embedUrl: undefined,
    tokenType: models.TokenType.Embed,
    accessToken: undefined,
    settings: undefined,
  };

  constructor(public httpService: HttpService) { }

  ngOnInit(): void {
  }

  async embedReport() {

    // API Endpoint to get the report embed config
    const reportUrl = 'https://aka.ms/CaptureViewsReportEmbedConfig';
    let reportConfigResponse: ConfigResponse;

    // Get the embed config from the service and set the reportConfigResponse
    try {
      reportConfigResponse = await this.httpService.getEmbedConfig(reportUrl).toPromise();
    }
    catch (error) {
      console.error(`Failed to fetch config for report. Status: ${error.statusText} Status Code: ${error.status}`);
      return;
    }

    // Updation of reportConfig will embed the PowerBI report
    this.reportConfig = {
      ...this.reportConfig,
      id: reportConfigResponse.Id,
      embedUrl: reportConfigResponse.EmbedUrl,
      accessToken: reportConfigResponse.EmbedToken.Token
    };

    // Update the display message
    this.displayMessage = 'The access token is successfully set. Loading the Power BI report.';
  }

}
