// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Component, OnInit } from '@angular/core';
import { PowerBIEmbedComponent } from '../powerbi-embed/powerbi-embed.component';

@Component({
  selector: 'powerbi-dashboard',
  template: ''
})

/**
 * Dashboard component to embed the dashboard, extends the Base component
 */
export class PowerBIDashboardEmbedComponent extends PowerBIEmbedComponent implements OnInit {

  constructor() { 
    super();
  }

  ngOnInit(): void {
  }

}
