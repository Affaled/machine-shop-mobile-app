import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Work } from '../models/work.model';
import { GenericRepository } from 'src/app/repositories/generic.repository';

@Injectable({
  providedIn: 'root',
})
export class WorkRepository {
  private repository: GenericRepository<Work>;

  constructor(private storage: StorageService) {
    this.repository = new GenericRepository<Work>(storage, 'works');
  }

  async getAllWorks(): Promise<Work[]> {
    return this.repository.getAll();
  }
}
