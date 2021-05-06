// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Embed, IVisualEmbedConfiguration, Visual } from 'powerbi-client';
import { EventHandler, PowerBIEmbedComponent } from '../powerbi-embed/powerbi-embed.component';

/**
 * Visual component to embed the visual, extends Base component
 */
@Component({
  selector: 'powerbi-visual[embedConfig]',
  template: '<div class={{cssClassName}} #visualContainer></div>',
})
export class PowerBIVisualEmbedComponent extends PowerBIEmbedComponent implements OnInit, OnChanges, AfterViewInit {
  // Input() specify properties that will be passed from parent
  // Configuration for embedding the PowerBI Visual (Required)
  @Input() embedConfig!: IVisualEmbedConfiguration;

  // Map of event name and handler methods pairs to be triggered on the event (Optional)
  @Input() eventHandlers?: Map<string, EventHandler | null>;

  // Ref to the HTML div container element
  @ViewChild('visualContainer') private containerRef!: ElementRef<HTMLDivElement>;

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

  // Returns embed object to calling function
  getVisual(): Visual {
    return this._embed as Visual;
  }

  ngOnInit(): void {
    // Initialize PowerBI service instance variable from parent
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.embedConfig) {
      const prevEmbedConfig = changes.embedConfig.previousValue as IVisualEmbedConfiguration;

      // Check if the function is being called for the first time
      if (!prevEmbedConfig) {
        return;
      }

      // Input from parent get updated, thus call embedOrUpdateDashboard function
      this.embedOrUpdateVisual(prevEmbedConfig);
    }

    // Set event handlers if available
    if (this.eventHandlers && this.embed) {
      super.setEventHandlers(this.embed, this.eventHandlers);
    }
  }

  ngAfterViewInit(): void {
    // Check if container exists on the UI
    if (this.containerRef.nativeElement) {
      // Decide to embed or bootstrap
      if (this.embedConfig.accessToken && this.embedConfig.embedUrl) {
        this.embedVisual();
      } else {
        this.embed = this.powerbi.bootstrap(this.containerRef.nativeElement, this.embedConfig);
      }
    }

    // Set event handlers if available
    if (this.eventHandlers && this.embed) {
      super.setEventHandlers(this.embed, this.eventHandlers);
    }
  }

  /**
   * Embed the PowerBI Visual
   *
   * @returns void
   */
  private embedVisual(): void {
    // Check if the HTML container is rendered and available
    if (!this.containerRef.nativeElement) {
      return;
    }

    this.embed = this.powerbi.embed(this.containerRef.nativeElement, this.embedConfig);
  }

  /**
   * When component updates, choose to _embed_ the powerbi visual
   * or do nothing if the embedUrl and accessToken did not update in the new properties
   *
   * @param prevEmbedConfig IVisualEmbedConfiguration
   * @returns void
   */
  private embedOrUpdateVisual(prevEmbedConfig: IVisualEmbedConfiguration): void {
    // Check if Embed URL and Access Token are present in current properties
    if (!this.embedConfig.accessToken || !this.embedConfig.embedUrl) {
      return;
    }

    // Embed in the following scenario
    // Embed URL is updated (E.g. New visual is to be embedded)
    if (this.containerRef.nativeElement && this.embedConfig.embedUrl !== prevEmbedConfig.embedUrl) {
      this.embedVisual();
    }
  }
}
