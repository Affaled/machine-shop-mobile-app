import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Order } from '../models/order.model';
import { GenericRepository } from 'src/app/repositories/generic.repository';

@Injectable({
  providedIn: 'root',
})
export class OrderRepository {
  private repository: GenericRepository<Order>;

  constructor(private storage: StorageService) {
    this.repository = new GenericRepository<Order>(storage, 'orders');
  }

  async getAllOrders(): Promise<Order[]> {
    return this.repository.getAll();
  }
}
