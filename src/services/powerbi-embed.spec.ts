// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { TestBed } from '@angular/core/testing';

import { PowerBIEmbedService } from './powerbi-embed.service';

describe('PowerBIEmbedService', () => {
  let service: PowerBIEmbedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PowerBIEmbedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
