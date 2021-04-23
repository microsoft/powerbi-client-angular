// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  Embed,
  factories,
  IDashboardEmbedConfiguration,
  IEmbedConfiguration,
  service,
} from 'powerbi-client';
import { PowerBIEmbedComponent } from '../powerbi-embed/powerbi-embed.component';

@Component({
  selector: 'powerbi-dashboard[embedConfig]',
  template: '<div class={{cssClassName}} #dashboardContainer></div>',
})

/**
 * Dashboard component to embed the dashboard, extends the Base component
 */
export class PowerBIDashboardEmbedComponent
  extends PowerBIEmbedComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  // Input() specify properties that will be passed from parent
  // Configuration for embedding the PowerBI dashboard entity (Required)
  @Input()
  embedConfig!: IDashboardEmbedConfiguration | IEmbedConfiguration;

  // Ref to the HTML div container element
  @ViewChild('dashboardContainer')
  private containerRef!: ElementRef<HTMLDivElement>;

  // PowerBI service
  private powerbi!: service.Service;

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
    if (this.service) {
      this.powerbi = this.service;
    } else {
      this.powerbi = new service.Service(
        factories.hpmFactory,
        factories.wpmpFactory,
        factories.routerFactory
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const prevEmbedConfig = changes.embedConfig
      .previousValue as IDashboardEmbedConfiguration;

    // Input from parent get updated, thus call embedOrUpdateAccessToken function
    this.embedOrUpdateAccessToken(prevEmbedConfig);
  }

  ngAfterViewInit(): void {
    // Check if container exists on the UI
    if (this.containerRef.nativeElement) {
      // Decide to embed, load or bootstrap
      if (this.embedConfig.accessToken && this.embedConfig.embedUrl) {
        this.embedEntity();
      } else {
        this.embed = this.powerbi.bootstrap(
          this.containerRef.nativeElement,
          this.embedConfig
        );
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
   * Embed the PowerBI Entity
   *
   * @returns void
   */
  private embedEntity(): void {
    // Check if the HTML container is rendered and available
    if (!this.containerRef.nativeElement) {
      return;
    }

    this.embed = this.powerbi.embed(this.containerRef.nativeElement, this.embedConfig);
  }

  /**
   * When component updates, choose to _embed_ the powerbi entity or _update the accessToken_ in the embedded entity
   * or do nothing if the embedUrl and accessToken did not update in the new properties
   *
   * @param prevEmbedConfig EmbedConfig
   * @returns void
   */
  private embedOrUpdateAccessToken(prevEmbedConfig: IDashboardEmbedConfiguration) {
    // Check if Embed URL and Access Token are present in current properties
    if (!this.embedConfig.accessToken || !this.embedConfig.embedUrl) {
      return;
    }

    // Check if the function is being called the first time
    // prevEmbedConfig will not be available
    if (!prevEmbedConfig) {
      return;
    }

    // Embed or load in the following scenarios
    //    1. Access Token was not provided in previous properties (E.g. Dashboard was bootstrapped earlier)
    //    2. Embed URL is updated (E.g. New dashboard is to be embedded)
    if (
      this.containerRef.nativeElement &&
      (!prevEmbedConfig.accessToken ||
        this.embedConfig.embedUrl !== prevEmbedConfig.embedUrl)
    ) {
      this.embedEntity();
    }

    // Set new access token,
    // when access token is updated but embed Url is same
    else if (
      this.embedConfig.accessToken !== prevEmbedConfig.accessToken &&
      this.embedConfig.embedUrl === prevEmbedConfig.embedUrl &&
      this.embed
    ) {
      this.embed.setAccessToken(this.embedConfig.accessToken).catch((error) => {
        console.error(`setAccessToken error: ${error}`);
      });
    }
  }
}
