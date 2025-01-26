// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { HttpClientModule } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PowerBIEmbedModule } from 'powerbi-client-angular';
import { AppComponent } from './app.component';
import { EmbedConfigDialogComponent } from '../components/embed-config-dialog/embed-config-dialog.component';
import { EventDetailsDialogComponent } from '../components/event-details-dialog/event-details-dialog.component';

@NgModule({
  declarations: [AppComponent, EmbedConfigDialogComponent, EventDetailsDialogComponent],
  imports: [BrowserModule, HttpClientModule, PowerBIEmbedModule],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
