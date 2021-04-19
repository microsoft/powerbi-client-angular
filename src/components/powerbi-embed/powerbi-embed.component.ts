// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  Input
} from '@angular/core';
import { service } from 'powerbi-client';

@Component({
  selector: 'powerbi-embed',
  template: ''
})

/**
 * Base component to hold common properties for all the Power BI entities
 * 
 */
export class PowerBIEmbedComponent implements OnInit, OnChanges {

  // Input() specify the properties that will be passed from the parent
  // CSS class to be set on the embedding container (Optional)
  @Input() cssClassName?:string;

  // Provide a custom implementation of PowerBI service (Optional)
  @Input() service?: service.Service;

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }
}
