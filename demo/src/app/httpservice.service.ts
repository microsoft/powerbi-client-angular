import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReportConfig } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }

  /**
   * @returns Report embed configuration
   */
  getEmbedConfig(reportUrl: string) {
    return this.httpClient.get<ReportConfig>(reportUrl);
  }
}
