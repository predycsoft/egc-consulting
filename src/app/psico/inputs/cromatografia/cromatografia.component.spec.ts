import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CromatografiaComponent } from './cromatografia.component';

describe('CromatografiaComponent', () => {
  let component: CromatografiaComponent;
  let fixture: ComponentFixture<CromatografiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CromatografiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CromatografiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
