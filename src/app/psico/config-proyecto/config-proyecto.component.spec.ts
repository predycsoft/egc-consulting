import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigProyectoComponent } from './config-proyecto.component';

describe('ConfigProyectoComponent', () => {
  let component: ConfigProyectoComponent;
  let fixture: ComponentFixture<ConfigProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigProyectoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
