// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'event-details-dialog',
  templateUrl: './event-details-dialog.component.html',
  styleUrls: ['./event-details-dialog.component.css']
})
export class EventDetailsDialogComponent {
  @Input() dataSelectedEventDetails: any;
  @Output() closeDataSelectedEventDetailsDialog = new EventEmitter<void>();

  closeSelectedEventDetailsDialog() {
    this.closeDataSelectedEventDetailsDialog.emit();
  }
}