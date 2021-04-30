// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Component } from '@angular/core';
import { IDashboardEmbedConfiguration, models } from 'powerbi-client';
import { HttpService } from 'src/app/services/httpservice.service';
import { ConfigResponse } from 'src/interfaces';
import { dashboardUrl } from '../../constants';

@Component({
  selector: 'dashboard-embed',
  templateUrl: './dashboard-embed.component.html',
  styleUrls: ['./dashboard-embed.component.css'],
})
export class DashboardEmbedComponent {
  // Overall status message of embedding
  displayMessage = 'The dashboard is bootstrapped. Click Embed Dashboard button to set the access token.';

  // CSS Class to be passed to the wrapper
  dashboardClass = 'dashboard-container';

  // Pass the basic embed configurations to the wrapper to bootstrap the dashboard on first load
  // Values for properties like embedUrl and accessToken click of button
  dashboardConfig: IDashboardEmbedConfiguration = {
    type: 'dashboard',
    embedUrl: undefined,
    tokenType: models.TokenType.Embed,
    accessToken: undefined,
  };

  constructor(public httpService: HttpService) {}

  async embedDashboard() {
    let dashboardConfigResponse: ConfigResponse;

    // Get the embed config from the service and set the dashboardConfigResponse
    try {
      dashboardConfigResponse = await this.httpService.getEmbedConfig(dashboardUrl).toPromise();
    } catch (error) {
      console.error(`Failed to fetch config for dashboard. Status: ${error.statusText} Status Code: ${error.status}`);
      return;
    }

    // Update the dashboardConfig to embed the PowerBI dashboard
    this.dashboardConfig = {
      ...this.dashboardConfig,
      id: dashboardConfigResponse.Id,
      embedUrl: dashboardConfigResponse.EmbedUrl,
      accessToken: dashboardConfigResponse.EmbedToken.Token,
    };

    this.displayMessage = 'Access token is successfully set. Loading Power BI dashboard.';
  }
}
