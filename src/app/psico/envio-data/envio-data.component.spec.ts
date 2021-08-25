import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvioDataComponent } from './envio-data.component';

describe('EnvioDataComponent', () => {
  let component: EnvioDataComponent;
  let fixture: ComponentFixture<EnvioDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvioDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvioDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
