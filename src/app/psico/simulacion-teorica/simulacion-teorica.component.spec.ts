import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulacionTeoricaComponent } from './simulacion-teorica.component';

describe('SimulacionTeoricaComponent', () => {
  let component: SimulacionTeoricaComponent;
  let fixture: ComponentFixture<SimulacionTeoricaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulacionTeoricaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulacionTeoricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
