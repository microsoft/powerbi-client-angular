// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { models } from 'powerbi-client';
import { PowerBIVisualEmbedComponent } from './powerbi-visual-embed.component';

describe('PowerBIVisualEmbedComponent', () => {
  let component: PowerBIVisualEmbedComponent;
  let fixture: ComponentFixture<PowerBIVisualEmbedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PowerBIVisualEmbedComponent],
    }).compileComponents();

    // Arrange
    fixture = TestBed.createComponent(PowerBIVisualEmbedComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('Basic tests', () => {
    it('should create', () => {
      // Arrange
      const config = {
        type: 'visual',
        visualName: '',
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
        type: 'visual',
        visualName: '',
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
        type: 'visual',
        visualName: '',
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
        type: 'visual',
        visualName: '',
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
      mockPowerBIService = jasmine.createSpyObj('mockService', ['embed', 'bootstrap', 'setSdkInfo']);
    });

    it('embeds visual when accessToken provided', () => {
      // Arrange
      const config = {
        visualName: 'fakeVisual',
        pageName: 'fakePage',
        type: 'visual',
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

    it('bootstraps visual when accessToken is not provided', () => {
      // Arrange
      const config = {
        type: 'visual',
        id: 'visual',
        visualName: '',
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
        type: 'visual',
        visualName: '',
      };

      const newConfig = {
        type: 'visual',
        id: 'fakeId',
        visualName: 'fakeVisual',
        pageName: 'fakePage',
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

    it('embeds when embedUrl of visual is updated in new input data', () => {
      // Arrange
      const config = {
        type: 'visual',
        id: 'fakeId',
        visualName: 'fakeVisual',
        pageName: 'fakePage',
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      // Act
      component.embedConfig = config;
      component.service = mockPowerBIService;
      fixture.detectChanges();

      // Embed URL of different visual
      config.embedUrl = 'newFakeUrl';

      // Act
      component.embedConfig = config;
      fixture.detectChanges();

      // Assert
      expect(mockPowerBIService.embed).toHaveBeenCalled();
    });

    it('does not embed again when accessToken and embedUrl are same', () => {
      // Arrange
      const config = {
        type: 'visual',
        id: 'fakeId',
        visualName: 'fakeVisual',
        pageName: 'fakePage',
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      const newConfig = {
        type: 'visual',
        id: 'fakeId',
        visualName: 'fakeVisual',
        pageName: 'fakePage',
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
      const config = {
        type: 'visual',
        visualName: 'fakeVisual',
      };

      // Arrange
      component.embedConfig = config;
      fixture.detectChanges();
    });

    it('clears previous event handlers and sets new event handlers', () => {
      // Arrange
      const eventHandlers = new Map([
        ['loaded', () => {}],
        ['rendered', () => {}],
        ['error', () => {}],
      ]);

      // Initialize testVisual
      const testVisual = component.getVisual();

      spyOn(testVisual, 'on');
      spyOn(testVisual, 'off');

      component.eventHandlers = eventHandlers;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(undefined, component.eventHandlers, true),
      });
      fixture.detectChanges();

      // Assert
      expect(testVisual.off).toHaveBeenCalledTimes(eventHandlers.size);
      expect(testVisual.on).toHaveBeenCalledTimes(eventHandlers.size);
    });

    it('clears already set event handlers in case of null provided for event handler', () => {
      // Arrange
      const eventHandlers = new Map([
        ['loaded', null],
        ['rendered', null],
        ['error', () => {}],
      ]);

      // Act
      const testVisual = component.getVisual();

      spyOn(testVisual, 'on');
      spyOn(testVisual, 'off');

      component.eventHandlers = eventHandlers;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(undefined, component.eventHandlers, true),
      });
      fixture.detectChanges();

      // Assert
      expect(testVisual.off).toHaveBeenCalledTimes(eventHandlers.size);
      // Two events are removed in new event handlers
      expect(testVisual.on).toHaveBeenCalledTimes(eventHandlers.size - 2);
    });

    it('does not console error for valid events of visual', () => {
      // Arrange
      const eventHandlers = new Map([
        ['loaded', () => {}],
        ['rendered', () => {}],
        ['error', () => {}],
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
      const testVisual = component.getVisual();
      fixture.detectChanges();

      const spyForOn = spyOn(testVisual, 'on');
      const spyForOff = spyOn(testVisual, 'off');
      component.eventHandlers = eventHandlers;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(undefined, component.eventHandlers, true),
      });
      fixture.detectChanges();

      // Assert
      expect(testVisual.on).toHaveBeenCalledTimes(eventHandlers.size);
      expect(testVisual.off).toHaveBeenCalledTimes(eventHandlers.size);

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
      expect(testVisual.on).toHaveBeenCalledTimes(0);
      expect(testVisual.off).toHaveBeenCalledTimes(0);
    });
  });

  describe('Tests for visual features', () => {
    let fakeFilters: any[];
    let fakeVisualId: any;

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

      fakeVisualId = 'fakeVisualId';

      component.embedConfig = {
        type: 'visual',
        id: fakeVisualId,
        visualName: 'fakeVisual',
        filters: fakeFilters,
      };
      fixture.detectChanges();
    });

    it('returns id of embedded visual', () => {
      // Arrange
      // Initialize testVisual
      const testVisual = component.getVisual();

      const expectedTestVisualId = fakeVisualId;

      // Act
      const testVisualId = testVisual.getId();

      // Assert
      expect(testVisualId).toEqual(expectedTestVisualId);
    });

    it('returns a list of applied filters', async () => {
      // Arrange
      // Initialize testVisual
      const testVisual = component.getVisual();

      const resolvedPromise = Promise.resolve(fakeFilters);
      spyOn(testVisual, 'getFilters').and.returnValue(resolvedPromise);

      // Act
      const filters = await testVisual.getFilters();

      // Assert
      expect(filters).toEqual(jasmine.objectContaining(fakeFilters));
    });

    it('sets filters', async () => {
      // Arrange
      // Initialize testVisual
      const testVisual = component.getVisual();

      const expectedResponse = {
        body: undefined,
        statusCode: 202,
        headers: {},
        statusText: '',
      };

      const testFilters: any[] = [
        {
          x: 'testFilter1',
        },
        {
          x: 'testFilter2',
        },
      ];
      const resolvedPromise = Promise.resolve(expectedResponse);
      spyOn(testVisual, 'setFilters').and.returnValue(resolvedPromise);

      // Act
      const response = await testVisual.setFilters(testFilters);

      // Assert
      expect(response.statusCode).toEqual(202);
    });

    it('removes filter', async () => {
      // Arrange
      // Initialize testVisual
      const testVisual = component.getVisual();

      const expectedResponse = {
        body: undefined,
        statusCode: 202,
        headers: {},
        statusText: '',
      };
      const resolvedPromise = Promise.resolve(expectedResponse);
      spyOn(testVisual, 'removeFilters').and.returnValue(resolvedPromise);

      // Act
      const response = await testVisual.removeFilters();

      // Assert
      expect(response.statusCode).toEqual(202);
    });

    it('updates filter', async () => {
      // Arrange
      // Initialize testVisual
      const testVisual = component.getVisual();

      const testFilter: any = { x: 'testFilter' };
      const expectedResponse = {
        body: undefined,
        statusCode: 202,
        headers: {},
        statusText: '',
      };
      const resolvedPromise = Promise.resolve(expectedResponse);
      spyOn(testVisual, 'updateFilters').and.returnValue(resolvedPromise);

      // Act
      const response = await testVisual.updateFilters(models.FiltersOperations.Replace, [testFilter]);

      // Assert
      expect(response.statusCode).toEqual(202);
    });
  });
});
