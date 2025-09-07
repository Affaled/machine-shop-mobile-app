import { Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { Customer } from '../models/customer.model';
import { GenericRepository } from 'src/app/repositories/generic.repository';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private repository: GenericRepository<Customer>;


  private customers = signal<Customer[]>([]);
  public readonly customer$ = this.customers.asReadonly();


  constructor(private storage: StorageService) {
    this.repository = new GenericRepository<Customer>(storage, 'customers');
    this.initLoad();
  }
  
  private async initLoad() {
    const list = await this.repository.getAll();
    this.customers.set(list);
  }

  async addCustomer(customer: Customer): Promise<void> {
    await this.repository.add(customer);
    this.customers.update(c => [...c, customer]);
  }
  async updateCustomer(customer: Customer): Promise<void> {
    await this.repository.update(customer);
    this.customers.update(c => {
      const index = c.findIndex(c => c.id === customer.id);
      if (index !== -1) {
        const updatedCostumers = [...c];
        updatedCostumers[index] = customer;
        return updatedCostumers;
      }
      return c;
    });
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.repository.delete(id);
    this.customers.update(c => c.filter(c => c.id !== id));
  }  
}
