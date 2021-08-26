import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNuevoProyectoComponent } from './dialog-nuevo-proyecto.component';

describe('DialogNuevoProyectoComponent', () => {
  let component: DialogNuevoProyectoComponent;
  let fixture: ComponentFixture<DialogNuevoProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogNuevoProyectoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNuevoProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
