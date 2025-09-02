import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { Work } from 'src/app/models /work.models';
import { GenericRepository } from 'src/app/repositories/generic.repository';

@Injectable({
  providedIn: 'root',
})
export class WorkService {
  private repository: GenericRepository<Work>;

  constructor(private storage: StorageService) {
    this.repository = new GenericRepository<Work>(storage, 'works');
  }

  async getAllWorks(): Promise<Work[]> {
    return this.repository.getAll();
  }
}
