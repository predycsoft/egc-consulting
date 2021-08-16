import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAgregarEquipoComponent } from './dialog-agregar-equipo.component';

describe('DialogAgregarEquipoComponent', () => {
  let component: DialogAgregarEquipoComponent;
  let fixture: ComponentFixture<DialogAgregarEquipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAgregarEquipoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAgregarEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
