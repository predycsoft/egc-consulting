import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPolinomiosCurvasComponent } from './dialog-polinomios-curvas.component';

describe('DialogPolinomiosCurvasComponent', () => {
  let component: DialogPolinomiosCurvasComponent;
  let fixture: ComponentFixture<DialogPolinomiosCurvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPolinomiosCurvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPolinomiosCurvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
