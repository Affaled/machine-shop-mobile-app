import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Motorcycle } from '../models/motorcycle.model';
import { GenericRepository } from 'src/app/repositories/generic.repository';

@Injectable({
  providedIn: 'root',
})
export class MotorcycleRepository {
  private repository: GenericRepository<Motorcycle>;

  constructor(private storage: StorageService) {
    this.repository = new GenericRepository<Motorcycle>(storage, 'motorcycles');
  }

  async getAllMotorcycles(): Promise<Motorcycle[]> {
    return this.repository.getAll();
  }

  async createMotorcycle(data: Partial<Motorcycle>): Promise<void> {
    const motorcycle: Motorcycle = {
      id: crypto.randomUUID(),
      customerId: data.customerId || 0,
      model: data.model || '',
      plate: data.plate || '',
      year: data.year || new Date().getFullYear(),
    };

    return this.repository.add(motorcycle);
  }

  async deleteMotorcycle(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
