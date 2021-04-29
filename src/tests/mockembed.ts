// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export class MockEmbed {
  mockedMethods = ['init', 'embed', 'bootstrap', 'load', 'get', 'reset', 'preload'];
  mockPowerBIService = jasmine.createSpyObj('mockService', this.mockedMethods);
}
