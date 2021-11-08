import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaStComponent } from './lista-st.component';

describe('ListaStComponent', () => {
  let component: ListaStComponent;
  let fixture: ComponentFixture<ListaStComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaStComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaStComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
