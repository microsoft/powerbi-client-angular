/* Copyright (c) Microsoft Corporation.
Licensed under the MIT License. */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigResponse } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})

/**
 * Service to make HTTP calls
 */
export class HttpService {

  constructor(private httpClient: HttpClient) { }

  /**
   * @returns embed configuration
   */
  getEmbedConfig(endpoint: string) {
    return this.httpClient.get<ConfigResponse>(endpoint);
  }
}
