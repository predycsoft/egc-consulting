import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteSumarioInputsComponent } from './reporte-sumario-inputs.component';

describe('ReporteSumarioInputsComponent', () => {
  let component: ReporteSumarioInputsComponent;
  let fixture: ComponentFixture<ReporteSumarioInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteSumarioInputsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteSumarioInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
