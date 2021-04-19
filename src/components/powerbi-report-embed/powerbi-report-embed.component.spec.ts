import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerBIReportEmbedComponent } from './powerbi-report-embed.component';

describe('PowerBIReportEmbedComponent', () => {
  let component: PowerBIReportEmbedComponent;
  let fixture: ComponentFixture<PowerBIReportEmbedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowerBIReportEmbedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerBIReportEmbedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
