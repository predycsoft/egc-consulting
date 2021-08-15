import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdimensionalizacionComponent } from './adimensionalizacion.component';

describe('AdimensionalizacionComponent', () => {
  let component: AdimensionalizacionComponent;
  let fixture: ComponentFixture<AdimensionalizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdimensionalizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdimensionalizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
