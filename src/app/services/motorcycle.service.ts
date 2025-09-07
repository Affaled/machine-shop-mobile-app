import { Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { Motorcycle } from '../models/motorcycle.model';
import { GenericRepository } from 'src/app/repositories/generic.repository';

@Injectable({ providedIn: 'root' })
export class MotorcycleService {
  private repository: GenericRepository<Motorcycle>;

  private motorcycles = signal<Motorcycle[]>([]);
  public readonly motorcycles$ = this.motorcycles.asReadonly();

  constructor(private storage: StorageService) {
    this.repository = new GenericRepository<Motorcycle>(storage, 'motorcycles');
    this.initLoad();
  }

  private async initLoad() {
    const list = await this.repository.getAll();
    this.motorcycles.set(list);
  }

  getById(id: string) { return this.repository.getById(id); }


  async createMotorcycle(data: Motorcycle): Promise<void> {
    await this.repository.add(data);
    this.motorcycles.update(list => [...list, data]);

  }

   async updateMotorcycle(motorcycle: Motorcycle): Promise<void> {
    await this.repository.update(motorcycle);

    this.motorcycles.update(m => {
      const index = m.findIndex(m => m.id === motorcycle.id);
      if (index !== -1) {
        const updatedProducts = [...m];
        updatedProducts[index] = motorcycle;
        return updatedProducts;
      }
      return m;
    });
  }


  async deleteMotorcycle(id: string): Promise<void> {
    await this.repository.delete(id);

    this.motorcycles.update(list => list.filter(m => m.id !== id));
  }
}
