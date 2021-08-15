import { TestBed } from '@angular/core/testing';

import { DimensionesService } from './dimensiones.service';

describe('DimensionesService', () => {
  let service: DimensionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DimensionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
