import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulacionCampoInputComponent } from './simulacion-campo-input.component';

describe('SimulacionCampoInputComponent', () => {
  let component: SimulacionCampoInputComponent;
  let fixture: ComponentFixture<SimulacionCampoInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulacionCampoInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulacionCampoInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
