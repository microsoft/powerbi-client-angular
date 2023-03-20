// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Embed, models } from 'powerbi-client';
import { PowerBIEmbedComponent } from '../powerbi-embed/powerbi-embed.component';

/**
 * Create report component to embed the entity, extends the Base component
 */
@Component({
  selector: 'powerbi-create-report[embedConfig]',
  template: '<div class={{cssClassName}} #createReportContainer></div>',
})
export class PowerBICreateReportEmbedComponent extends PowerBIEmbedComponent implements OnInit, OnChanges, AfterViewInit {
  // Input() specify properties that will be passed from parent
  // Configuration for embedding the PowerBI Create report (Required)
  @Input() embedConfig!: models.IReportCreateConfiguration;

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

  ngOnInit(): void {
    // Initialize PowerBI service instance variable from parent
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.embedConfig) {
      const prevEmbedConfig = changes.embedConfig.previousValue as models.IReportCreateConfiguration;

      // Check if the function is being called for the first time
      if (!prevEmbedConfig) {
        return;
      }

      // Input from parent get updated, thus call embedOrUpdateCreateReport function
      this.embedOrUpdatedCreateReport(prevEmbedConfig);
    }
  }

  ngAfterViewInit(): void {
    // Check if container exists on the UI
    if (this.containerRef.nativeElement) {
      // Decide to embed
      this.embedCreateReport();
    }
  }

  /**
   * Embed the PowerBI Create report
   *
   * @returns void
   */
  private embedCreateReport(): void {
    // Check if the HTML container is rendered and available
    if (!this.containerRef.nativeElement) {
      return;
    }

    // Embed create report
    this.embed = this.powerbi.createReport(this.containerRef.nativeElement, this.embedConfig);
  }

  /**
   * When component updates, choose to _embed_ the powerbi create report
   * or do nothing if the embedUrl and accessToken did not update in the new properties
   *
   * @param prevEmbedConfig IReportCreateConfiguration
   * @returns void
   */
  private embedOrUpdatedCreateReport(prevEmbedConfig: models.IReportCreateConfiguration): void {
    // Check if Embed URL and Access Token are present in current properties
    if (!this.embedConfig.accessToken || !this.embedConfig.embedUrl) {
      return;
    }

    // Embed in the following scenario
    // Embed URL is updated (E.g. New create report is to be embedded)
    if (this.containerRef.nativeElement && this.embedConfig.embedUrl !== prevEmbedConfig.embedUrl) {
      this.embedCreateReport();
    }
  }
}
