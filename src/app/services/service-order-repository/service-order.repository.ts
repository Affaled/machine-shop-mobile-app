import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';

export interface ServiceOrder {
  id: number;
  customerId: number;
  motorcycleId: number;
  parts: { partId: number; quantity: number }[];
  description: string;
  date: string;
  price: number;
}

@Injectable({
  providedIn: 'root',
})
export class ServiceOrderRepository {
  private key = 'serviceOrders';

  constructor(private storage: StorageService) {}

  async getAll(): Promise<ServiceOrder[]> {
    return (await this.storage.get<ServiceOrder[]>(this.key)) || [];
  }

  async getByCustomer(customerId: number): Promise<ServiceOrder[]> {
    const list = await this.getAll();
    return list.filter((order) => order.customerId === customerId);
  }

  async getByMotorcycle(motorcycleId: number): Promise<ServiceOrder[]> {
    const list = await this.getAll();
    return list.filter((order) => order.motorcycleId === motorcycleId);
  }

  async add(order: Omit<ServiceOrder, 'id'>): Promise<ServiceOrder> {
    const list = await this.getAll();
    const newOrder: ServiceOrder = { id: Date.now(), ...order };
    list.push(newOrder);
    await this.storage.set(this.key, list);
    return newOrder;
  }

  async update(updatedOrder: ServiceOrder): Promise<void> {
    let list = await this.getAll();
    list = list.map((order) =>
      order.id === updatedOrder.id ? updatedOrder : order
    );
    await this.storage.set(this.key, list);
  }
}
