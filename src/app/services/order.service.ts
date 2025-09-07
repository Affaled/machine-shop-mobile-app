import { Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { Order } from '../models/order.model';
import { GenericRepository } from 'src/app/repositories/generic.repository';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private repository: GenericRepository<Order>;
  private orders = signal<Order[]>([]);
  public readonly orders$ = this.orders.asReadonly();

  constructor(private storage: StorageService) {
    this.repository = new GenericRepository<Order>(storage, 'orders');
    this.initLoad();
  }

  private async initLoad() {
    const list = await this.repository.getAll();
    this.orders.set(list);
  }

  async addOrder(order: Order): Promise<void> {
    await this.repository.add(order);
    this.orders.update(o => [...o, order]);
  }

  async updateOrder(order: Order): Promise<void> {
    await this.repository.update(order);
    this.orders.update(o => {
      const index = o.findIndex(item => item.id === order.id);
      if (index !== -1) {
        const updatedOrders = [...o];
        updatedOrders[index] = order;
        return updatedOrders;
      }
      return o;
    });
  }

  async deleteOrder(id: string): Promise<void> {
    await this.repository.delete(id);
    this.orders.update(o => o.filter(item => item.id !== id));
  }

  async getById(id: string): Promise<Order | null> {
    return await this.repository.getById(id);
  }

  async getAll(): Promise<Order[]> {
    return await this.repository.getAll();
  }
}