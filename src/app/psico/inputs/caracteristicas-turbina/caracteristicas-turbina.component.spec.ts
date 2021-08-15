import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaracteristicasTurbinaComponent } from './caracteristicas-turbina.component';

describe('CaracteristicasTurbinaComponent', () => {
  let component: CaracteristicasTurbinaComponent;
  let fixture: ComponentFixture<CaracteristicasTurbinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaracteristicasTurbinaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaracteristicasTurbinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
