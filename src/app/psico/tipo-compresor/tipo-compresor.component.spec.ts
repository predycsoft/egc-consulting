import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoCompresorComponent } from './tipo-compresor.component';

describe('TipoCompresorComponent', () => {
  let component: TipoCompresorComponent;
  let fixture: ComponentFixture<TipoCompresorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoCompresorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoCompresorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
