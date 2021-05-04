// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Embed, ITileEmbedConfiguration, service, Tile } from 'powerbi-client';
import { stringifyMap } from '../../utils/utils';
import { EventHandler, PowerBIEmbedComponent } from '../powerbi-embed/powerbi-embed.component';

/**
 * Tile component to embed the tile, extends Base component
 */
@Component({
  selector: 'powerbi-tile[embedConfig]',
  template: '<div class={{cssClassName}} #tileContainer></div>',
})
export class PowerBITileEmbedComponent extends PowerBIEmbedComponent implements OnInit, OnChanges, AfterViewInit {
  // Input() specify properties that will be passed from parent
  // Configuration for embedding the PowerBI Tile (Required)
  @Input() embedConfig!: ITileEmbedConfiguration;

  // Ref to the HTML div container element
  @ViewChild('tileContainer') private containerRef!: ElementRef<HTMLDivElement>;

  // Embedded entity
  // Note: Do not read or assign to this member variable directly, instead use the getter and setter
  private _embed?: Embed;

  // JSON stringify of prev event handler map
  private prevEventHandlerMapString = '';

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

  // Public method to return embed object to calling function
  public getTile(): Tile {
    return this._embed as Tile;
  }

  ngOnInit(): void {
    // Initialize PowerBI service instance variable from parent
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.embedConfig) {
      const prevEmbedConfig = changes.embedConfig.previousValue as ITileEmbedConfiguration;

      // Input from parent get updated, thus call embedOrUpdateTile function
      this.embedOrUpdateTile(prevEmbedConfig);
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
        this.embedTile();
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
   * Embed the PowerBI Tile
   *
   * @returns void
   */
  private embedTile(): void {
    // Check if the HTML container is rendered and available
    if (!this.containerRef.nativeElement) {
      return;
    }

    this.embed = this.powerbi.embed(this.containerRef.nativeElement, this.embedConfig);
  }

  /**
   * When component updates, choose to _embed_ the powerbi tile
   * or do nothing if the embedUrl and accessToken did not update in the new properties
   *
   * @param prevEmbedConfig ITileEmbedConfiguration
   * @returns void
   */
  private embedOrUpdateTile(prevEmbedConfig: ITileEmbedConfiguration): void {
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
    // Embed URL is updated (E.g. New tile is to be embedded)
    if (this.containerRef.nativeElement && this.embedConfig.embedUrl !== prevEmbedConfig.embedUrl) {
      this.embedTile();
    }
  }

  /**
   * Sets all event handlers from the input on the embedded entity
   *
   * @param embed Embedded object
   * @param eventHandlerMap Array of event handlers to be set on embedded entity
   * @returns void
   */
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
    allowedEvents = [...allowedEvents, ...Tile.allowedEvents];
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
