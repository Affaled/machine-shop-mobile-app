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
}
