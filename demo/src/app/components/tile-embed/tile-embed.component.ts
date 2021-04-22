/* Copyright (c) Microsoft Corporation.
Licensed under the MIT License. */

import { Component, OnInit } from '@angular/core';
import { ITileEmbedConfiguration, models } from 'powerbi-client';
import { HttpService } from 'src/app/services/httpservice.service';
import { TileConfigResponse } from 'src/interfaces';

@Component({
  selector: 'tile-embed',
  templateUrl: './tile-embed.component.html',
  styleUrls: ['./tile-embed.component.css']
})
export class TileEmbedComponent implements OnInit {

  // Overall status message of embedding
  displayMessage = 'The tile is bootstrapped. Click the Embed Tile button to set the access token.';

  // CSS Class to be passed to the library
  tileClass = 'tile-style-class';

  // Pass the basic embed configurations to the library to bootstrap the tile on first load
  // Values for properties like embedUrl and accessToken click of button
  tileConfig: ITileEmbedConfiguration = {
    type: 'tile',
    tokenType: models.TokenType.Embed,
    dashboardId: undefined
  };

  constructor(public httpService: HttpService) { }

  ngOnInit(): void {
  }

  async embedTile() {

    // API Endpoint to get the Tile embed config
    const tileUrl = 'https://playgroundbe-bck-1.azurewebsites.net/Tiles/SampleTile';

    let tileConfigResponse: TileConfigResponse;

    // Get the embed config from the service and set the tileConfigResponse
    try {
      tileConfigResponse = await this.httpService.getTileEmbedConfig(tileUrl).toPromise();
    }
    catch (error) {
      console.error(`Failed to fetch config for tile. Status: ${error.statusText} Status Code: ${error.status}`);
      return;
    }

    // Update tileConfig to embed the PowerBI tile
    this.tileConfig = {
      ...this.tileConfig,
      id: tileConfigResponse.Id,
      dashboardId: tileConfigResponse.DashboardId,
      embedUrl: tileConfigResponse.EmbedUrl,
      accessToken: tileConfigResponse.EmbedToken.Token
    };

    this.displayMessage = 'The access token is successfully set. Loading the Power BI tile.';
  }
}
