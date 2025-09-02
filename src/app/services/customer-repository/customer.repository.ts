import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';

export interface Customer {
  id: number;
  name: string;
  phone: string;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerRepository {
  private key = 'customers';

  constructor(private storage: StorageService) {}

  async getAll(): Promise<Customer[]> {
    return (await this.storage.get<Customer[]>(this.key)) || [];
  }

  async getById(id: number): Promise<Customer | null> {
    const customers = await this.getAll();
    return customers.find((customer) => customer.id === id) || null;
  }

  async add(customer: Omit<Customer, 'id'>): Promise<Customer> {
    const customers = await this.getAll();
    const newCustomer: Customer = { id: Date.now(), ...customer };
    customers.push(newCustomer);
    await this.storage.set(this.key, customers);
    return newCustomer;
  }

  async update(updatedCustomer: Customer): Promise<void> {
    let customers = await this.getAll();
    customers = customers.map((customer) =>
      customer.id === updatedCustomer.id ? updatedCustomer : customer
    );
    await this.storage.set(this.key, customers);
  }

  async delete(id: number): Promise<void> {
    const customers = await this.getAll();
    await this.storage.set(
      this.key,
      customers.filter((customer) => customer.id !== id)
    );
  }
}
