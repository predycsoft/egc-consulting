import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompresorComponent } from './compresor.component';

describe('CompresorComponent', () => {
  let component: CompresorComponent;
  let fixture: ComponentFixture<CompresorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompresorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompresorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
