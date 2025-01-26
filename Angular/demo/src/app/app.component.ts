// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Component, ViewChild } from '@angular/core';
import { provideFluentDesignSystem, fluentDialog, fluentButton, fluentTextField } from '@fluentui/web-components';
import { IReportEmbedConfiguration, models, Report, service, Embed } from 'powerbi-client';
import { PowerBIReportEmbedComponent } from 'powerbi-client-angular';
import { IHttpPostMessageResponse } from 'http-post-message';
import 'powerbi-report-authoring';

import { HttpService } from './services/http.service';
import { sampletheme } from './constants/constants';

provideFluentDesignSystem()
  .register(fluentDialog(), fluentButton(), fluentTextField());

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
  @ViewChild(PowerBIReportEmbedComponent) public reportObj!: PowerBIReportEmbedComponent;

  // Track Report embedding status
  public isEmbedded = false;

  // Overall status message of embedding
  public displayMessage = 'The report is bootstrapped. Click the Embed Report button to set the access token.';

  // CSS Class to be passed to the wrapper
  public reportClass = 'report-container';

  // Flag which specify the type of embedding
  public phasedEmbeddingFlag = false;

  // Flag for button toggles
  private isFilterPaneVisible: boolean = true;
  private isThemeApplied: boolean = false;
  private isZoomedOut: boolean = false;
  private isDataSelectedEvent = false;

  // Constants for zoom levels
  private zoomOutLevel = 0.5;
  private zoomInLevel = 0.9;

  // Button text
  public filterPaneBtnText: string = "Hide filter pane";
  public themeBtnText: string = "Set theme";
  public zoomBtnText: string = "Zoom out";
  public dataSelectedBtnText = "Show dataSelected event in dialog";

  // Flag to display the embed config dialog
  public isEmbedConfigDialogVisible = false;

  // Flag to display the data selected event details dialog
  public isEventDetailsDialogVisible = false;
  public dataSelectedEventDetails: any;

  // Pass the basic embed configurations to the wrapper to bootstrap the report on first load
  // Values for properties like embedUrl, accessToken and settings will be set on click of button
  public reportConfig: IReportEmbedConfiguration = {
    type: 'report',
    embedUrl: undefined,
    tokenType: models.TokenType.Aad,
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
  public eventHandlersMap = new Map ([
    ['loaded', () => {
        const report = this.reportObj.getReport();
        report.setComponentTitle('Embedded report');
        console.log('Report has loaded');
      },
    ],
    ['rendered', () => console.log('Report has rendered')],
    ['error', (event?: service.ICustomEvent<any>) => {
        if (event) {
          console.error(event.detail);
        }
      },
    ],
    ['visualClicked', () => console.log('visual clicked')],
    ['pageChanged', (event) => console.log(event)],
  ]) as Map<string, (event?: service.ICustomEvent<any>, embeddedEntity?: Embed) => void | null>;

  constructor(public httpService: HttpService) { }

  /**
    * Show the dailog for Embed Config input
  */
  public openEmbedConfigDialog(): void {
    this.isEmbedConfigDialogVisible = true;
  }

  public hideEmbedConfigDialog(): void {
    this.isEmbedConfigDialogVisible = false;
  }

  public handleEmbedConfigEventReceived(event: { aadToken: string, embedUrl: string }): void {
    this.embedReport(event.aadToken, event.embedUrl);
    this.hideEmbedConfigDialog();
  }

  /**
   * Embeds report
  */
  public embedReport(accessToken: string, embedUrl: string): void {
    // Update the reportConfig to embed the PowerBI report
    this.reportConfig = {
      ...this.reportConfig,
      embedUrl,
      accessToken
    };

    // Update embed status
    this.isEmbedded = true;

    // Update the display message
    this.displayMessage = 'Use the buttons above to interact with the report using Power BI Client APIs.';
  }

  /**
   * Toggle Filter Pane
   *
   * @returns Promise<IHttpPostMessageResponse<void> | undefined>
  */
  public async toggleFilterPane(): Promise<IHttpPostMessageResponse<void> | undefined> {
    // Get report from the wrapper component
    const report: Report = this.reportObj.getReport();

    if (!report) {
      this.displayMessage = 'Report not available.';
      console.log(this.displayMessage);
      return;
    }

    this.isFilterPaneVisible = !this.isFilterPaneVisible;

    // Update the settings to show/hide the filter pane
    const settings = {
      panes: {
        filters: {
          expanded: this.isFilterPaneVisible,
          visible: this.isFilterPaneVisible,
        },
      },
    };

    try {

      const response = await report.updateSettings(settings);

      this.filterPaneBtnText = this.isFilterPaneVisible ? "Hide filter pane" : "Show filter pane";
      this.displayMessage = this.isFilterPaneVisible ? "Filter pane is visible" : "Filter pane is hidden";

      return response;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  /**
   * Set data selected event
  */
  public setDataSelectedEvent(): void {
    const report: Report = this.reportObj.getReport();
    this.isDataSelectedEvent = !this.isDataSelectedEvent;

    if(this.isDataSelectedEvent) {
      // Adding dataSelected event handler to the report
      report.on('dataSelected', (event: service.ICustomEvent<any>) => {
        if (event?.detail.dataPoints.length) {
          this.dataSelectedEventDetailsDialog(event.detail);
        }
      });
    }
    else {
      report.off('dataSelected');
    }

    this.dataSelectedBtnText = this.isDataSelectedEvent ? "Hide dataSelected event in dialog" : "Show dataSelected event in dialog";
    this.displayMessage = this.isDataSelectedEvent ? 'Data Selected event has been successfully set. Click on a data point to see the details.' : 'Data Selected event has been successfully unset.';
  }

  dataSelectedEventDetailsDialog(dataSelectedEventDetails: any): void {
    this.dataSelectedEventDetails = dataSelectedEventDetails;
    this.isEventDetailsDialogVisible = true;
  }

  closeDataSelectedEventDetailsDialog() {
    this.isEventDetailsDialogVisible = false;
  }

  /**
   * Toggle theme
  */
  public async toggleTheme(): Promise<void> {
    const report: Report = this.reportObj.getReport();

    if (!report) {
      this.displayMessage = 'Report not available.';
      console.log(this.displayMessage);
      return;
    }

    // Update the theme by passing in the custom theme.
    // Some theme properties might not be applied if your report has custom colors set.
    try {
      if (this.isThemeApplied) {
        await report.resetTheme();
      } else {
        await report.applyTheme({ themeJson: sampletheme });
      }

      this.isThemeApplied = !this.isThemeApplied;

      this.themeBtnText = this.isThemeApplied ? "Reset theme" : "Set theme";
      this.displayMessage = this.isThemeApplied ? "Theme has been applied" : "Theme has been reset to default";
    }
    catch (error) {
      this.displayMessage = `Failed to apply theme: ${error}`;
      console.log(this.displayMessage);
    }
  }

  /**
   * Toggle zoom
  */
  public async toggleZoom(): Promise<void> {
    const report: Report = this.reportObj.getReport();

    if (!report) {
      this.displayMessage = 'Report not available.';
      console.log(this.displayMessage);
      return;
    }

    try {
      const newZoomLevel = this.isZoomedOut ? this.zoomInLevel : this.zoomOutLevel;
      this.isZoomedOut = !this.isZoomedOut;
      this.zoomBtnText = this.isZoomedOut ? "Zoom in" : "Zoom out";
      await report.setZoom(newZoomLevel);
    }
    catch (errors) {
      console.log(errors);
    }
  }

  /**
   * Refresh report event
  */
  public async refreshReport(): Promise<void> {
    const report: Report = this.reportObj.getReport();

    if (!report) {
      this.displayMessage = 'Report not available.';
      console.log(this.displayMessage);
      return;
    }

    try {
      await report.refresh();
      this.displayMessage = 'The report has been refreshed successfully.';
    }
    catch (errors: any) {
      this.displayMessage = errors.detailedMessage;
      console.log(errors);
    }
  }

  /**
   * Full screen event
  */
  public enableFullScreen(): void {
    const report: Report = this.reportObj.getReport();

    if (!report) {
      this.displayMessage = 'Report not available.';
      console.log(this.displayMessage);
      return;
    }

    report.fullscreen();
  }
}