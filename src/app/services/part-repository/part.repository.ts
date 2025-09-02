import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';

export interface Part {
  id: number;
  name: string;
  stock: number;
  price: number;
}

@Injectable({
  providedIn: 'root',
})
export class PartRepository {
  private key = 'parts';

  constructor(private storage: StorageService) {}

  async getAll(): Promise<Part[]> {
    return (await this.storage.get<Part[]>(this.key)) || [];
  }

  async getById(id: number): Promise<Part | null> {
    const list = await this.getAll();
    return list.find((part) => part.id === id) || null;
  }

  async add(part: Omit<Part, 'id'>): Promise<Part> {
    const list = await this.getAll();
    const newPart: Part = { id: Date.now(), ...part };
    list.push(newPart);
    await this.storage.set(this.key, list);
    return newPart;
  }

  async update(updatedPart: Part): Promise<void> {
    let list = await this.getAll();
    list = list.map((part) =>
      part.id === updatedPart.id ? updatedPart : part
    );
    await this.storage.set(this.key, list);
  }

  async delete(id: number): Promise<void> {
    const list = await this.getAll();
    await this.storage.set(
      this.key,
      list.filter((part) => part.id !== id)
    );
  }
}
