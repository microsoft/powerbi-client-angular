// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  Input
} from '@angular/core';

@Component({
  selector: 'powerbi-embed',
  template: `<p>{{data}}</p>`
})

/**
 * Base component to embed Power BI entities
 */
export class PowerBIEmbedComponent implements OnInit, OnChanges {

  @Input() data = '';

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }
}
