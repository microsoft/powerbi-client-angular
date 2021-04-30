// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Embed, IVisualEmbedConfiguration } from 'powerbi-client';
import { PowerBIEmbedComponent } from '../powerbi-embed/powerbi-embed.component';

/**
 * Visual component to embed the visual, extends Base component
 */
@Component({
  selector: 'powerbi-visual[embedConfig]',
  template: '<div class={{cssClassName}} #visualContainer></div>',
})
export class PowerBIVisualEmbedComponent extends PowerBIEmbedComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  // Input() specify properties that will be passed from parent
  // Configuration for embedding the PowerBI Visual (Required)
  @Input() embedConfig!: IVisualEmbedConfiguration;

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

  ngOnInit(): void {
    // Initialize PowerBI service instance variable from parent
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const prevEmbedConfig = changes.embedConfig.previousValue as IVisualEmbedConfiguration;

    // Input from parent get updated, thus call embedOrUpdateVisual function
    this.embedOrUpdateVisual(prevEmbedConfig);
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
  }

  ngOnDestroy(): void {
    // Clean up
    if (this.containerRef.nativeElement) {
      this.powerbi.reset(this.containerRef.nativeElement);
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
  private embedOrUpdateVisual(prevEmbedConfig: IVisualEmbedConfiguration) {
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
    // Embed URL is updated (E.g. New visual is to be embedded)
    if (this.containerRef.nativeElement && this.embedConfig.embedUrl !== prevEmbedConfig.embedUrl) {
      this.embedVisual();
    }
  }
}
