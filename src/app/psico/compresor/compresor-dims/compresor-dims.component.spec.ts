import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompresorDimsComponent } from './compresor-dims.component';

describe('CompresorDimsComponent', () => {
  let component: CompresorDimsComponent;
  let fixture: ComponentFixture<CompresorDimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompresorDimsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompresorDimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
