// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PowerBITileEmbedComponent } from './powerbi-tile-embed.component';

describe('PowerBITileEmbedComponent', () => {
  let component: PowerBITileEmbedComponent;
  let fixture: ComponentFixture<PowerBITileEmbedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PowerBITileEmbedComponent],
    }).compileComponents();

    // Arrange
    fixture = TestBed.createComponent(PowerBITileEmbedComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('Basic tests', () => {
    it('should create', () => {
      // Arrange
      const config = {
        type: 'tile',
        dashboardId: 'fakeId',
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
        type: 'tile',
        dashboardId: 'fakeId',
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
        type: 'tile',
        dashboardId: 'fakeId',
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
        type: 'tile',
        dashboardId: 'fakeId',
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

    it('embeds tile when accessToken provided', () => {
      // Arrange
      const config = {
        dashboardId: 'fakeId',
        type: 'tile',
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

    it('bootstraps tile when accessToken is not provided', () => {
      // Arrange
      const config = {
        type: 'tile',
        id: 'tile',
        dashboardId: 'fakeId',
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
        type: 'tile',
        dashboardId: 'fakeId',
      };

      const newConfig = {
        type: 'tile',
        id: 'fakeId',
        dashboardId: 'fakeId',
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

    it('embeds when embedUrl of tile is updated in new input data', () => {
      // Arrange
      const config = {
        type: 'tile',
        id: 'fakeId',
        dashboardId: 'fakeId',
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      // Act
      component.embedConfig = config;
      component.service = mockPowerBIService;
      fixture.detectChanges();

      // Embed URL of different tile
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
        type: 'tile',
        id: 'fakeId',
        dashboardId: 'fakeId',
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      const newConfig = {
        type: 'tile',
        id: 'fakeId',
        dashboardId: 'fakeId',
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
      component.embedConfig = {
        type: 'tile',
        dashboardId: 'fakeDashboard',
      };
      fixture.detectChanges();
    });

    it('clears previous event handlers and sets new event handlers', () => {
      // Arrange
      const eventHandlers = new Map([
        ['tileLoaded', () => {}],
        ['tileClicked', () => {}],
        ['error', () => {}],
      ]);

      // Act
      // Initialize testTile
      const testTile = component.getTile();

      spyOn(testTile, 'on');
      spyOn(testTile, 'off');

      component.eventHandlers = eventHandlers;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(undefined, component.eventHandlers, true),
      });
      fixture.detectChanges();

      // Assert
      expect(testTile.off).toHaveBeenCalledTimes(eventHandlers.size);
      expect(testTile.on).toHaveBeenCalledTimes(eventHandlers.size);
    });

    it('clears already set event handlers in case of null provided for event handler', () => {
      // Arrange
      const eventHandlers = new Map([
        ['tileLoaded', null],
        ['tileClicked', null],
        ['error', () => {}],
      ]);

      // Act
      // Initialize testTile
      const testTile = component.getTile();

      spyOn(testTile, 'on');
      spyOn(testTile, 'off');

      component.eventHandlers = eventHandlers;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(undefined, component.eventHandlers, true),
      });
      fixture.detectChanges();

      // Assert
      expect(testTile.off).toHaveBeenCalledTimes(eventHandlers.size);
      // Two events are removed in new event handlers
      expect(testTile.on).toHaveBeenCalledTimes(eventHandlers.size - 2);
    });

    it('does not console error for valid events of tile', () => {
      // Arrange
      const eventHandlers = new Map([
        ['tileLoaded', () => {}],
        ['tileClicked', () => {}],
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
        ['tileLoaded', () => {}],
        ['tileClicked', () => {}],
        ['error', () => {}],
      ]);

      const newEventHandlers = new Map([
        ['tileLoaded', () => {}],
        ['tileClicked', () => {}],
        ['error', () => {}],
      ]);

      // Act
      // Initialize testTile
      const testTile = component.getTile();
      fixture.detectChanges();

      const spyForOn = spyOn(testTile, 'on');
      const spyForOff = spyOn(testTile, 'off');
      component.eventHandlers = eventHandlers;
      component.ngOnChanges({
        eventHandlers: new SimpleChange(undefined, component.eventHandlers, true),
      });
      fixture.detectChanges();

      // Assert
      expect(testTile.on).toHaveBeenCalledTimes(eventHandlers.size);
      expect(testTile.off).toHaveBeenCalledTimes(eventHandlers.size);

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
      expect(testTile.on).toHaveBeenCalledTimes(0);
      expect(testTile.off).toHaveBeenCalledTimes(0);
    });
  });

  describe('Tests for tile features', () => {
    let fakeTileId: any;

    beforeEach(() => {
      // Arrange
      fakeTileId = 'fakeTileId';

      component.embedConfig = {
        type: 'tile',
        dashboardId: 'fakeId',
        id: fakeTileId,
      };
      fixture.detectChanges();
    });

    it('returns id of embedded tile', () => {
      // Arrange
      // Initialize testTile
      const testTile = component.getTile();

      const expectedTestTileId = fakeTileId;

      // Act
      const testTileId = testTile.getId();

      // Assert
      expect(testTileId).toEqual(expectedTestTileId);
    });
  });
});
