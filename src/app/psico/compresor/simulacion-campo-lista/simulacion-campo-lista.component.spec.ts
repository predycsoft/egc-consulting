import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulacionCampoListaComponent } from './simulacion-campo-lista.component';

describe('SimulacionCampoListaComponent', () => {
  let component: SimulacionCampoListaComponent;
  let fixture: ComponentFixture<SimulacionCampoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulacionCampoListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulacionCampoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
