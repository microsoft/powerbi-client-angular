// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { PowerBIEmbedModule } from 'powerbi-embed';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    PowerBIEmbedModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
