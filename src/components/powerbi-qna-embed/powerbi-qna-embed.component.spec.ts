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
      mockPowerBIService = jasmine.createSpyObj('mockService', ['embed', 'bootstrap']);
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

      // Arrange
      component.embedConfig = config;
      fixture.detectChanges();
    });

    it('clears previous event handlers and sets new event handlers', () => {
      // Arrange
      const testEventHandlers = new Map([
        ['visualRendered', () => { }],
        ['error', () => { }],
        ['loaded', () => { }],
      ]);

      // Act
      // Initialize testQna
      const testQna = component.getQna();

      spyOn(testQna, 'on');
      spyOn(testQna, 'off');

      component.eventHandlers = testEventHandlers;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(undefined, component.eventHandlers, true),
      });
      fixture.detectChanges();

      // Assert
      expect(testQna.on).toHaveBeenCalledTimes(testEventHandlers.size);
      expect(testQna.off).toHaveBeenCalledTimes(testEventHandlers.size);
    });

    it('reset event handlers in case of null provided', () => {
      // Arrange
      const testEventHandlers = new Map([
        ['visualRendered', null],
        ['error', null],
        ['loaded', null],
      ]);

      // Act
      // Initialize testQna
      const testQna = component.getQna();

      spyOn(testQna, 'on');
      spyOn(testQna, 'off');

      component.eventHandlers = testEventHandlers;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(undefined, component.eventHandlers, true),
      });
      fixture.detectChanges();

      // Assert
      // Since, null is provided in all the event handlers, 'on' method is never called
      expect(testQna.on).not.toHaveBeenCalled();
      expect(testQna.off).toHaveBeenCalledTimes(testEventHandlers.size);
    });

    it('does not set same map again', () => {
      // Arrange
      const testEventHandlers = new Map([
        ['visualRendered', () => { }],
        ['error', () => { }],
        ['loaded', () => { }],
      ]);
      const newEventHandlers = testEventHandlers;

      // Act
      // Initialize testQna
      const testQna = component.getQna();

      const spyForOn = spyOn(testQna, 'on');
      const spyForOff = spyOn(testQna, 'off');

      component.eventHandlers = testEventHandlers;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(undefined, component.eventHandlers, true),
      });
      fixture.detectChanges();

      // Assert
      expect(testQna.on).toHaveBeenCalledTimes(testEventHandlers.size);
      expect(testQna.off).toHaveBeenCalledTimes(testEventHandlers.size);

      // Reset for next Act
      spyForOn.calls.reset();
      spyForOff.calls.reset();

      // Act
      component.eventHandlers = newEventHandlers;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(testEventHandlers, component.eventHandlers, false),
      });
      fixture.detectChanges();

      // Assert
      expect(testQna.on).not.toHaveBeenCalled();
      expect(testQna.off).not.toHaveBeenCalled();
    });

    it('does not consoles error for supported events for embed object', () => {
      // Arrange
      const testEventHandlers = new Map([
        ['visualRendered', () => { }],
        ['error', () => { }],
        ['loaded', () => { }],
      ]);

      // Act
      spyOn(console, 'error');

      component.eventHandlers = testEventHandlers;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(undefined, component.eventHandlers, true),
      });
      fixture.detectChanges();

      // Assert
      expect(console.error).not.toHaveBeenCalled();
    });

    it('consoles error for invalid events', () => {
      // Arrange
      const invalidEvent1 = 'invalidEvent1';
      const invalidEvent2 = 'invalidEvent2';
      const testEventHandlers = new Map([
        [invalidEvent1, () => { }],
        [invalidEvent2, () => { }],
      ]);
      const expectedError = `Following events are invalid: ${invalidEvent1},${invalidEvent2}`;

      // Act
      spyOn(console, 'error');

      component.eventHandlers = testEventHandlers;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(undefined, component.eventHandlers, true),
      });
      fixture.detectChanges();

      // Assert
      expect(console.error).toHaveBeenCalledWith(expectedError);
    });
  });
});
