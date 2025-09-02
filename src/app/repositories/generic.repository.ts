import { StorageService } from '../services/storage/storage.service';

export class GenericRepository<T extends { id: string }> {
  private key = 'generic';

  constructor(private storage: StorageService, private collection: string) {}

  async getAll(): Promise<T[]> {
    return (await this.storage.get<T[]>(this.key)) || [];
  }
}
