// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Component, OnChanges, SimpleChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnChanges {

  value = 'Angular library works!';

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

}
