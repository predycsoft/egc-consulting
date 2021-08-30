import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLibreriaCromatografiasComponent } from './dialog-libreria-cromatografias.component';

describe('DialogLibreriaCromatografiasComponent', () => {
  let component: DialogLibreriaCromatografiasComponent;
  let fixture: ComponentFixture<DialogLibreriaCromatografiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogLibreriaCromatografiasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogLibreriaCromatografiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
