// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerBIDashboardEmbedComponent } from './powerbi-dashboard-embed.component';

describe('PowerBIDashboardEmbedComponent', () => {
  let component: PowerBIDashboardEmbedComponent;
  let fixture: ComponentFixture<PowerBIDashboardEmbedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowerBIDashboardEmbedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerBIDashboardEmbedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
