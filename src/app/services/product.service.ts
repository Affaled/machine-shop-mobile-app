import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Product } from '../models/product.model';
import { GenericRepository } from 'src/app/repositories/generic.repository';

@Injectable({
  providedIn: 'root',
})
export class ProductService{
  private repository: GenericRepository<Product>;

  constructor(private storage: StorageService) {
    this.repository = new GenericRepository<Product>(storage, 'products');
  }

  async getAllProducts(): Promise<Product[]> {
    return this.repository.getAll();
  }
}
