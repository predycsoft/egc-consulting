import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogComentarioComponent } from './dialog-comentario.component';

describe('DialogComentarioComponent', () => {
  let component: DialogComentarioComponent;
  let fixture: ComponentFixture<DialogComentarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogComentarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogComentarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
