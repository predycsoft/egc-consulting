import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulacionCampoDashboardComponent } from './simulacion-campo-dashboard.component';

describe('SimulacionCampoDashboardComponent', () => {
  let component: SimulacionCampoDashboardComponent;
  let fixture: ComponentFixture<SimulacionCampoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulacionCampoDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulacionCampoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
