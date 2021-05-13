// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigResponse } from '../app.component';

@Injectable({
  providedIn: 'root',
})

/**
 * Service to make HTTP calls
 */
export class HttpService {
  constructor(private httpClient: HttpClient) {}

  /**
   * @returns embed configuration
   */
  getEmbedConfig(endpoint: string): Observable<ConfigResponse> {
    return this.httpClient.get<ConfigResponse>(endpoint);
  }
}
