import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFracasoComponent } from './dialog-fracaso.component';

describe('DialogFracasoComponent', () => {
  let component: DialogFracasoComponent;
  let fixture: ComponentFixture<DialogFracasoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogFracasoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFracasoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
