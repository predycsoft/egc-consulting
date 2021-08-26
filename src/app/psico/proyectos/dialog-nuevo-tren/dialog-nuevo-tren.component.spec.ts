import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNuevoTrenComponent } from './dialog-nuevo-tren.component';

describe('DialogNuevoTrenComponent', () => {
  let component: DialogNuevoTrenComponent;
  let fixture: ComponentFixture<DialogNuevoTrenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogNuevoTrenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNuevoTrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
