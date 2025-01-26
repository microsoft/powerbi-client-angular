// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { factories, service } from 'powerbi-client';
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

  it('should assign custom service to powerbi instance if provided', () => {
    (PowerBIEmbedComponent as any)._powerbi = new service.Service(factories.hpmFactory, factories.wpmpFactory, factories.routerFactory);
    component.service = new service.Service(factories.hpmFactory, factories.wpmpFactory, factories.routerFactory);
    fixture.detectChanges();

    component.ngOnInit();

    expect(component.powerbi).toBe(component.service);
  });

  it('should assign static service instance to powerbi if no custom service is provided', () => {
    (PowerBIEmbedComponent as any)._powerbi = new service.Service(factories.hpmFactory, factories.wpmpFactory, factories.routerFactory);
    fixture.detectChanges();

    component.ngOnInit();

    expect(component.powerbi).toBe((PowerBIEmbedComponent as any)._powerbi);
  });
});
