// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { mockedMethods, mockPowerBIService } from 'src/services/mockService';
import { PowerBIDashboardEmbedComponent } from './powerbi-dashboard-embed.component';

describe('PowerBIDashboardEmbedComponent', () => {
  let component: PowerBIDashboardEmbedComponent;
  let fixture: ComponentFixture<PowerBIDashboardEmbedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PowerBIDashboardEmbedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    // Reset all methods in Power BI service spy object
    mockedMethods.forEach((mockedMethod) => {
      mockPowerBIService[mockedMethod].calls.reset();
    });
  });

  afterEach(() => {});

  describe('basic tests', () => {
    it('is an Angular component', () => {
      // Assert
      expect(PowerBIDashboardEmbedComponent).toBeTruthy();
    });

    it('should create', () => {
      // Arrange
      fixture = TestBed.createComponent(PowerBIDashboardEmbedComponent);
      component = fixture.componentInstance;
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
      fixture = TestBed.createComponent(PowerBIDashboardEmbedComponent);
      component = fixture.componentInstance;
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
      fixture = TestBed.createComponent(PowerBIDashboardEmbedComponent);
      component = fixture.componentInstance;
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

      fixture = TestBed.createComponent(PowerBIDashboardEmbedComponent);
      component = fixture.componentInstance;
      const config = {
        type: 'dashboard',
      };

      // Act
      component.embedConfig = config;
      component.cssClassName = inputCssClasses;
      fixture.detectChanges();
      const divElement: HTMLElement = fixture.debugElement.queryAll(By.css('div'))[0]
        .nativeElement;

      // Assert
      expect(divElement.classList).toContain(inputCssClasses.split(' ')[0]);
      expect(divElement.classList).toContain(inputCssClasses.split(' ')[1]);
    });
  });

  describe('Interaction with Power BI service', () => {
    it('embeds dashboard when accessToken provided', () => {
      // Arrange
      const config = {
        type: 'dashboard',
        id: 'fakeId',
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      // Act
      fixture = TestBed.createComponent(PowerBIDashboardEmbedComponent);
      component = fixture.componentInstance;
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
      fixture = TestBed.createComponent(PowerBIDashboardEmbedComponent);
      component = fixture.componentInstance;
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
        id: 'fakeId',
        embedUrl: 'fakeUrl',
        accessToken: undefined,
      };

      const newConfig = {
        type: 'dashboard',
        id: 'fakeId',
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      // Act
      // Without accessToken (bootstrap)
      fixture = TestBed.createComponent(PowerBIDashboardEmbedComponent);
      component = fixture.componentInstance;
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
      fixture = TestBed.createComponent(PowerBIDashboardEmbedComponent);
      component = fixture.componentInstance;
      component.embedConfig = newConfig;
      component.service = mockPowerBIService;
      fixture.detectChanges();

      // Assert
      expect(mockPowerBIService.bootstrap).toHaveBeenCalledTimes(0);
      expect(mockPowerBIService.embed).toHaveBeenCalledTimes(1);
    });

    it("embeds when dashboard's embedUrl is updated in new input data", () => {
      // Arrange
      const config = {
        type: 'dashboard',
        id: 'fakeId',
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      fixture = TestBed.createComponent(PowerBIDashboardEmbedComponent);
      component = fixture.componentInstance;
      component.embedConfig = config;
      component.service = mockPowerBIService;
      fixture.detectChanges();

      // Embed URL of different dashboard
      config.embedUrl = 'newFakeUrl';

      // Act
      fixture = TestBed.createComponent(PowerBIDashboardEmbedComponent);
      component = fixture.componentInstance;
      component.embedConfig = config;
      component.service = mockPowerBIService;
      fixture.detectChanges();

      // Assert
      expect(mockPowerBIService.embed).toHaveBeenCalled();
    });

    it('powerbi.reset called when component unmounts', () => {
      // Arrange
      const config = {
        type: 'dashboard',
        id: 'fakeId',
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      // Act
      fixture = TestBed.createComponent(PowerBIDashboardEmbedComponent);
      component = fixture.componentInstance;
      component.embedConfig = config;
      component.service = mockPowerBIService;
      fixture.detectChanges();

      // Un-mount the component
      fixture.destroy();
      fixture.detectChanges();

      // Assert
      expect(mockPowerBIService.reset).toHaveBeenCalledTimes(1);
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
      fixture = TestBed.createComponent(PowerBIDashboardEmbedComponent);
      component = fixture.componentInstance;
      component.embedConfig = config;
      component.service = mockPowerBIService;
      fixture.detectChanges();

      // Assert
      expect(mockPowerBIService.embed).toHaveBeenCalledTimes(1);
      mockPowerBIService.embed.calls.reset();

      // Act
      // With accessToken (embed)
      component.embedConfig = newConfig;
      component.service = mockPowerBIService;
      fixture.detectChanges();

      // Assert
      expect(mockPowerBIService.embed).not.toHaveBeenCalled();
    });
  });
});
