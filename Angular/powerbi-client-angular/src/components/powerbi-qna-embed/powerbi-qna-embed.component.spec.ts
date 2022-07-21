// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PowerBIQnaEmbedComponent } from './powerbi-qna-embed.component';

describe('PowerBIQnaEmbedComponent', () => {
  let component: PowerBIQnaEmbedComponent;
  let fixture: ComponentFixture<PowerBIQnaEmbedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PowerBIQnaEmbedComponent],
    }).compileComponents();

    // Arrange
    fixture = TestBed.createComponent(PowerBIQnaEmbedComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('Basic tests', () => {
    it('should create', () => {
      // Arrange
      const config = {
        type: 'qna',
        datasetIds: [],
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
        type: 'qna',
        datasetIds: [],
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
        type: 'qna',
        datasetIds: [],
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
        type: 'qna',
        datasetIds: [],
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

    it('embeds qna visual when accessToken provided', () => {
      // Arrange
      const config = {
        type: 'qna',
        datasetIds: ['fakeId'],
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

    it('bootstraps qna visual when accessToken is not provided', () => {
      // Arrange
      const config = {
        type: 'qna',
        id: 'qna visual',
        datasetIds: [],
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
        type: 'qna',
        datasetIds: [],
      };

      const newConfig = {
        type: 'qna',
        id: 'fakeId',
        datasetIds: ['fakeId'],
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

    it('embeds when embedUrl of qna visual is updated in new input data', () => {
      // Arrange
      const config = {
        type: 'qna',
        id: 'fakeId',
        datasetIds: ['fakeId'],
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      // Act
      component.embedConfig = config;
      component.service = mockPowerBIService;
      fixture.detectChanges();

      // Embed URL of different qna visual
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
        type: 'qna',
        id: 'fakeId',
        datasetIds: ['fakeId'],
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      const newConfig = {
        type: 'qna',
        id: 'fakeId',
        datasetIds: ['fakeId'],
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
        type: 'qna',
        id: 'fakeId',
        datasetIds: ['fakeId'],
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };
      component.embedConfig = config;
      fixture.detectChanges();
    });

    it('clears previous event handlers and sets new event handlers', () => {
      // Arrange
      const eventHandlers = new Map([
        ['loaded', () => {}],
        ['visualRendered', () => {}],
        ['error', () => {}],
      ]);

      // Act
      // Initialize testQnA
      const testQnA = component.getQna();

      spyOn(testQnA, 'on');
      spyOn(testQnA, 'off');

      component.eventHandlers = eventHandlers;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(undefined, component.eventHandlers, true),
      });
      fixture.detectChanges();

      // Assert
      expect(testQnA.off).toHaveBeenCalledTimes(eventHandlers.size);
      expect(testQnA.on).toHaveBeenCalledTimes(eventHandlers.size);
    });

    it('clears already set event handlers in case of null provided for event handler', () => {
      // Arrange
      const eventHandlers = new Map([
        ['loaded', null],
        ['visualRendered', null],
        ['error', () => {}],
      ]);

      // Act
      // Initialize testQnA
      const testQnA = component.getQna();

      spyOn(testQnA, 'on');
      spyOn(testQnA, 'off');

      component.eventHandlers = eventHandlers;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(undefined, component.eventHandlers, true),
      });
      fixture.detectChanges();

      // Assert
      expect(testQnA.off).toHaveBeenCalledTimes(eventHandlers.size);
      // Two events are removed in new event handlers
      expect(testQnA.on).toHaveBeenCalledTimes(eventHandlers.size - 2);
    });

    it('does not console error for valid events of qna', () => {
      // Arrange
      const eventHandlers = new Map([
        ['loaded', () => {}],
        ['visualRendered', () => {}],
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
        ['visualRendered', () => {}],
        ['error', () => {}],
      ]);

      const newEventHandlers = new Map([
        ['loaded', () => {}],
        ['visualRendered', () => {}],
        ['error', () => {}],
      ]);

      // Act
      // Initialize testQnA
      const testVisual = component.getQna();
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
});
