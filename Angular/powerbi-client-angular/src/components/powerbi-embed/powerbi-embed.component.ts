// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Component, Input, OnInit } from '@angular/core';
import { Embed, factories, service } from 'powerbi-client';
import { stringifyMap, sdkType, sdkWrapperVersion } from '../../utils/utils';

/**
 * Type for event handler function of embedded entity
 */
export type EventHandler = (event?: service.ICustomEvent<any>, embeddedEntity?: Embed) => void | null;

/**
 * Base component to hold common properties for all the Power BI entities
 */
@Component({
  selector: 'powerbi-embed',
  template: '',
})
export class PowerBIEmbedComponent implements OnInit {
  // Input() specify the properties that will be passed from the parent
  // CSS class to be set on the embedding container (Optional)
  @Input() cssClassName?: string;

  // Provide a custom implementation of Power BI service (Optional)
  @Input() service?: service.Service;

  // Power BI service
  powerbi!: service.Service;

  // JSON stringify of prev event handler map
  private prevEventHandlerMapString = '';

  ngOnInit(): void {
    // Initialize powerbi variable for child component
    if (this.service) {
      this.powerbi = this.service;
    } else {
      this.powerbi = new service.Service(factories.hpmFactory, factories.wpmpFactory, factories.routerFactory);
    }

    this.powerbi.setSdkInfo(sdkType, sdkWrapperVersion);
  }

  /**
   * Sets all event handlers from the input on the embedded entity
   *
   * @param embed Embedded object
   * @param eventHandlerMap Array of event handlers to be set on embedded entity
   * @returns void
   */
  protected setEventHandlers(embed: Embed, eventHandlerMap: Map<string, EventHandler | null>): void {
    // Get string representation of eventHandlerMap
    const eventHandlerMapString = stringifyMap(eventHandlerMap);

    // Check if event handler map changed
    if (this.prevEventHandlerMapString === eventHandlerMapString) {
      return;
    }

    // Update prev string representation of event handler map
    this.prevEventHandlerMapString = eventHandlerMapString;

    // Apply all provided event handlers
    eventHandlerMap.forEach((eventHandlerMethod, eventName) => {
      // Removes event handler for this event
      embed.off(eventName);

      // Event handler is effectively removed for this event when eventHandlerMethod is null
      if (eventHandlerMethod) {
        // Set single event handler
        embed.on(eventName, (event: service.ICustomEvent<any>): void => {
          eventHandlerMethod(event, embed);
        });
      }
    });
  }
}
