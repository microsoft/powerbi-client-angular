// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Embed, Create } from 'powerbi-client';
import { IReportCreateConfiguration } from 'powerbi-models';

import { EventHandler, PowerBIEmbedComponent } from '../powerbi-embed/powerbi-embed.component';
import { isEmbedSetupValid } from '../../utils/utils';

/**
 * Create report component to embed the entity, extends the Base component
 */
@Component({
  selector: 'powerbi-create-report[embedConfig]',
  template: '<div class={{cssClassName}} #createReportContainer></div>',
})
export class PowerBICreateReportEmbedComponent extends PowerBIEmbedComponent implements OnInit, OnChanges, AfterViewInit {
  // Configuration for embedding the PowerBI Create report (Required)
  @Input() embedConfig!: IReportCreateConfiguration;

  // Map of event name and handler methods pairs to be triggered on the event (Optional)
  @Input() eventHandlers?: Map<string, EventHandler | null>;

  // Ref to the HTML div container element
  @ViewChild('createReportContainer') private containerRef!: ElementRef<HTMLDivElement>;

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
  public getCreateObject(): Create {
    return this._embed as Create;
  }

  public ngOnInit(): void {
    // Initialize PowerBI service instance variable from parent
    super.ngOnInit();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.embedConfig) {
      // Check if the function is being called for the first time
      if (changes.embedConfig.isFirstChange()) {
        return;
      }

      const prevEmbedConfig: IReportCreateConfiguration = changes.embedConfig.previousValue;
      const currentEmbedConfig: IReportCreateConfiguration = changes.embedConfig.currentValue;
      if (JSON.stringify(prevEmbedConfig) !== JSON.stringify(currentEmbedConfig)) {
        // Input from parent get updated, thus call embedCreateReport function
        this.embedCreateReport();
      }
    }

    // Set event handlers if available
    if (this.eventHandlers && this.embed) {
      super.setEventHandlers(this.embed, this.eventHandlers);
    }
  }

  public ngAfterViewInit(): void {
    // Decide to embed
    this.embedCreateReport();

    // Set event handlers if available
    if (this.eventHandlers && this.embed) {
      super.setEventHandlers(this.embed, this.eventHandlers);
    }
  }

  /**
   * Embed the PowerBI Create report
   *
   * @returns void
   */
  private embedCreateReport(): void {
    // Check if the HTML container is rendered and available
    if (!isEmbedSetupValid(this.containerRef, this.embedConfig)) {
      return;
    }

    // Embed create report
    this.embed = this.powerbi.createReport(this.containerRef.nativeElement, this.embedConfig);
  }
}
