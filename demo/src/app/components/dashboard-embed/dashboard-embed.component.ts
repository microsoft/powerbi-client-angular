/* Copyright (c) Microsoft Corporation.
Licensed under the MIT License. */

import { Component, OnInit } from '@angular/core';
import { IDashboardEmbedConfiguration, models } from 'powerbi-client';
import { HttpService } from 'src/app/services/httpservice.service';
import { ConfigResponse } from 'src/interfaces';

@Component({
  selector: 'dashboard-embed',
  templateUrl: './dashboard-embed.component.html',
  styleUrls: ['./dashboard-embed.component.css']
})
export class DashboardEmbedComponent implements OnInit {

  // Overall status message of embedding
  displayMessage = 'The dashboard is bootstrapped. Click the Embed Dashboard button to set the access token';

  // CSS Class to be passed to the library
  dashboardClass = 'dashboard-style-class';

  // Pass the basic embed configurations to the library to bootstrap the dashboard on first load
  // Values for properties like embedUrl and accessToken click of button
  dashboardConfig: IDashboardEmbedConfiguration = {
    type: 'dashboard',
    embedUrl: undefined,
    tokenType: models.TokenType.Embed,
    accessToken: undefined
  }

  constructor(public httpService: HttpService) { }

  ngOnInit(): void {
  }

  async embedDashboard() {
    
    // API Endpoint to get the dashboard embed config
    const dashboardUrl = 'https://playgroundbe-bck-1.azurewebsites.net/Dashboards/SampleDashboard';
    
    let dashboardConfigResponse: ConfigResponse;

    // Get the embed config from the service and set the dashboardConfigResponse
    try {
      dashboardConfigResponse = await this.httpService.getEmbedConfig(dashboardUrl).toPromise();
    }
    catch (error) {
      console.error(`Failed to fetch config for dashboard. Status: ${error.statusText} Status Code: ${error.status}`);
      return;
    }

    // Updation of dashboardConfig will embed the PowerBI dashboard
    this.dashboardConfig = {
      ...this.dashboardConfig,
      id: dashboardConfigResponse.Id,
      embedUrl: dashboardConfigResponse.EmbedUrl,
      accessToken: dashboardConfigResponse.EmbedToken.Token
    }
    this.displayMessage = 'The access token is successfully set. Loading the Power BI dashboard';
  }
}
