// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Component } from '@angular/core';
import { IReportEmbedConfiguration, models, service } from 'powerbi-client';
import { HttpService } from 'src/app/services/httpservice.service';
import { ConfigResponse } from 'src/interfaces';
import { reportUrl } from '../../constants';

@Component({
  selector: 'report-embed',
  templateUrl: './report-embed.component.html',
})
export class ReportEmbedComponent {
  // Overall status message of embedding
  displayMessage = 'The report is bootstrapped. Click Embed Report button to set the access token.';

  // CSS Class to be passed to the wrapper
  reportClass = 'report-container';

  // Flag which specify the type of embedding
  phasedEmbeddingFlag = false;

  // Pass the basic embed configurations to the wrapper to bootstrap the report on first load
  // Values for properties like embedUrl, accessToken and settings will be set on click of button
  reportConfig: IReportEmbedConfiguration = {
    type: 'report',
    embedUrl: undefined,
    tokenType: models.TokenType.Embed,
    accessToken: undefined,
    settings: undefined,
  };

  /**
   * Map of event handlers to be applied to the embedding report
   */
  // Update event handlers for the report by redefining the map using this.eventHandlersMap
  // Set event handler to null if event needs to be removed
  // More events can be provided from here
  // https://github.com/microsoft/PowerBI-JavaScript/blob/master/src/report.ts#L55
  eventHandlersMap = new Map<string, (event?: service.ICustomEvent<any>) => void>([
    ['loaded', () => console.log('Report has loaded')],
    [
      'rendered',
      () => {
        console.log('Report has rendered');

        // Update display message
        this.displayMessage = 'The report is rendered.';
      },
    ],
    [
      'error',
      (event?: service.ICustomEvent<any>) => {
        if (event) {
          console.error(event.detail);
        }
      },
    ],
    ['visualClicked', () => console.log('visual clicked')],
    ['pageChanged', (event) => console.log(event)],
  ]);

  constructor(public httpService: HttpService) {}

  /**
   * Embeds report from HTTP endpoint
   *
   * @returns Promise<void>
   */
  async embedReport(): Promise<void> {
    let reportConfigResponse: ConfigResponse;

    // Get the embed config from the service and set the reportConfigResponse
    try {
      reportConfigResponse = await this.httpService.getEmbedConfig(reportUrl).toPromise();
    } catch (error) {
      console.error(`Failed to fetch config for report. Status: ${error.statusText} Status Code: ${error.status}`);
      return;
    }

    // Update the reportConfig to embed the PowerBI report
    this.reportConfig = {
      ...this.reportConfig,
      id: reportConfigResponse.Id,
      embedUrl: reportConfigResponse.EmbedUrl,
      accessToken: reportConfigResponse.EmbedToken.Token,
    };

    // Update the display message
    this.displayMessage = 'Access token is successfully set. Loading Power BI report.';
  }
}
