import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPolinomiosCurvasCompresorComponent } from './dialog-polinomios-curvas-compresor.component';

describe('DialogPolinomiosCurvasComponent', () => {
  let component: DialogPolinomiosCurvasCompresorComponent;
  let fixture: ComponentFixture<DialogPolinomiosCurvasCompresorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPolinomiosCurvasCompresorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPolinomiosCurvasCompresorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
