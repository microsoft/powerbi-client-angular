// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'embed-config-dialog',
  templateUrl: './embed-config-dialog.component.html',
  styleUrls: ['./embed-config-dialog.component.css']
})

export class EmbedConfigDialogComponent {
  @Output() public embedConfigEvent = new EventEmitter<{ aadToken: string, embedUrl: string }>();
  @Output() public close = new EventEmitter<void>();

  private aadToken = "";
  private embedUrl = "";
  public areFieldsFilled: boolean = false;

  public runConfig(): void {
    this.embedConfigEvent.emit({ aadToken: this.aadToken, embedUrl: this.embedUrl });
    this.hideEmbedConfigDialog();
  }

  public onAadTokenChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.aadToken = target.value;
    this.checkFields();
  }

  public onEmbedUrlChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.embedUrl = target.value;
    this.checkFields();
  }

  private checkFields(): void {
    this.areFieldsFilled = this.aadToken.trim() !== '' && this.embedUrl.trim() !== '';
  }

  private resetFields() {
    this.aadToken = '';
    this.embedUrl = '';
    this.areFieldsFilled = false;
  }

  public hideEmbedConfigDialog(): void {
    this.resetFields();
    this.close.emit();
  }
}