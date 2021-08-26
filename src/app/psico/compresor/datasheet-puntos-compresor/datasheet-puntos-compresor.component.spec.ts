import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasheetPuntosCompresorComponent } from './datasheet-puntos-compresor.component';

describe('CaracteristicasCompresorComponent', () => {
  let component: DatasheetPuntosCompresorComponent;
  let fixture: ComponentFixture<DatasheetPuntosCompresorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasheetPuntosCompresorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasheetPuntosCompresorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
