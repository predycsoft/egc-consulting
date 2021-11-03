import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportePuntoSumarioComponent } from './reporte-punto-sumario.component';

describe('ReportePuntoSumarioComponent', () => {
  let component: ReportePuntoSumarioComponent;
  let fixture: ComponentFixture<ReportePuntoSumarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportePuntoSumarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportePuntoSumarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
