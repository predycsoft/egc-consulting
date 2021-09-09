import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMapaCompresorComponent } from './dialog-mapa-compresor.component';

describe('DialogMapaCompresorComponent', () => {
  let component: DialogMapaCompresorComponent;
  let fixture: ComponentFixture<DialogMapaCompresorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMapaCompresorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMapaCompresorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
