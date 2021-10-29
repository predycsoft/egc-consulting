import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulacionCampoComponent } from './simulacion-campo.component';

describe('SimulacionCampoComponent', () => {
  let component: SimulacionCampoComponent;
  let fixture: ComponentFixture<SimulacionCampoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulacionCampoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulacionCampoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
