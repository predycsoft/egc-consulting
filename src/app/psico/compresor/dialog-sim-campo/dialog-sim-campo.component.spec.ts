import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSimCampoComponent } from './dialog-sim-campo.component';

describe('DialogSimCampoComponent', () => {
  let component: DialogSimCampoComponent;
  let fixture: ComponentFixture<DialogSimCampoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSimCampoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSimCampoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
