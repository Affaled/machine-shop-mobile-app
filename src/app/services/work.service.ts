import { Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { Work } from '../models/work.model';
import { GenericRepository } from 'src/app/repositories/generic.repository';

@Injectable({
  providedIn: 'root',
})
export class WorkService {
  private repository: GenericRepository<Work>;

  private works = signal<Work[]>([]);
  public readonly work$ = this.works.asReadonly();

  constructor(private storage: StorageService) {
    this.repository = new GenericRepository<Work>(storage, 'works');
    this.initLoad();
  }

  private async initLoad() {
    const list = await this.repository.getAll();
    this.works.set(list);
  }

  async addWork(work: Work): Promise<void> {
    await this.repository.add(work);
    this.works.update((w) => [...w, work]);
  }
  async updateWork(work: Work): Promise<void> {
    await this.repository.update(work);
    this.works.update((w) => {
      const index = w.findIndex((w) => w.id === work.id);
      if (index !== -1) {
        const updatedWorks = [...w];
        updatedWorks[index] = work;
        return updatedWorks;
      }
      return w;
    });
  }

  async deleteWork(id: string): Promise<void> {
    await this.repository.delete(id);
    this.works.update((w) => w.filter((w) => w.id !== id));
  }
}
