// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Component } from '@angular/core';
import { IQnaEmbedConfiguration, models, service } from 'powerbi-client';
import { HttpService } from 'src/app/services/httpservice.service';
import { ConfigResponse } from 'src/interfaces';
import { datasetUrl, qnaUrl } from '../../constants';

@Component({
  selector: 'qna-embed',
  templateUrl: './qna-embed.component.html',
})
export class QnaEmbedComponent {
  // Overall status message of embedding
  displayMessage = 'The Q&A visual is bootstrapped. Click Embed Q&A Visual button to set the access token.';

  // CSS Class to be passed to the wrapper
  qnaClass = 'qna-container';

  // Pass the basic embed configurations to the wrapper to bootstrap the Qna visual on first load
  // Values for properties like embedUrl and accessToken click of button
  qnaConfig: IQnaEmbedConfiguration = {
    type: 'qna',
    datasetIds: [],
    tokenType: models.TokenType.Embed,
  };

  /**
   * Map of event handlers to be applied to the embedded qna
   */
  // Update event handlers for the qna by redefining the map using this.eventHandlersMap
  // Set event handler to null if event needs to be removed
  // More events can be provided from here
  // https://docs.microsoft.com/en-us/javascript/api/overview/powerbi/handle-events#qa-events
  eventHandlersMap = new Map<string, (event?: service.ICustomEvent<any>) => void>([
    ['loaded', () => console.log('Qna has loaded')],
    [
      'visualRendered',
      () => {
        console.log('Qna visual has rendered');

        // Update display message
        this.displayMessage = 'The qna visual is rendered.';
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
  ]);

  constructor(public httpService: HttpService) {}

  /**
   * Embeds Qna visual
   *
   * @returns Promise<void>
   */
  async embedQna(): Promise<void> {
    let qnaConfigResponse: ConfigResponse;
    let datasetConfigResponse: ConfigResponse;

    // Get the embed config from the service and set the qnaConfigResponse
    try {
      qnaConfigResponse = await this.httpService.getEmbedConfig(qnaUrl).toPromise();

      datasetConfigResponse = await this.httpService.getEmbedConfig(datasetUrl).toPromise();
    } catch (error) {
      console.error(`Failed to fetch config for Q&A visual. Status: ${error.statusText} Status Code: ${error.status}`);
      return;
    }

    // To use predefined question
    const question = '2014 total units YTD var % by month, manufacturer as clustered column chart';

    // Update the qnaConfig to embed the PowerBI Qna visual
    this.qnaConfig = {
      ...this.qnaConfig,
      datasetIds: [datasetConfigResponse.Id],
      embedUrl: qnaConfigResponse.EmbedUrl,
      accessToken: qnaConfigResponse.EmbedToken.Token,
      question,
    };

    this.displayMessage = 'Access token is successfully set. Loading Power BI Q&A visual.';
  }
}
