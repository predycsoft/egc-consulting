import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurvasComponent } from './curvas.component';

describe('CurvasComponent', () => {
  let component: CurvasComponent;
  let fixture: ComponentFixture<CurvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
