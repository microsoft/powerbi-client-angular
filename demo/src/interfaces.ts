// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// Handles the embed config response for Tile embedding
export interface ConfigResponse {
  Id: string;
  EmbedUrl: string;
  EmbedToken: {
    Token: string;
  };
}

// Handles the embed config response for Report and Dashboard embedding
export interface TileConfigResponse {
  DashboardId: string;
  Id: string;
  EmbedUrl: string;
  EmbedToken: {
    Token: string;
  };
}
