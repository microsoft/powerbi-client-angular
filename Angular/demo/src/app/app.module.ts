// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { HttpClientModule } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PowerBIEmbedModule } from 'powerbi-client-angular';
import { AppComponent } from './app.component';
import { EmbedConfigDialogComponent } from '../embed-config-dialog/embed-config-dialog.component';

@NgModule({
  declarations: [AppComponent, EmbedConfigDialogComponent],
  imports: [BrowserModule, HttpClientModule, PowerBIEmbedModule],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
