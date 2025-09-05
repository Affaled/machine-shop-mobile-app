import { Injectable } from '@angular/core';
import { MotorcycleRepository } from '../repositories/motorcycle.repository';
import { Motorcycle } from '../models/motorcycle.model';

@Injectable({
  providedIn: 'root',
})
export class MotorcycleService {
  constructor(private repository: MotorcycleRepository) {}

  async createMotorcycle(data: Partial<Motorcycle>): Promise<void> {
    const motorcycle: Motorcycle = {
      id: crypto.randomUUID(),
      customerId: data.customerId || 0,
      model: data.model || '',
      plate: data.plate || '',
      year: data.year || new Date().getFullYear(),
    };

    return this.repository.addMotorcycle(motorcycle);
  }
}
