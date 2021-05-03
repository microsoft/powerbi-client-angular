// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PowerBIDashboardEmbedComponent } from './powerbi-dashboard-embed.component';

describe('PowerBIDashboardEmbedComponent', () => {
  let component: PowerBIDashboardEmbedComponent;
  let fixture: ComponentFixture<PowerBIDashboardEmbedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PowerBIDashboardEmbedComponent],
    }).compileComponents();

    // Arrange
    fixture = TestBed.createComponent(PowerBIDashboardEmbedComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('Basic tests', () => {
    it('should create', () => {
      // Arrange
      const config = {
        type: 'dashboard',
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
        type: 'dashboard',
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
        type: 'dashboard',
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
        type: 'dashboard',
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

    it('embeds dashboard when accessToken provided', () => {
      // Arrange
      const config = {
        type: 'dashboard',
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

    it('bootstraps dashboard when accessToken is not provided', () => {
      // Arrange
      const config = {
        type: 'dashboard',
        id: 'dashboard',
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
        type: 'dashboard',
      };

      const newConfig = {
        type: 'dashboard',
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

    it('embeds when embedUrl of dashboard is updated in new input data', () => {
      // Arrange
      const config = {
        type: 'dashboard',
        id: 'fakeId',
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      // Act
      component.embedConfig = config;
      component.service = mockPowerBIService;
      fixture.detectChanges();

      // Embed URL of different dashboard
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
        type: 'dashboard',
        id: 'fakeId',
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      const newConfig = {
        type: 'dashboard',
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

  describe('Dashboard events', () => {
    beforeEach(() => {
      const config = {
        type: 'dashboard',
        id: 'fakeId',
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      component.embedConfig = config;
      fixture.detectChanges();
    });

    it('sets and resets event handlers', () => {
      // Arrange
      const testDashboard = component.getDashboard();
      spyOn(testDashboard, 'on');
      spyOn(testDashboard, 'off');
      const testEventHandlers = new Map([
        ['tileClicked', () => console.log('tile')],
        ['error', () => console.log('error')],
      ]);

      // Act
      component.eventHandlers = testEventHandlers;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(undefined, component.eventHandlers, false),
      });
      fixture.detectChanges();

      // Assert
      expect(testDashboard.on).toHaveBeenCalledTimes(testEventHandlers.size);
      expect(testDashboard.off).toHaveBeenCalledTimes(testEventHandlers.size);
    });

    it('reset event handlers in case of null provided', () => {
      // Arrange
      const testDashboard = component.getDashboard();
      spyOn(testDashboard, 'on');
      spyOn(testDashboard, 'off');
      const testEventHandlers = new Map([
        ['tileClicked', null],
        ['error', null],
      ]);

      // Act
      component.eventHandlers = testEventHandlers;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(undefined, component.eventHandlers, false),
      });
      fixture.detectChanges();

      // Assert
      expect(testDashboard.on).toHaveBeenCalledTimes(0);
      expect(testDashboard.off).toHaveBeenCalledTimes(testEventHandlers.size);
    });

    it('does not set same map again', () => {
      // Arrange
      const testDashboard = component.getDashboard();
      const spyForOn = spyOn(testDashboard, 'on');
      const spyForOff = spyOn(testDashboard, 'off');
      const testEventHandlers = new Map([
        ['tileClicked', () => console.log('tile')],
        ['error', () => console.log('error')],
      ]);
      const newEventHandlers = testEventHandlers;

      // Act
      component.eventHandlers = testEventHandlers;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(undefined, component.eventHandlers, false),
      });
      fixture.detectChanges();

      // Assert
      expect(testDashboard.on).toHaveBeenCalledTimes(testEventHandlers.size);
      expect(testDashboard.off).toHaveBeenCalledTimes(testEventHandlers.size);

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
      expect(testDashboard.on).toHaveBeenCalledTimes(0);
      expect(testDashboard.off).toHaveBeenCalledTimes(0);
    });

    it('does not console error for supported events for embed object', () => {
      // Arrange
      spyOn(console, 'error');
      const testEventHandlers = new Map([
        ['loaded', () => console.log('loaded')],
        ['tileClicked', () => console.log('tile clicked')],
        ['error', null],
      ]);

      // Act
      component.eventHandlers = testEventHandlers;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(undefined, component.eventHandlers, false),
      });
      fixture.detectChanges();

      // Assert
      expect(console.error).toHaveBeenCalledTimes(0);
    });

    it('console log for invalid events', () => {
      // Arrange
      spyOn(console, 'error');
      const testEventHandlers = new Map([
        ['invalidEvent01', () => console.log('invalid event 01')],
        ['invalidEvent02', () => console.log('invalid event 02')],
        ['invalidEvent03', null],
      ]);

      // Act
      component.eventHandlers = testEventHandlers;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(undefined, component.eventHandlers, false),
      });
      fixture.detectChanges();

      // Assert
      expect(console.error).toHaveBeenCalledTimes(1);
    });
  });
});
