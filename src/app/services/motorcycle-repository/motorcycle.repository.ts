import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';

export interface Motorcycle {
  id: number;
  customerId: number;
  model: string;
  plate: string;
  year: string;
}

@Injectable({
  providedIn: 'root',
})
export class MotorcycleRepository {
  private key = 'motorcycles';

  constructor(private storage: StorageService) {}

  async getAll(): Promise<Motorcycle[]> {
    return (await this.storage.get<Motorcycle[]>(this.key)) || [];
  }

  async getByCustomer(customerId: number): Promise<Motorcycle[]> {
    const list = await this.getAll();
    return list.filter((motorcycle) => motorcycle.customerId === customerId);
  }

  async add(motorcycle: Omit<Motorcycle, 'id'>): Promise<Motorcycle> {
    const list = await this.getAll();
    const newMotorcycle: Motorcycle = { id: Date.now(), ...motorcycle };
    list.push(newMotorcycle);
    await this.storage.set(this.key, list);
    return newMotorcycle;
  }

  async update(updatedMotorcycle: Motorcycle): Promise<void> {
    let list = await this.getAll();
    list = list.map((motorcycle) =>
      motorcycle.id === updatedMotorcycle.id ? updatedMotorcycle : motorcycle
    );
    await this.storage.set(this.key, list);
  }

  async delete(id: number): Promise<void> {
    const list = await this.getAll();
    await this.storage.set(
      this.key,
      list.filter((m) => m.id !== id)
    );
  }
}
