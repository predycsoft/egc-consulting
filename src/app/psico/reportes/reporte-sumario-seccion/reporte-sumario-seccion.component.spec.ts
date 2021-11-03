import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteSumarioSeccionComponent } from './reporte-sumario-seccion.component';

describe('ReporteSumarioSeccionComponent', () => {
  let component: ReporteSumarioSeccionComponent;
  let fixture: ComponentFixture<ReporteSumarioSeccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteSumarioSeccionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteSumarioSeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
