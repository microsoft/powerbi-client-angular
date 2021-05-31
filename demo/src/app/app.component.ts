// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Component, ViewChild } from '@angular/core';
import { IHttpPostMessageResponse } from 'http-post-message';
import { IReportEmbedConfiguration, models, Page, Report, service, VisualDescriptor } from 'powerbi-client';
import { PowerBIReportEmbedComponent } from 'powerbi-embed';
import 'powerbi-report-authoring';
import { HttpService } from 'src/app/services/http.service';
import { reportUrl } from './constants';

// Handles the embed config response for embedding
export interface ConfigResponse {
  Id: string;
  EmbedUrl: string;
  EmbedToken: {
    Token: string;
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  // Wrapper object to access report properties
  @ViewChild(PowerBIReportEmbedComponent) reportObj: PowerBIReportEmbedComponent;

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
   * Map of event handlers to be applied to the embedded report
   */
  // Update event handlers for the report by redefining the map using this.eventHandlersMap
  // Set event handler to null if event needs to be removed
  // More events can be provided from here
  // https://docs.microsoft.com/en-us/javascript/api/overview/powerbi/handle-events#report-events
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
   * Embeds report
   *
   * @returns Promise<void>
   */
  async embedReport(): Promise<void> {
    let reportConfigResponse: ConfigResponse;

    // Get the embed config from the service and set the reportConfigResponse
    try {
      reportConfigResponse = await this.httpService.getEmbedConfig(reportUrl).toPromise();
    } catch (error) {
      this.displayMessage = `Failed to fetch config for report. Status: ${error.statusText} Status Code: ${error.status}`;
      console.error(this.displayMessage);
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

  /**
   * Delete visual
   *
   * @returns Promise<void>
   */
  async deleteVisual(): Promise<void> {
    // Get report from the wrapper component
    const report: Report = this.reportObj.getReport();

    if (!report) {
      this.displayMessage = 'Report not available.';
      console.log(this.displayMessage);
      return;
    }

    // Get all the pages of the report
    const pages: Page[] = await report.getPages();

    // Check if all the pages of the report deleted
    if (pages.length === 0) {
      this.displayMessage = 'No pages found.';
      console.log(this.displayMessage);
      return;
    }

    // Get active page of the report
    const activePage: Page = pages.find((page) => page.isActive);

    // Get all visuals in the active page of the report
    const visuals: VisualDescriptor[] = await activePage.getVisuals();

    if (visuals.length === 0) {
      this.displayMessage = 'No visuals found.';
      console.log(this.displayMessage);
      return;
    }

    // Get first visible visual
    const visual: VisualDescriptor = visuals.find((v) => v.layout.displayState?.mode === models.VisualContainerDisplayMode.Visible);

    // No visible visual found
    if (!visual) {
      this.displayMessage = 'No visible visual available to delete.';
      console.log(this.displayMessage);
      return;
    }

    try {
      // Delete the visual using powerbi-report-authoring
      // For more information: https://docs.microsoft.com/en-us/javascript/api/overview/powerbi/report-authoring-overview
      const response = await activePage.deleteVisual(visual.name);

      this.displayMessage = `${visual.type} visual was deleted.`;
      console.log(this.displayMessage);

      return response;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Hide Filter Pane
   *
   * @returns Promise<void>
   */
  async hideFilterPane(): Promise<IHttpPostMessageResponse<void>> {
    // Get report from the wrapper component
    const report: Report = this.reportObj.getReport();

    if (!report) {
      this.displayMessage = 'Report not available.';
      console.log(this.displayMessage);
      return;
    }

    // New settings to hide filter pane
    const settings = {
      panes: {
        filters: {
          expanded: false,
          visible: false,
        },
      },
    };

    try {
      const response = await report.updateSettings(settings);

      this.displayMessage = 'Filter pane is hidden.';
      console.log(this.displayMessage);

      return response;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Set data selected event
   *
   * @returns void
   */
  setDataSelectedEvent(): void {
    // Adding dataSelected event in eventHandlersMap
    this.eventHandlersMap = new Map<string, (event?: service.ICustomEvent<any>) => void>([
      ...this.eventHandlersMap,
      ['dataSelected', (event) => console.log(event)],
    ]);

    this.displayMessage = 'Data Selected event set successfully. Select data to see event in console.';
  }
}
