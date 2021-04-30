// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { stringifyMap } from 'dist/powerbi-embed/utils/utils';
import { Dashboard, Embed, IDashboardEmbedConfiguration, service } from 'powerbi-client';
import { EventHandler, PowerBIEmbedComponent } from '../powerbi-embed/powerbi-embed.component';

/**
 * Dashboard component to embed the dashboard, extends the Base component
 */
@Component({
  selector: 'powerbi-dashboard[embedConfig]',
  template: '<div class={{cssClassName}} #dashboardContainer></div>',
})
export class PowerBIDashboardEmbedComponent extends PowerBIEmbedComponent implements OnInit, OnChanges, AfterViewInit {
  // Input() specify properties that will be passed from parent
  // Configuration for embedding the PowerBI Dashboard (Required)
  @Input() embedConfig!: IDashboardEmbedConfiguration;

  // Ref to the HTML div container element
  @ViewChild('dashboardContainer') private containerRef!: ElementRef<HTMLDivElement>;

  // JSON stringify of prev event handler map
  private prevEventHandlerMapString = '';

  // Embedded entity
  // Note: Do not read or assign to this member variable directly, instead use the getter and setter
  private _embed?: Embed;

  // Getter for this._embed
  private get embed(): Embed | undefined {
    return this._embed;
  }

  // Setter for this._embed
  private set embed(newEmbedInstance: Embed | undefined) {
    this._embed = newEmbedInstance;
  }

  constructor() {
    super();
  }

  ngOnInit(): void {
    // Initialize PowerBI service instance variable from parent
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.embedConfig) {
      const prevEmbedConfig = changes.embedConfig.previousValue as IDashboardEmbedConfiguration;

      // Input from parent get updated, thus call embedOrUpdateDashboard function
      this.embedOrUpdateDashboard(prevEmbedConfig);
    }

    // Set event handlers if available
    if (this.eventHandlers && this.embed) {
      this.setEventHandlers(this.embed, this.eventHandlers);
    }
  }

  ngAfterViewInit(): void {
    // Check if container exists on the UI
    if (this.containerRef.nativeElement) {
      // Decide to embed or bootstrap
      if (this.embedConfig.accessToken && this.embedConfig.embedUrl) {
        this.embedDashboard();
      } else {
        this.embed = this.powerbi.bootstrap(this.containerRef.nativeElement, this.embedConfig);
      }
    }

    // Set event handlers if available
    if (this.eventHandlers && this.embed) {
      this.setEventHandlers(this.embed, this.eventHandlers);
    }
  }

  /**
   * Embed the PowerBI Dashboard
   *
   * @returns void
   */
  private embedDashboard(): void {
    // Check if the HTML container is rendered and available
    if (!this.containerRef.nativeElement) {
      return;
    }

    this.embed = this.powerbi.embed(this.containerRef.nativeElement, this.embedConfig);
  }

  /**
   * When component updates, choose to _embed_ the powerbi dashboard
   * or do nothing if the embedUrl and accessToken did not update in the new properties
   *
   * @param prevEmbedConfig IDashboardEmbedConfiguration
   * @returns void
   */
  private embedOrUpdateDashboard(prevEmbedConfig: IDashboardEmbedConfiguration) {
    // Check if Embed URL and Access Token are present in current properties
    if (!this.embedConfig.accessToken || !this.embedConfig.embedUrl) {
      return;
    }

    // Check if the function is being called for the first time
    // prevEmbedConfig will not be available
    if (!prevEmbedConfig) {
      return;
    }

    // Embed in the following scenario
    // Embed URL is updated (E.g. New dashboard is to be embedded)
    if (this.containerRef.nativeElement && this.embedConfig.embedUrl !== prevEmbedConfig.embedUrl) {
      this.embedDashboard();
    }
  }

  private setEventHandlers(embed: Embed, eventHandlerMap: Map<string, EventHandler | null>): void {
    // Get string representation of eventHandlerMap
    const eventHandlerMapString = stringifyMap(this.eventHandlers);

    // Check if event handler map changed
    if (this.prevEventHandlerMapString === eventHandlerMapString) {
      return;
    }

    // Update prev string representation of event handler map
    this.prevEventHandlerMapString = eventHandlerMapString;

    // List of allowed events
    let allowedEvents = Embed.allowedEvents;

    // Append entity specific events
    allowedEvents = [...allowedEvents, ...Dashboard.allowedEvents];
    console.log(allowedEvents);

    // Holds list of events which are not allowed
    const invalidEvents: Array<string> = [];

    // Apply all provided event handlers
    eventHandlerMap.forEach((eventHandlerMethod, eventName) => {
      // Check if this event is allowed
      if (allowedEvents.includes(eventName)) {
        // Removes event handler for this event
        embed.off(eventName);

        // Event handler is effectively removed for this event when eventHandlerMethod is null
        if (eventHandlerMethod) {
          // Set single event handler
          embed.on(eventName, (event: service.ICustomEvent<any>): void => {
            eventHandlerMethod(event, this.embed);
          });
          console.log(`event set: ${eventName}`);
        }
      } else {
        // Add this event name to the list of invalid events
        invalidEvents.push(eventName);
      }
    });

    // Handle invalid events
    if (invalidEvents.length) {
      console.error(`Following events are invalid: ${invalidEvents.join(',')}`);
    }
  }
}
