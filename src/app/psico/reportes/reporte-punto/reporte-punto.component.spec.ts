import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportePuntoComponent } from './reporte-punto.component';

describe('ReportePuntoComponent', () => {
  let component: ReportePuntoComponent;
  let fixture: ComponentFixture<ReportePuntoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportePuntoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportePuntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
