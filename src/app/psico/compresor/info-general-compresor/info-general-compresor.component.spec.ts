import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoGeneralCompresor } from './info-general-compresor.component';

describe('InfoGeneralCompresorComponent', () => {
  let component: InfoGeneralCompresor;
  let fixture: ComponentFixture<InfoGeneralCompresor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoGeneralCompresor ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoGeneralCompresor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
