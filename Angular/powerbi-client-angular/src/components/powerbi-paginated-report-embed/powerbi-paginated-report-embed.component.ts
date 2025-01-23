// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Embed } from 'powerbi-client';
import { IPaginatedReportLoadConfiguration } from 'powerbi-models';
import { PowerBIEmbedComponent } from '../powerbi-embed/powerbi-embed.component';
import { isEmbedSetupValid } from '../../utils/utils';

/**
 * Paginated report component to embed the entity, extends the Base component
 */
@Component({
  selector: 'powerbi-paginated-report[embedConfig]',
  template: '<div class={{cssClassName}} #paginatedReportContainer></div>',
})
export class PowerBIPaginatedReportEmbedComponent extends PowerBIEmbedComponent implements OnInit, OnChanges, AfterViewInit {
  // Input() specify properties that will be passed from parent
  // Configuration for embedding the PowerBI Paginated report (Required)
  @Input() embedConfig!: IPaginatedReportLoadConfiguration;

  // Ref to the HTML div container element
  @ViewChild('paginatedReportContainer') private containerRef!: ElementRef<HTMLDivElement>;

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
      // Check if the function is being called for the first time
      if (changes.embedConfig.isFirstChange()) {
        return;
      }

      const prevEmbedConfig: IPaginatedReportLoadConfiguration = changes.embedConfig.previousValue;
      const currentEmbedConfig: IPaginatedReportLoadConfiguration = changes.embedConfig.currentValue;
      if (JSON.stringify(prevEmbedConfig) !== JSON.stringify(currentEmbedConfig)) {
        // Input from parent get updated, thus call embedPaginatedReport function
        this.embedPaginatedReport();
      }
    }
  }

  ngAfterViewInit(): void {
    // Check if container exists on the UI
    if (this.containerRef.nativeElement) {
      // Decide to embed
      this.embedPaginatedReport();
    }
  }

  /**
   * Embed the PowerBI Paginated report
   *
   * @returns void
   */
  private embedPaginatedReport(): void {
    // Check if the HTML container is rendered and available
    if (!isEmbedSetupValid(this.containerRef, this.embedConfig)) {
      return;
    }

    // Embed paginated report
    this.embed = this.powerbi.embed(this.containerRef.nativeElement, this.embedConfig);
  }
}
