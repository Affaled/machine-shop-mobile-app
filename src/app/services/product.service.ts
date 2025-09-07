import { Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { Product } from '../models/product.model';
import { GenericRepository } from 'src/app/repositories/generic.repository';

@Injectable({
  providedIn: 'root',
})
export class ProductService{
    private repository: GenericRepository<Product>;

    private products = signal<Product[]>([]);
    public readonly products$ = this.products.asReadonly();

    constructor(private storage: StorageService) {
      this.repository = new GenericRepository<Product>(storage, 'products');
      this.initLoad();
    }
    async getAllProduct(): Promise<Product[]> {
      return this.repository.getAll();
    }
    private async initLoad() {
      const list = await this.repository.getAll();
      this.products.set(list);
    }
    async addProduct(customer: Product): Promise<void> {
      await this.repository.add(customer);
      this.products.update(c => [...c, customer]);
    }
    async updateProduct(products: Product): Promise<void> {
      await this.repository.update(products);
      this.products.update(c => {
        const index = c.findIndex(c => c.id === products.id);
        if (index !== -1) {
          const updatedCostumers = [...c];
          updatedCostumers[index] = products;
          return updatedCostumers;
        }
        return c;
      });
    }
    async deleteProduct(id: string): Promise<void> {
      await this.repository.delete(id);
      this.products.update(c => c.filter(c => c.id !== id));
    }  
}
