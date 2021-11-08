import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPeComponent } from './lista-pe.component';

describe('ListaPeComponent', () => {
  let component: ListaPeComponent;
  let fixture: ComponentFixture<ListaPeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaPeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
