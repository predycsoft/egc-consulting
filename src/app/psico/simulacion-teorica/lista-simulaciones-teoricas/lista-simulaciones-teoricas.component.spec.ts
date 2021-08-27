import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaSimulacionesTeoricasComponent } from './lista-simulaciones-teoricas.component';

describe('ListaSimulacionesTeoricasComponent', () => {
  let component: ListaSimulacionesTeoricasComponent;
  let fixture: ComponentFixture<ListaSimulacionesTeoricasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaSimulacionesTeoricasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaSimulacionesTeoricasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
