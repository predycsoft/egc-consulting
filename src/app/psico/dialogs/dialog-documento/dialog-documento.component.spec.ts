import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDocumentoComponent } from './dialog-documento.component';

describe('DialogDocumentoComponent', () => {
  let component: DialogDocumentoComponent;
  let fixture: ComponentFixture<DialogDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDocumentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
