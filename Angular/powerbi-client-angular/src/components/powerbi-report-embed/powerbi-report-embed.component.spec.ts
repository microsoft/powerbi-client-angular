// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { models } from 'powerbi-client';
import 'powerbi-report-authoring';
import { PowerBIReportEmbedComponent } from './powerbi-report-embed.component';

describe('PowerBIReportEmbedComponent', () => {
  let component: PowerBIReportEmbedComponent;
  let fixture: ComponentFixture<PowerBIReportEmbedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PowerBIReportEmbedComponent],
    }).compileComponents();

    // Arrange
    fixture = TestBed.createComponent(PowerBIReportEmbedComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('Basic tests', () => {
    it('should create', () => {
      // Arrange
      const config = {
        type: 'report',
      };

      // Act
      component.embedConfig = config;
      fixture.detectChanges();

      // Assert
      expect(component).toBeTruthy();
    });

    it('renders exactly one div', () => {
      // Arrange
      const config = {
        type: 'report',
      };

      // Act
      component.embedConfig = config;
      fixture.detectChanges();
      const divCount = fixture.debugElement.queryAll(By.css('div')).length;

      // Assert
      expect(divCount).toBe(1);
    });

    it('renders exactly one iframe', () => {
      // Arrange
      const config = {
        type: 'report',
      };

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

      const config = {
        type: 'report',
      };

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
      mockPowerBIService = jasmine.createSpyObj('mockService', ['load', 'embed', 'bootstrap', 'setSdkInfo']);
    });

    it('embeds report when accessToken provided', () => {
      // Arrange
      const config = {
        type: 'report',
        id: 'fakeId',
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      // Act
      component.embedConfig = config;
      component.service = mockPowerBIService;
      fixture.detectChanges();

      // Assert
      expect(mockPowerBIService.bootstrap).toHaveBeenCalledTimes(0);
      expect(mockPowerBIService.embed).toHaveBeenCalledTimes(1);
    });

    it('bootstraps report when accessToken is not provided', () => {
      // Arrange
      const config = {
        type: 'report',
        id: 'report',
        embedUrl: 'fakeUrl',
      };

      // Act
      component.embedConfig = config;
      component.service = mockPowerBIService;
      fixture.detectChanges();

      // Asset
      expect(mockPowerBIService.embed).toHaveBeenCalledTimes(0);
      expect(mockPowerBIService.bootstrap).toHaveBeenCalledTimes(1);
    });

    it('first bootstraps, then embeds when accessToken is available', () => {
      // Arrange
      const config = {
        type: 'report',
      };

      const newConfig = {
        type: 'report',
        id: 'fakeId',
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      // Act
      // Without accessToken (bootstrap)
      component.embedConfig = config;
      component.service = mockPowerBIService;
      fixture.detectChanges();

      // Assert
      expect(mockPowerBIService.embed).toHaveBeenCalledTimes(0);
      expect(mockPowerBIService.bootstrap).toHaveBeenCalledTimes(1);

      // Reset for next Act
      mockPowerBIService.embed.calls.reset();
      mockPowerBIService.bootstrap.calls.reset();

      // Act
      // With accessToken (embed)
      component.embedConfig = newConfig;
      component.ngOnChanges({
        embedConfig: new SimpleChange(config, component.embedConfig, false),
      });
      fixture.detectChanges();

      // Assert
      expect(mockPowerBIService.bootstrap).toHaveBeenCalledTimes(0);
      expect(mockPowerBIService.embed).toHaveBeenCalledTimes(1);
    });

    it('embeds when embedUrl of report is updated in new input data', () => {
      // Arrange
      const config = {
        type: 'report',
        id: 'fakeId',
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      // Act
      component.embedConfig = config;
      component.service = mockPowerBIService;
      fixture.detectChanges();

      // Embed URL of different report
      config.embedUrl = 'newFakeUrl';

      // Act
      component.embedConfig = config;
      fixture.detectChanges();

      // Assert
      expect(mockPowerBIService.embed).toHaveBeenCalled();
    });

    it('loads the report when phasedEmbedding input is true', () => {
      // Arrange
      const config = {
        type: 'report',
        id: 'fakeId',
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      // Act
      component.embedConfig = config;
      component.service = mockPowerBIService;
      component.phasedEmbedding = true;
      fixture.detectChanges();

      // Assert
      // service.load() is invoked once
      expect(mockPowerBIService.load).toHaveBeenCalledTimes(1);

      // service.embed() is not invoked
      expect(mockPowerBIService.embed).not.toHaveBeenCalled();
    });

    it('embeds the report when phasedEmbedding input is false', () => {
      // Arrange
      const config = {
        type: 'report',
        id: 'fakeId',
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      // Act
      component.embedConfig = config;
      component.service = mockPowerBIService;
      component.phasedEmbedding = false;
      fixture.detectChanges();

      // Assert
      // service.load() is not invoked
      expect(mockPowerBIService.load).not.toHaveBeenCalled();

      // service.embed() is invoked once
      expect(mockPowerBIService.embed).toHaveBeenCalledTimes(1);
    });

    it('embeds the report when phasedEmbedding input is not provided', () => {
      // Arrange
      const config = {
        type: 'report',
        id: 'fakeId',
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      // Act
      component.embedConfig = config;
      component.service = mockPowerBIService;
      fixture.detectChanges();

      // Assert
      // service.load() is not invoked
      expect(mockPowerBIService.load).not.toHaveBeenCalled();

      // service.embed() is invoked once
      expect(mockPowerBIService.embed).toHaveBeenCalledTimes(1);
    });

    it('does not embed again when accessToken and embedUrl are same', () => {
      // Arrange
      const config = {
        type: 'report',
        id: 'fakeId',
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      const newConfig = {
        type: 'report',
        id: 'fakeId',
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      // Act
      component.embedConfig = config;
      component.service = mockPowerBIService;
      fixture.detectChanges();

      // Assert
      expect(mockPowerBIService.embed).toHaveBeenCalledTimes(1);
      mockPowerBIService.embed.calls.reset();

      // Act
      // With accessToken (embed)
      component.embedConfig = newConfig;
      component.ngOnChanges({
        embedConfig: new SimpleChange(config, component.embedConfig, false),
      });
      fixture.detectChanges();

      // Assert
      expect(mockPowerBIService.embed).not.toHaveBeenCalled();
    });
  });

  describe('Tests for setting event handlers', () => {
    beforeEach(() => {
      component.embedConfig = { type: 'report' };
      fixture.detectChanges();
    });

    it('clears previous event handlers and sets new event handlers', () => {
      // Arrange
      const eventHandlers = new Map([
        ['loaded', () => {}],
        ['rendered', () => {}],
        ['error', () => {}],
      ]);

      // Act
      // Initialize testReport
      const testReport = component.getReport();

      spyOn(testReport, 'on');
      spyOn(testReport, 'off');

      component.eventHandlers = eventHandlers;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(undefined, component.eventHandlers, true),
      });
      fixture.detectChanges();

      // Assert
      expect(testReport.off).toHaveBeenCalledTimes(eventHandlers.size);
      expect(testReport.on).toHaveBeenCalledTimes(eventHandlers.size);
    });

    it('clears already set event handlers in case of null provided for event handler', () => {
      // Arrange
      const eventHandlers = new Map([
        ['loaded', null],
        ['rendered', null],
        ['error', () => {}],
      ]);

      // Act
      // Initialize testReport
      const testReport = component.getReport();

      spyOn(testReport, 'on');
      spyOn(testReport, 'off');

      component.eventHandlers = eventHandlers;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(undefined, component.eventHandlers, true),
      });
      fixture.detectChanges();

      // Assert
      expect(testReport.off).toHaveBeenCalledTimes(eventHandlers.size);
      // Two events are removed in new event handlers
      expect(testReport.on).toHaveBeenCalledTimes(eventHandlers.size - 2);
    });

    it('does not console error for valid events of report', () => {
      // Arrange
      const eventHandlers = new Map([
        ['loaded', () => {}],
        ['rendered', () => {}],
        ['error', () => {}],
        ['filtersApplied', () => {}],
        ['pageChanged', () => {}],
        ['commandTriggered', () => {}],
        ['swipeStart', () => {}],
        ['swipeEnd', () => {}],
        ['bookmarkApplied', () => {}],
        ['dataHyperlinkClicked', () => {}],
        ['visualRendered', () => {}],
        ['visualClicked', () => {}],
        ['selectionChanged', () => {}],
      ]);

      // Act
      spyOn(console, 'error');
      component.eventHandlers = eventHandlers;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(undefined, component.eventHandlers, true),
      });
      fixture.detectChanges();

      // Assert
      expect(console.error).not.toHaveBeenCalled();
    });

    it('does not set the same eventHandler map again', () => {
      // Arrange
      const eventHandlers = new Map([
        ['loaded', () => {}],
        ['rendered', () => {}],
        ['error', () => {}],
      ]);

      const newEventHandlers = new Map([
        ['loaded', () => {}],
        ['rendered', () => {}],
        ['error', () => {}],
      ]);

      // Act
      // Initialize testReport
      const testReport = component.getReport();
      fixture.detectChanges();

      const spyForOn = spyOn(testReport, 'on');
      const spyForOff = spyOn(testReport, 'off');
      component.eventHandlers = eventHandlers;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(undefined, component.eventHandlers, true),
      });
      fixture.detectChanges();

      // Assert
      expect(testReport.on).toHaveBeenCalledTimes(eventHandlers.size);
      expect(testReport.off).toHaveBeenCalledTimes(eventHandlers.size);

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
      expect(testReport.on).toHaveBeenCalledTimes(0);
      expect(testReport.off).toHaveBeenCalledTimes(0);
    });
  });

  describe('Test for get report', () => {
    it('returns the report component', () => {
      // Arrange
      const config = {
        type: 'report',
      };

      const expectedResponse = {
        config: {
          type: 'report',
          embedUrl: 'https://app.powerbi.com/reportEmbed',
          groupId: undefined,
          bootstrapped: true,
          settings: {
            filterPaneEnabled: undefined,
            navContentPaneEnabled: undefined,
          },
        },
      };

      // Act
      component.embedConfig = config;
      fixture.detectChanges();
      const response = component.getReport();

      // Assert
      expect(response.config).toEqual(jasmine.objectContaining(expectedResponse.config));
    });
  });

  describe('Tests for report features', () => {
    let fakeFilters: any[];

    beforeEach(() => {
      // Arrange
      fakeFilters = [
        {
          x: 'fakeFilter1',
        },
        {
          x: 'fakeFilter2',
        },
      ];

      component.embedConfig = {
        type: 'report',
        id: 'fakeId',
        filters: fakeFilters,
      };
      fixture.detectChanges();
    });

    it('returns id of embedded report', () => {
      // Arrange
      // Initialize testReport
      const testReport = component.getReport();

      const expectedTestReportId = 'fakeId';

      // Act
      const testReportId = testReport.getId();

      // Assert
      expect(testReportId).toEqual(expectedTestReportId);
    });

    describe('Test of report level filters', async () => {
      it('returns a list of applied filters', async () => {
        // Arrange
        // Initialize testReport
        const testReport = component.getReport();

        const resolvedPromise = Promise.resolve(fakeFilters);
        spyOn(testReport, 'getFilters').and.returnValue(resolvedPromise);

        // Act
        const filters = await testReport.getFilters();

        // Assert
        expect(filters).toEqual(jasmine.objectContaining(fakeFilters));
      });

      it('sets filters', async () => {
        // Arrange
        // Initialize testReport
        const testReport = component.getReport();

        const testFilters: any[] = [
          {
            x: 'testFilter1',
          },
          {
            x: 'testFilter2',
          },
        ];

        const expectedResponse = {
          body: undefined,
          statusCode: 202,
          headers: {},
          statusText: '',
        };
        const resolvedPromise = Promise.resolve(expectedResponse);
        spyOn(testReport, 'setFilters').and.returnValue(resolvedPromise);

        // Act
        const response = await testReport.setFilters(testFilters);

        // Assert
        expect(response.statusCode).toEqual(202);
      });

      it('removes filter', async () => {
        // Arrange
        // Initialize testReport
        const testReport = component.getReport();

        const expectedResponse = {
          body: undefined,
          statusCode: 202,
          headers: {},
          statusText: '',
        };
        const resolvedPromise = Promise.resolve(expectedResponse);
        spyOn(testReport, 'removeFilters').and.returnValue(resolvedPromise);

        // Act
        const response = await testReport.removeFilters();

        // Assert
        expect(response.statusCode).toEqual(202);
      });

      it('updates filter', async () => {
        // Arrange
        // Initialize testReport
        const testReport = component.getReport();

        const testFilter: any = { x: 'testFilter' };

        const expectedResponse = {
          body: undefined,
          statusCode: 202,
          headers: {},
          statusText: '',
        };
        const resolvedPromise = Promise.resolve(expectedResponse);
        spyOn(testReport, 'updateFilters').and.returnValue(resolvedPromise);

        // Act
        const response = await testReport.updateFilters(models.FiltersOperations.Replace, [testFilter]);

        // Assert
        expect(response.statusCode).toEqual(202);
      });
    });

    describe('Tests of page features', () => {
      it('sets given page as active page', async () => {
        // Arrange
        // Initialize testReport
        const testReport = component.getReport();

        const testPageName = 'fakePage';

        const expectedResponse = {
          body: undefined,
          statusCode: 202,
          headers: {},
          statusText: '',
        };
        const resolvedPromise = Promise.resolve(expectedResponse);
        spyOn(testReport, 'setPage').and.returnValue(resolvedPromise);

        // Act
        const response = await testReport.setPage(testPageName);

        // Assert
        expect(response.statusCode).toEqual(202);
      });

      it('returns all the pages of a report', async () => {
        // Arrange
        // Initialize testReport
        const testReport = component.getReport();

        const expectedPages = [testReport.page('page1'), testReport.page('page2')];
        const resolvedPromise = Promise.resolve(expectedPages);
        spyOn(testReport, 'getPages').and.returnValue(resolvedPromise);

        // Act
        const testReportPages = await testReport.getPages();

        // Assert
        expect(testReportPages[0].name).toEqual(expectedPages[0].name);
        expect(testReportPages[1].name).toEqual(expectedPages[1].name);
      });
    });

    describe('Tests of update settings', () => {
      it('updates report settings', async () => {
        // Arrange
        // Initialize testReport
        const testReport = component.getReport();

        const testSettings: models.ISettings = { filterPaneEnabled: true };

        const expectedResponse = {
          body: undefined,
          statusCode: 202,
          headers: {},
          statusText: '',
        };
        const resolvedPromise = Promise.resolve(expectedResponse);
        spyOn(testReport, 'updateSettings').and.returnValue(resolvedPromise);

        // Act
        const response = await testReport.updateSettings(testSettings);

        // Assert
        expect(response.statusCode).toEqual(202);
      });
    });

    describe('Tests of report extensions from report authoring library', () => {
      it('gets visual capabilities in report', async () => {
        // Arrange
        // Initialize testReport
        const testReport = component.getReport();

        const testVisualType = 'lineChart';

        const expectedResponse: any = {
          dataRoles: [
            {
              name: 'fakeName',
              displayName: 'fakeDisplayName',
              description: 'fakeDescription',
            },
          ],
        };
        const resolvedPromise = Promise.resolve(expectedResponse);
        spyOn(testReport, 'getVisualCapabilities').and.returnValue(resolvedPromise);

        // Act
        const response = await testReport.getVisualCapabilities(testVisualType);

        // Assert
        expect(response.dataRoles).toBe(expectedResponse.dataRoles);
      });

      it('gets available visual types from current report', async () => {
        // Arrange
        // Initialize testReport
        const testReport = component.getReport();

        const expectedResponse = ['columnChart', 'lineChart'];

        const resolvedPromise = Promise.resolve(expectedResponse);
        spyOn(testReport, 'getAvailableVisualTypes').and.returnValue(resolvedPromise);

        // Act
        const response = await testReport.getAvailableVisualTypes();

        // Assert
        expect(response[0]).toBe(expectedResponse[0]);
        expect(response[1]).toBe(expectedResponse[1]);
      });
    });
  });
});
