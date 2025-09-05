import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class GenericRepository<T extends { id: string }> {
  private key = 'generic';

  constructor(private storage: StorageService, private collection: string) {}

  async getAll(): Promise<T[]> {
    return (await this.storage.get<T[]>(this.key)) || [];
  }

  async getById(id: string): Promise<T | null> {
    const items = await this.getAll();
    return items.find((item) => item.id === id) || null;
  }
}
