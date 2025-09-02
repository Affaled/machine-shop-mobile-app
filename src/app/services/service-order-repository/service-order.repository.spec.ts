import { TestBed } from '@angular/core/testing';

import { ServiceOrderRepository } from './service-order.repository';

describe('ServiceOrderRepository', () => {
  let service: ServiceOrderRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceOrderRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
