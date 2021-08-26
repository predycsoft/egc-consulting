import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapasCompresorComponent } from './mapas-compresor.component';

describe('MapasCompresorComponent', () => {
  let component: MapasCompresorComponent;
  let fixture: ComponentFixture<MapasCompresorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapasCompresorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapasCompresorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
