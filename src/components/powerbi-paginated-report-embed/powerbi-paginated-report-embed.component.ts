// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Embed, IEmbedConfiguration } from 'powerbi-client';
import { PowerBIEmbedComponent } from '../powerbi-embed/powerbi-embed.component';

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
  @Input() embedConfig!: IEmbedConfiguration;

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
      const prevEmbedConfig = changes.embedConfig.previousValue as IEmbedConfiguration;

      // Check if the function is being called for the first time
      if (!prevEmbedConfig) {
        return;
      }

      // Input from parent get updated, thus call embedOrUpdateDashboard function
      this.embedOrUpdatedPaginatedReport(prevEmbedConfig);
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
    if (!this.containerRef.nativeElement) {
      return;
    }

    // Embed paginated report
    this.embed = this.powerbi.embed(this.containerRef.nativeElement, this.embedConfig);
  }

  /**
   * When component updates, choose to _embed_ the powerbi paginated report
   * or do nothing if the embedUrl and accessToken did not update in the new properties
   *
   * @param prevEmbedConfig IEmbedConfiguration
   * @returns void
   */
  private embedOrUpdatedPaginatedReport(prevEmbedConfig: IEmbedConfiguration): void {
    // Check if Embed URL and Access Token are present in current properties
    if (!this.embedConfig.accessToken || !this.embedConfig.embedUrl) {
      return;
    }

    // Embed in the following scenario
    // Embed URL is updated (E.g. New paginated report is to be embedded)
    if (this.containerRef.nativeElement && this.embedConfig.embedUrl !== prevEmbedConfig.embedUrl) {
      this.embedPaginatedReport();
    }
  }
}
