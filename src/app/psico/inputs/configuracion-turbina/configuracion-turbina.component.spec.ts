import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionTurbinaComponent } from './configuracion-turbina.component';

describe('ConfiguracionTurbinaComponent', () => {
  let component: ConfiguracionTurbinaComponent;
  let fixture: ComponentFixture<ConfiguracionTurbinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfiguracionTurbinaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracionTurbinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
