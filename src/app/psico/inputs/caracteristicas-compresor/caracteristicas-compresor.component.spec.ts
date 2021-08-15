import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaracteristicasCompresorComponent } from './caracteristicas-compresor.component';

describe('CaracteristicasCompresorComponent', () => {
  let component: CaracteristicasCompresorComponent;
  let fixture: ComponentFixture<CaracteristicasCompresorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaracteristicasCompresorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaracteristicasCompresorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
