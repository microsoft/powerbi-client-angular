// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Component } from '@angular/core';
import { ITileEmbedConfiguration, models } from 'powerbi-client';
import { HttpService } from 'src/app/services/httpservice.service';
import { ConfigResponse } from 'src/interfaces';
import { tileUrl } from '../../constants';

@Component({
  selector: 'tile-embed',
  templateUrl: './tile-embed.component.html',
})
export class TileEmbedComponent {
  // Overall status message of embedding
  displayMessage = 'The tile is bootstrapped. Click Embed Tile button to set the access token.';

  // CSS Class to be passed to the wrapper
  tileClass = 'tile-container';

  // Pass the basic embed configurations to the wrapper to bootstrap the tile on first load
  // Values for properties like embedUrl and accessToken click of button
  tileConfig: ITileEmbedConfiguration = {
    type: 'tile',
    tokenType: models.TokenType.Embed,
    dashboardId: undefined,
  };

  constructor(public httpService: HttpService) {}

  async embedTile(): Promise<void> {
    let tileConfigResponse: ConfigResponse;

    // Get the embed config from the service and set the tileConfigResponse
    try {
      tileConfigResponse = await this.httpService.getEmbedConfig(tileUrl).toPromise();
    } catch (error) {
      console.error(`Failed to fetch config for tile. Status: ${error.statusText} Status Code: ${error.status}`);
      return;
    }

    // Update tileConfig to embed the PowerBI tile
    this.tileConfig = {
      ...this.tileConfig,
      id: tileConfigResponse.Id,
      dashboardId: tileConfigResponse.DashboardId,
      embedUrl: tileConfigResponse.EmbedUrl,
      accessToken: tileConfigResponse.EmbedToken.Token,
    };

    this.displayMessage = 'Access token is successfully set. Loading Power BI tile.';
  }
}
