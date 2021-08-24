import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsicoDashboardComponent } from './psico-dashboard.component';

describe('PsicoDashboardComponent', () => {
  let component: PsicoDashboardComponent;
  let fixture: ComponentFixture<PsicoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsicoDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsicoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
