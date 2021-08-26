import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionTrenComponent } from './configuracion-tren.component';

describe('ConfiguracionTrenComponent', () => {
  let component: ConfiguracionTrenComponent;
  let fixture: ComponentFixture<ConfiguracionTrenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfiguracionTrenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracionTrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
