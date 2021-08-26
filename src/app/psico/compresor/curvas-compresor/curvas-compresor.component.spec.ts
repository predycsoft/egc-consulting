import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurvasCompresorComponent } from './curvas-compresor.component';

describe('CurvasCompresorComponent', () => {
  let component: CurvasCompresorComponent;
  let fixture: ComponentFixture<CurvasCompresorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurvasCompresorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurvasCompresorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
