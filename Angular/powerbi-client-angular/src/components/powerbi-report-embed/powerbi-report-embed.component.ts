// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Embed, IReportEmbedConfiguration, Report } from 'powerbi-client';
import { EventHandler, PowerBIEmbedComponent } from '../powerbi-embed/powerbi-embed.component';
import { isEmbedSetupValid } from '../../utils/utils';

/**
 * Report component to embed the report, extends the Base Component
 */
@Component({
  selector: 'powerbi-report[embedConfig]',
  template: '<div class={{cssClassName}} #reportContainer></div>',
})
export class PowerBIReportEmbedComponent extends PowerBIEmbedComponent implements OnInit, OnChanges, AfterViewInit {
  // Input() specify properties that will be passed from parent
  // Configuration for embedding the PowerBI Report (Required)
  @Input() embedConfig!: IReportEmbedConfiguration;

  // Phased embedding flag (Optional)
  @Input() phasedEmbedding?: boolean = false;

  // Map of event name and handler methods pairs to be triggered on the event (Optional)
  @Input() eventHandlers?: Map<string, EventHandler | null>;

  // Ref to the HTML div container element
  @ViewChild('reportContainer') private containerRef!: ElementRef<HTMLDivElement>;

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
  getReport(): Report {
    return this._embed as Report;
  }

  ngOnInit(): void {
    // Initialize PowerBI service instance variable from parent
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.embedConfig) {
      // Check if the function is being called for the first time
      if (changes.embedConfig.isFirstChange()) {
        return;
      }

      const prevEmbedConfig: IReportEmbedConfiguration = changes.embedConfig.previousValue;
      const currentEmbedConfig: IReportEmbedConfiguration = changes.embedConfig.currentValue;
      if (JSON.stringify(prevEmbedConfig) !== JSON.stringify(currentEmbedConfig)) {
        // Input from parent get updated, thus call embed function to re-embed the report
        this.embedReport();
      }
    }

    // Set event handlers if available
    if (this.eventHandlers && this.embed) {
      super.setEventHandlers(this.embed, this.eventHandlers);
    }
  }

  ngAfterViewInit(): void {
    // Check if container exists on the UI
    if (this.containerRef.nativeElement) {
      // Decide to embed, load or bootstrap
      if (this.embedConfig.accessToken && this.embedConfig.embedUrl) {
        this.embedReport();
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
   * Embed or load the PowerBI Report based on phasedEmbedding flag
   *
   * @returns void
   */
  private embedReport(): void {
    if (!isEmbedSetupValid(this.containerRef, this.embedConfig)) {
      return;
    }

    // Load when phasedEmbedding flag is true, embed otherwise
    if (this.phasedEmbedding) {
      this.embed = this.powerbi.load(this.containerRef.nativeElement, this.embedConfig);
    } else {
      this.embed = this.powerbi.embed(this.containerRef.nativeElement, this.embedConfig);
    }
  }
}
