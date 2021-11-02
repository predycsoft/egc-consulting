import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulacionCampoDialogResultadosComponent } from './simulacion-campo-dialog-resultados.component';

describe('SimulacionCampoDialogResultadosComponent', () => {
  let component: SimulacionCampoDialogResultadosComponent;
  let fixture: ComponentFixture<SimulacionCampoDialogResultadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulacionCampoDialogResultadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulacionCampoDialogResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
