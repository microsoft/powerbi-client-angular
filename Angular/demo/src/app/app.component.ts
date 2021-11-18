// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Component, ElementRef, ViewChild } from '@angular/core';
import { IHttpPostMessageResponse } from 'http-post-message';
import { IReportEmbedConfiguration, models, Page, Report, service, VisualDescriptor } from 'powerbi-client';
import { PowerBIReportEmbedComponent } from 'powerbi-client-angular';
import 'powerbi-report-authoring';
import { errorClass, errorElement, hidden, position, reportUrl, successClass, successElement } from '../constants';
import { HttpService } from './services/http.service';

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
  @ViewChild(PowerBIReportEmbedComponent) reportObj!: PowerBIReportEmbedComponent;

  // Div object to show status of the demo app
  @ViewChild('status') private statusRef!: ElementRef<HTMLDivElement>;

  // Embed Report button element of the demo app
  @ViewChild('embedReportBtn') private embedBtnRef!: ElementRef<HTMLButtonElement>;

  // Track Report embedding status
  isEmbedded = false;

  // Overall status message of embedding
  displayMessage = 'The report is bootstrapped. Click Embed Report button to set the access token.';

  // CSS Class to be passed to the wrapper
  // Hide the report container initially
  reportClass = 'report-container hidden';

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

        // Set displayMessage to empty when rendered for the first time
        if (!this.isEmbedded) {
          this.displayMessage = 'Use the buttons above to interact with the report using Power BI Client APIs.';
        }

        // Update embed status
        this.isEmbedded = true;
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

  constructor(public httpService: HttpService, private element: ElementRef<HTMLDivElement>) {}

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
    } catch (error: any) {
      // Prepare status message for Embed failure
      await this.prepareDisplayMessageForEmbed(errorElement, errorClass);
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

    // Get the reference of the report-container div
    const reportDiv = this.element.nativeElement.querySelector('.report-container');
    if (reportDiv) {
      // When Embed report is clicked, show the report container div
      reportDiv.classList.remove(hidden);
    }

    // Get the reference of the display-message div
    const displayMessage = this.element.nativeElement.querySelector('.display-message');
    if (displayMessage) {
      // When Embed report is clicked, change the position of the display-message
      displayMessage.classList.remove(position);
    }

    // Prepare status message for Embed success
    await this.prepareDisplayMessageForEmbed(successElement, successClass);

    // Update the display message
    this.displayMessage = 'Access token is successfully set. Loading Power BI report.';
  }

  /**
   * Handle Report embedding flow
   * @param img Image to show with the display message
   * @param type Type of the message
   *
   * @returns Promise<void>
   */
  async prepareDisplayMessageForEmbed(img: HTMLImageElement, type: string): Promise<void> {
    // Remove the Embed Report button from UI
    this.embedBtnRef.nativeElement.remove();

    // Prepend the Image element to the display message
    this.statusRef.nativeElement.prepend(img);

    // Set type of the message
    this.statusRef.nativeElement.classList.add(type);
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
      // Prepare status message for Error
      this.prepareStatusMessage(errorElement, errorClass);
      this.displayMessage = 'Report not available.';
      console.log(this.displayMessage);
      return;
    }

    // Get all the pages of the report
    const pages: Page[] = await report.getPages();

    // Check if all the pages of the report deleted
    if (pages.length === 0) {
      // Prepare status message for Error
      this.prepareStatusMessage(errorElement, errorClass);
      this.displayMessage = 'No pages found.';
      console.log(this.displayMessage);
      return;
    }

    // Get active page of the report
    const activePage: Page | undefined = pages.find((page) => page.isActive);

    if (activePage) {
      // Get all visuals in the active page of the report
      const visuals: VisualDescriptor[] = await activePage.getVisuals();

      if (visuals.length === 0) {
        // Prepare status message for Error
        this.prepareStatusMessage(errorElement, errorClass);
        this.displayMessage = 'No visuals found.';
        console.log(this.displayMessage);
        return;
      }

      // Get first visible visual
      const visual: VisualDescriptor | undefined = visuals.find((v) => v.layout.displayState?.mode === models.VisualContainerDisplayMode.Visible);

      // No visible visual found
      if (!visual) {
        // Prepare status message for Error
        this.prepareStatusMessage(errorElement, errorClass);
        this.displayMessage = 'No visible visual available to delete.';
        console.log(this.displayMessage);
        return;
      }

      try {
        // Delete the visual using powerbi-report-authoring
        // For more information: https://docs.microsoft.com/en-us/javascript/api/overview/powerbi/report-authoring-overview
        const response = await activePage.deleteVisual(visual.name);

        // Prepare status message for success
        this.prepareStatusMessage(successElement, successClass);
        this.displayMessage = `${visual.type} visual was deleted.`;
        console.log(this.displayMessage);

        return response;
      } catch (error) {
        console.error(error);
      }
    }
  }

  /**
   * Hide Filter Pane
   *
   * @returns Promise<IHttpPostMessageResponse<void> | undefined>
   */
  async hideFilterPane(): Promise<IHttpPostMessageResponse<void> | undefined> {
    // Get report from the wrapper component
    const report: Report = this.reportObj.getReport();

    if (!report) {
      // Prepare status message for Error
      this.prepareStatusMessage(errorElement, errorClass);
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

      // Prepare status message for success
      this.prepareStatusMessage(successElement, successClass);
      this.displayMessage = 'Filter pane is hidden.';
      console.log(this.displayMessage);

      return response;
    } catch (error) {
      console.error(error);
      return;
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

    // Prepare status message for success
    this.prepareStatusMessage(successElement, successClass);
    this.displayMessage = 'Data Selected event set successfully. Select data to see event in console.';
  }

  /**
   * Prepare status message while using JS SDK APIs
   * @param img Image to show with the display message
   * @param type Type of the message
   *
   * @returns void
   */
  prepareStatusMessage(img: HTMLImageElement, type: string) {
    // Prepend Image to the display message
    this.statusRef.nativeElement.prepend(img);

    // Add class to the display message
    this.statusRef.nativeElement.classList.add(type);
  }
}
