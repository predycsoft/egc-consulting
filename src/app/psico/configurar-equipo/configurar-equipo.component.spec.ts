import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurarEquipoComponent } from './configurar-equipo.component';

describe('ConfigurarEquipoComponent', () => {
  let component: ConfigurarEquipoComponent;
  let fixture: ComponentFixture<ConfigurarEquipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurarEquipoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurarEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
