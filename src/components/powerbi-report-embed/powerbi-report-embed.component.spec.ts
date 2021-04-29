// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockEmbed } from '../../tests/mockembed';
import { PowerBIReportEmbedComponent } from './powerbi-report-embed.component';

describe('PowerBIReportEmbedComponent', () => {
  let component: PowerBIReportEmbedComponent;
  let fixture: ComponentFixture<PowerBIReportEmbedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PowerBIReportEmbedComponent],
    }).compileComponents();
  });

  describe('basic tests', () => {
    it('is an Angular component', () => {
      // Assert
      expect(PowerBIReportEmbedComponent).toBeTruthy();
    });

    it('should create', () => {
      // Arrange
      fixture = TestBed.createComponent(PowerBIReportEmbedComponent);
      component = fixture.componentInstance;
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
      fixture = TestBed.createComponent(PowerBIReportEmbedComponent);
      component = fixture.componentInstance;
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
      fixture = TestBed.createComponent(PowerBIReportEmbedComponent);
      component = fixture.componentInstance;
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

      fixture = TestBed.createComponent(PowerBIReportEmbedComponent);
      component = fixture.componentInstance;
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
    it('embeds report when accessToken provided', () => {
      // Arrange
      const mockEmbed = new MockEmbed();
      const config = {
        type: 'report',
        id: 'fakeId',
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      // Act
      fixture = TestBed.createComponent(PowerBIReportEmbedComponent);
      component = fixture.componentInstance;
      component.embedConfig = config;
      component.service = mockEmbed.mockPowerBIService;
      fixture.detectChanges();

      // Assert
      expect(mockEmbed.mockPowerBIService.bootstrap).toHaveBeenCalledTimes(0);
      expect(mockEmbed.mockPowerBIService.embed).toHaveBeenCalledTimes(1);
    });

    it('bootstraps report when accessToken is not provided', () => {
      // Arrange
      const mockEmbed = new MockEmbed();
      const config = {
        type: 'report',
        id: 'report',
        embedUrl: 'fakeUrl',
      };

      // Act
      fixture = TestBed.createComponent(PowerBIReportEmbedComponent);
      component = fixture.componentInstance;
      component.embedConfig = config;
      component.service = mockEmbed.mockPowerBIService;
      fixture.detectChanges();

      // Asset
      expect(mockEmbed.mockPowerBIService.embed).toHaveBeenCalledTimes(0);
      expect(mockEmbed.mockPowerBIService.bootstrap).toHaveBeenCalledTimes(1);
    });

    it('first bootstraps, then embeds when accessToken is available', () => {
      // Arrange
      const mockEmbed = new MockEmbed();
      const config = {
        type: 'report',
        id: 'fakeId',
        embedUrl: 'fakeUrl',
        accessToken: undefined,
      };

      const newConfig = {
        type: 'report',
        id: 'fakeId',
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      // Act
      // Without accessToken (bootstrap)
      fixture = TestBed.createComponent(PowerBIReportEmbedComponent);
      component = fixture.componentInstance;
      component.embedConfig = config;
      component.service = mockEmbed.mockPowerBIService;
      fixture.detectChanges();

      // Assert
      expect(mockEmbed.mockPowerBIService.embed).toHaveBeenCalledTimes(0);
      expect(mockEmbed.mockPowerBIService.bootstrap).toHaveBeenCalledTimes(1);

      // Reset for next Act
      mockEmbed.mockPowerBIService.embed.calls.reset();
      mockEmbed.mockPowerBIService.bootstrap.calls.reset();

      // Act
      // With accessToken (embed)
      fixture = TestBed.createComponent(PowerBIReportEmbedComponent);
      component = fixture.componentInstance;
      component.embedConfig = newConfig;
      component.service = mockEmbed.mockPowerBIService;
      fixture.detectChanges();

      // Assert
      expect(mockEmbed.mockPowerBIService.bootstrap).toHaveBeenCalledTimes(0);
      expect(mockEmbed.mockPowerBIService.embed).toHaveBeenCalledTimes(1);
    });

    it('embeds when embedUrl of report is updated in new input data', () => {
      // Arrange
      const mockEmbed = new MockEmbed();
      const config = {
        type: 'report',
        id: 'fakeId',
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      fixture = TestBed.createComponent(PowerBIReportEmbedComponent);
      component = fixture.componentInstance;
      component.embedConfig = config;
      component.service = mockEmbed.mockPowerBIService;
      fixture.detectChanges();

      // Embed URL of different report
      config.embedUrl = 'newFakeUrl';

      // Act
      fixture = TestBed.createComponent(PowerBIReportEmbedComponent);
      component = fixture.componentInstance;
      component.embedConfig = config;
      component.service = mockEmbed.mockPowerBIService;
      fixture.detectChanges();

      // Assert
      expect(mockEmbed.mockPowerBIService.embed).toHaveBeenCalled();
    });

    it('loads the report when phasedEmbedding input is true', () => {
      // Arrange
      const mockEmbed = new MockEmbed();
      const config = {
        type: 'report',
        id: 'fakeId',
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      // Act
      fixture = TestBed.createComponent(PowerBIReportEmbedComponent);
      component = fixture.componentInstance;
      component.embedConfig = config;
      component.service = mockEmbed.mockPowerBIService;
      component.phasedEmbedding = true;
      fixture.detectChanges();

      // Assert
      // service.load() is invoked once
      expect(mockEmbed.mockPowerBIService.load).toHaveBeenCalledTimes(1);

      // service.embed() is not invoked
      expect(mockEmbed.mockPowerBIService.embed).not.toHaveBeenCalled();
    });

    it('embeds the report when phasedEmbedding input is false', () => {
      // Arrange
      const mockEmbed = new MockEmbed();
      const config = {
        type: 'report',
        id: 'fakeId',
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      // Act
      fixture = TestBed.createComponent(PowerBIReportEmbedComponent);
      component = fixture.componentInstance;
      component.embedConfig = config;
      component.service = mockEmbed.mockPowerBIService;
      component.phasedEmbedding = false;
      fixture.detectChanges();

      // Assert
      // service.load() is not invoked
      expect(mockEmbed.mockPowerBIService.load).not.toHaveBeenCalled();

      // service.embed() is invoked once
      expect(mockEmbed.mockPowerBIService.embed).toHaveBeenCalledTimes(1);
    });

    it('embeds the report when phasedEmbedding input is not provided', () => {
      // Arrange
      const mockEmbed = new MockEmbed();
      const config = {
        type: 'report',
        id: 'fakeId',
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      // Act
      fixture = TestBed.createComponent(PowerBIReportEmbedComponent);
      component = fixture.componentInstance;
      component.embedConfig = config;
      component.service = mockEmbed.mockPowerBIService;
      fixture.detectChanges();

      // Assert
      // service.load() is not invoked
      expect(mockEmbed.mockPowerBIService.load).not.toHaveBeenCalled();

      // service.embed() is invoked once
      expect(mockEmbed.mockPowerBIService.embed).toHaveBeenCalledTimes(1);
    });

    it('powerbi.reset called when component unmounts', () => {
      // Arrange
      const mockEmbed = new MockEmbed();
      const config = {
        type: 'report',
        id: 'fakeId',
        embedUrl: 'fakeUrl',
        accessToken: 'fakeToken',
      };

      // Act
      fixture = TestBed.createComponent(PowerBIReportEmbedComponent);
      component = fixture.componentInstance;
      component.embedConfig = config;
      component.service = mockEmbed.mockPowerBIService;
      fixture.detectChanges();

      // Un-mount the component
      fixture.destroy();
      fixture.detectChanges();

      // Assert
      expect(mockEmbed.mockPowerBIService.reset).toHaveBeenCalledTimes(1);
    });

    it('does not embed again when accessToken and embedUrl are same', () => {
      // Arrange
      const mockEmbed = new MockEmbed();
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
      fixture = TestBed.createComponent(PowerBIReportEmbedComponent);
      component = fixture.componentInstance;
      component.embedConfig = config;
      component.service = mockEmbed.mockPowerBIService;
      fixture.detectChanges();

      // Assert
      expect(mockEmbed.mockPowerBIService.embed).toHaveBeenCalledTimes(1);
      mockEmbed.mockPowerBIService.embed.calls.reset();

      // Act
      // With accessToken (embed)
      component.embedConfig = newConfig;
      component.service = mockEmbed.mockPowerBIService;
      fixture.detectChanges();

      // Assert
      expect(mockEmbed.mockPowerBIService.embed).not.toHaveBeenCalled();
    });
  });
});
