import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Customer } from '../models/customer.model';
import { GenericRepository } from 'src/app/repositories/generic.repository';

@Injectable({
  providedIn: 'root',
})
export class CustomerRepository {
  private repository: GenericRepository<Customer>;

  constructor(private storage: StorageService) {
    this.repository = new GenericRepository<Customer>(storage, 'customers');
  }

  async getAllCustomers(): Promise<Customer[]> {
    return this.repository.getAll();
  }
}
