// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IReportCreateConfiguration } from 'powerbi-models';

import { PowerBICreateReportEmbedComponent } from './powerbi-create-report.component';

describe('PowerBICreateReportEmbedComponent', () => {
  let component: PowerBICreateReportEmbedComponent;
  let fixture: ComponentFixture<PowerBICreateReportEmbedComponent>;
  const config: IReportCreateConfiguration = {
    type: 'create',
    embedUrl: 'https://app.powerbi.com/fakeEmbedUrl',
    accessToken: 'fakeToken',
    datasetId: 'fakeId',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PowerBICreateReportEmbedComponent],
    }).compileComponents();

    // Arrange
    fixture = TestBed.createComponent(PowerBICreateReportEmbedComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('Basic tests', () => {
    it('should create', () => {
      // Act
      component.embedConfig = config;
      fixture.detectChanges();

      // Assert
      expect(component).toBeTruthy();
    });

    it('renders exactly one div', () => {
      // Act
      component.embedConfig = config;
      fixture.detectChanges();
      const divCount = fixture.debugElement.queryAll(By.css('div')).length;

      // Assert
      expect(divCount).toBe(1);
    });

    it('renders exactly one iframe', () => {
      // Act
      component.embedConfig = config;
      fixture.detectChanges();
      const iframeCount = fixture.debugElement.queryAll(By.css('iframe')).length;

      // Assert
      expect(iframeCount).toBe(1);
    });

    it('sets the CSS classes', () => {
      // Arrange
      const inputCssClasses = 'test-class another-test-class';

      // Act
      component.embedConfig = config;
      component.cssClassName = inputCssClasses;
      fixture.detectChanges();
      const divElement: HTMLElement = fixture.debugElement.queryAll(By.css('div'))[0].nativeElement;

      // Assert
      expect(divElement.classList).toContain(inputCssClasses.split(' ')[0]);
      expect(divElement.classList).toContain(inputCssClasses.split(' ')[1]);
    });
  });

  describe('Interaction with Power BI service', () => {
    let mockPowerBIService: any;

    beforeEach(() => {
      mockPowerBIService = jasmine.createSpyObj('mockService', ['createReport', 'setSdkInfo']);
    });

    it('embeds create report when accessToken provided', () => {
      // Act
      component.embedConfig = config;
      component.service = mockPowerBIService;
      fixture.detectChanges();

      // Assert
      expect(mockPowerBIService.createReport).toHaveBeenCalledTimes(1);
    });

    it('does not embed again if no changes in the embedConfig', () => {
      const newConfig: IReportCreateConfiguration = {
        ...config,
      };

      // Act
      component.embedConfig = config;
      component.service = mockPowerBIService;
      fixture.detectChanges();

      // Assert
      expect(mockPowerBIService.createReport).toHaveBeenCalledTimes(1);
      mockPowerBIService.createReport.calls.reset();

      // Act
      // With accessToken (embed)
      component.embedConfig = newConfig;
      component.ngOnChanges({
        embedConfig: new SimpleChange(config, component.embedConfig, false),
      });
      fixture.detectChanges();

      // Assert
      expect(mockPowerBIService.createReport).not.toHaveBeenCalled();
    });

    it('does not embed again when embedUrl or accessToken is missing', () => {
      const newConfig: IReportCreateConfiguration = {
        ...config,
        embedUrl: undefined,
        accessToken: undefined
      };

      // Act
      component.embedConfig = config;
      component.service = mockPowerBIService;
      fixture.detectChanges();

      // Assert
      expect(mockPowerBIService.createReport).toHaveBeenCalledTimes(1);
      mockPowerBIService.createReport.calls.reset();

      // Act
      component.embedConfig = newConfig;
      component.ngOnChanges({
        embedConfig: new SimpleChange(config, component.embedConfig, false),
      });
      fixture.detectChanges();

      // Assert
      expect(mockPowerBIService.createReport).not.toHaveBeenCalled();
    });

    it('embeds when embedConfig is updated in new input data', () => {
      // Act
      component.embedConfig = config;
      component.service = mockPowerBIService;
      fixture.detectChanges();

      // Assert
      expect(mockPowerBIService.createReport).toHaveBeenCalledTimes(1);
      mockPowerBIService.createReport.calls.reset();

      // Embed URL of different create report
      const newConfig = {
        ...config,
        embedUrl: 'https://app.powerbi.com/newFakeEmbedUrl'
      };

      // Act
      component.embedConfig = newConfig;
      component.ngOnChanges({
        embedConfig: new SimpleChange(config, component.embedConfig, false),
      });
      fixture.detectChanges();

      // Assert
      expect(mockPowerBIService.createReport).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tests for setting event handlers', () => {
    let testCreateReport: any;
    const eventHandlers = new Map([
      ['loaded', () => {}],
      ['rendered', () => {}],
      ['error', () => {}],
    ]);

    beforeEach(() => {
      component.embedConfig = config;
      fixture.detectChanges();

      // Initialize testCreateReport
      testCreateReport = component.getCreateObject();
    });

    it('clears previous event handlers and sets new event handlers', () => {
      spyOn(testCreateReport, 'on');
      spyOn(testCreateReport, 'off');

      component.eventHandlers = eventHandlers;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(undefined, component.eventHandlers, true),
      });
      fixture.detectChanges();

      // Assert
      expect(testCreateReport.off).toHaveBeenCalledTimes(eventHandlers.size);
      expect(testCreateReport.on).toHaveBeenCalledTimes(eventHandlers.size);
    });

    it('clears already set event handlers in case of null provided for event handler', () => {
      // Arrange
      const eventHandlersWithNull = new Map([
        ['loaded', null],
        ['rendered', null],
        ['error', () => {}],
      ]);

      // Act
      spyOn(testCreateReport, 'on');
      spyOn(testCreateReport, 'off');

      component.eventHandlers = eventHandlersWithNull;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(undefined, component.eventHandlers, true),
      });
      fixture.detectChanges();

      // Assert
      expect(testCreateReport.off).toHaveBeenCalledTimes(eventHandlers.size);
      // Two events are removed in new event handlers
      expect(testCreateReport.on).toHaveBeenCalledTimes(eventHandlers.size - 2);
    });

    it('does not console error for valid events of report', () => {
      // Arrange
      const allEventHandlers = new Map([
        ...eventHandlers,
        ['saved', () => {}],
        ['saveAsTriggered', () => {}],
        ['buttonClicked', () => {}],
        ['info', () => {}],
        ['dataSelected', () => {}],
      ]);

      // Act
      spyOn(console, 'error');
      component.eventHandlers = allEventHandlers;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(undefined, component.eventHandlers, true),
      });
      fixture.detectChanges();

      // Assert
      expect(console.error).not.toHaveBeenCalled();
    });

    it('does not set the same eventHandler map again', () => {
      // Arrange
      const newEventHandlers = new Map([
        ...eventHandlers,
      ]);

      // Act
      const spyForOn = spyOn(testCreateReport, 'on');
      const spyForOff = spyOn(testCreateReport, 'off');
      component.eventHandlers = newEventHandlers;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(undefined, component.eventHandlers, true),
      });
      fixture.detectChanges();

      // Assert
      expect(testCreateReport.on).toHaveBeenCalledTimes(eventHandlers.size);
      expect(testCreateReport.off).toHaveBeenCalledTimes(eventHandlers.size);

      // Reset the calls for next act
      spyForOn.calls.reset();
      spyForOff.calls.reset();

      // Act - with new eventHandlers
      component.eventHandlers = newEventHandlers;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(eventHandlers, newEventHandlers, false),
      });
      fixture.detectChanges();

      // Assert
      expect(testCreateReport.on).toHaveBeenCalledTimes(0);
      expect(testCreateReport.off).toHaveBeenCalledTimes(0);
    });
  });
});
