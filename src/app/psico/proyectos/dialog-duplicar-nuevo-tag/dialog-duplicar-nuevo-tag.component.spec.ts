import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDuplicarNuevoTagComponent } from './dialog-duplicar-nuevo-tag.component';

describe('DialogDuplicarNuevoTagComponent', () => {
  let component: DialogDuplicarNuevoTagComponent;
  let fixture: ComponentFixture<DialogDuplicarNuevoTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDuplicarNuevoTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDuplicarNuevoTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
