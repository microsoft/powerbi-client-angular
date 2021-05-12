// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PowerBIEmbedComponent } from './powerbi-embed.component';

describe('PowerBIEmbedComponent', () => {
  let component: PowerBIEmbedComponent;
  let fixture: ComponentFixture<PowerBIEmbedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PowerBIEmbedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PowerBIEmbedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
