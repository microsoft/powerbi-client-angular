// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Component } from '@angular/core';
import { IQnaEmbedConfiguration, models } from 'powerbi-client';
import { HttpService } from 'src/app/services/httpservice.service';
import { ConfigResponse } from 'src/interfaces';
import { datasetUrl, qnaUrl } from '../../constants';

@Component({
  selector: 'qna-embed',
  templateUrl: './qna-embed.component.html',
  styleUrls: ['./qna-embed.component.css'],
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

  constructor(public httpService: HttpService) {}

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
