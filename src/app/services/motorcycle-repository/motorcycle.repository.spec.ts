import { TestBed } from '@angular/core/testing';

import { MotorcycleRepository } from './motorcycle.repository';

describe('MotorcycleRepository', () => {
  let service: MotorcycleRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotorcycleRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
