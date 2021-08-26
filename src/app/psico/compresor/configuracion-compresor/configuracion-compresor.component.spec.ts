import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionCompresorComponent } from './configuracion-compresor.component';

describe('ConfiguracionCompresorComponent', () => {
  let component: ConfiguracionCompresorComponent;
  let fixture: ComponentFixture<ConfiguracionCompresorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfiguracionCompresorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracionCompresorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
