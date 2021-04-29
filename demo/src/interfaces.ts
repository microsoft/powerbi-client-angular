// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// Handles the embed config response for Tile embedding
export interface ConfigResponse {
  Id: string;
  EmbedUrl: string;
  EmbedToken: {
    Token: string;
  };
  DashboardId?: string;
}
