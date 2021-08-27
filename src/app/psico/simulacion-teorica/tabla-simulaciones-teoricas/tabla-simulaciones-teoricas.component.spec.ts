import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaSimulacionesTeoricasComponent } from './tabla-simulaciones-teoricas.component';

describe('TablaSimulacionesTeoricasComponent', () => {
  let component: TablaSimulacionesTeoricasComponent;
  let fixture: ComponentFixture<TablaSimulacionesTeoricasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaSimulacionesTeoricasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaSimulacionesTeoricasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
