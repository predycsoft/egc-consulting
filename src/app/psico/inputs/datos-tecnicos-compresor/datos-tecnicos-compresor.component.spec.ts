import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosTecnicosCompresorComponent } from './datos-tecnicos-compresor.component';

describe('DatosTecnicosCompresorComponent', () => {
  let component: DatosTecnicosCompresorComponent;
  let fixture: ComponentFixture<DatosTecnicosCompresorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosTecnicosCompresorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosTecnicosCompresorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
