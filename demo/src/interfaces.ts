// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export interface ConfigResponse {
  Id: string;
  EmbedUrl: string;
  EmbedToken: {
    Token: string;
  };
}

export interface TileConfigResponse {
  DashboardId: string;
  Id: string;
  EmbedUrl: string;
  EmbedToken: {
    Token: string;
  };
}
