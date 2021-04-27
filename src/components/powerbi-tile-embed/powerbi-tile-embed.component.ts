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
import { Embed, factories, ITileEmbedConfiguration, service } from 'powerbi-client';
import { PowerBIEmbedComponent } from '../powerbi-embed/powerbi-embed.component';

@Component({
  selector: 'powerbi-tile[embedConfig]',
  template: '<div class={{cssClassName}} #tileContainer></div>',
})

/**
 * Tile component to embed the tile, extends Base component
 */
export class PowerBITileEmbedComponent
  extends PowerBIEmbedComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  // Input() specify properties that will be passed from parent
  // Configuration for embedding the PowerBI tile entity (Required)
  @Input()
  embedConfig!: ITileEmbedConfiguration;

  // Ref to the HTML div container element
  @ViewChild('tileContainer')
  private containerRef!: ElementRef<HTMLDivElement>;

  // Power BI service
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
    const prevEmbedConfig = changes.embedConfig.previousValue as ITileEmbedConfiguration;

    // Input from parent get updated, thus call embedOrUpdateTile function
    this.embedOrUpdateTile(prevEmbedConfig);
  }

  ngAfterViewInit(): void {
    // Check if container exists on the UI
    if (this.containerRef.nativeElement) {
      // Decide to embed or bootstrap
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
   * When component updates, choose to _embed_ the powerbi entity
   * or do nothing if the embedUrl and accessToken did not update in the new properties
   *
   * @param prevEmbedConfig ITileEmbedConfiguration
   * @returns void
   */
  private embedOrUpdateTile(prevEmbedConfig: ITileEmbedConfiguration) {
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
    if (
      this.containerRef.nativeElement &&
      this.embedConfig.embedUrl !== prevEmbedConfig.embedUrl
    ) {
      this.embedEntity();
    }
  }
}
