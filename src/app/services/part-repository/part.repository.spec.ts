import { TestBed } from '@angular/core/testing';

import { PartRepository } from './part.repository';

describe('PartRepository', () => {
  let service: PartRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
