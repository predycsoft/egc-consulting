import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLibreriaEquiposComponent } from './dialog-libreria-equipos.component';

describe('DialogLibreriaEquiposComponent', () => {
  let component: DialogLibreriaEquiposComponent;
  let fixture: ComponentFixture<DialogLibreriaEquiposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogLibreriaEquiposComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogLibreriaEquiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
