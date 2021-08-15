import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurbinaComponent } from './turbina.component';

describe('TurbinaComponent', () => {
  let component: TurbinaComponent;
  let fixture: ComponentFixture<TurbinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TurbinaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TurbinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
