import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { Product } from 'src/app/models /product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductRepository {
  private key = 'products';

  constructor(private storage: StorageService) {}

  async getAll(): Promise<Product[]> {
    return (await this.storage.get<Product[]>(this.key)) || [];
  }

  async getById(id: string): Promise<Product | null> {
    const list = await this.getAll();
    return list.find((product) => product.id === id) || null;
  }

  async add(product: Omit<Product, 'id'>): Promise<Product> {
    const list = await this.getAll();
    const newProduct: Product = { id: crypto.randomUUID(), ...product };
    list.push(newProduct);
    await this.storage.set(this.key, list);
    return newProduct;
  }

  async update(updatedProduct: Product): Promise<void> {
    let list = await this.getAll();
    list = list.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product
    );
    await this.storage.set(this.key, list);
  }

  async delete(id: string): Promise<void> {
    const list = await this.getAll();
    await this.storage.set(
      this.key,
      list.filter((product) => product.id !== id)
    );
  }
}
