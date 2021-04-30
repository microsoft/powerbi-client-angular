// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PowerBIQnaEmbedComponent } from './powerbi-qna-embed.component';

const mockedMethods = ['embed', 'bootstrap', 'reset'];
const mockPowerBIService = jasmine.createSpyObj('mockService', mockedMethods);

describe('PowerBIQnaEmbedComponent', () => {
  let component: PowerBIQnaEmbedComponent;
  let fixture: ComponentFixture<PowerBIQnaEmbedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PowerBIQnaEmbedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PowerBIQnaEmbedComponent);
    component = fixture.componentInstance;
  });

  describe('basic tests', () => {
    it('is an Angular component', () => {
      // Assert
      expect(PowerBIQnaEmbedComponent).toBeTruthy();
    });

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
    afterEach(() => {
      // Reset all methods in Power BI service spy object
      mockedMethods.forEach((mockedMethod) => {
        mockPowerBIService[mockedMethod].calls.reset();
      });
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
      component.service = mockPowerBIService;
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
      component.service = mockPowerBIService;
      fixture.detectChanges();

      // Assert
      expect(mockPowerBIService.embed).toHaveBeenCalled();
    });

    it('powerbi.reset called when component unmounts', () => {
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

      // Un-mount the component
      fixture.destroy();
      fixture.detectChanges();

      // Assert
      expect(mockPowerBIService.reset).toHaveBeenCalledTimes(1);
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
      component.service = mockPowerBIService;
      fixture.detectChanges();

      // Assert
      expect(mockPowerBIService.embed).not.toHaveBeenCalled();
    });
  });
});
