import { StorageService } from '../services/storage.service';

export class GenericRepository<T extends { id: string }> {
  private key: string;

  constructor(private storage: StorageService, private collection: string) {
    this.key = `repository_${collection}`;
  }

  async getAll(): Promise<T[]> {
    return (await this.storage.get<T[]>(this.key)) || [];
  }

  async getById(id: string): Promise<T | null> {
    const items = await this.getAll();
    return items.find((item) => item.id === id) || null;
  }

  async add(item: T): Promise<void> {
    const items = await this.getAll();
    if (items.some((existingItem) => existingItem.id === item.id)) {
      throw new Error(`Item with id ${item.id} already exists.`);
    }
    items.push(item);
    await this.storage.set(this.key, items);
  }

  async update(item: T): Promise<void> {
    const items = await this.getAll();
    const index = items.findIndex(
      (existingItem) => existingItem.id === item.id
    );
    if (index === -1) {
      throw new Error(`Item with id ${item.id} not found.`);
    }
    items[index] = item;
    await this.storage.set(this.key, items);
  }

  async delete(id: string): Promise<void> {
    const items = await this.getAll();
    const filteredItems = items.filter((item) => item.id !== id);
    if (items.length === filteredItems.length) {
      throw new Error(`Item with id ${id} not found.`);
    }
    await this.storage.set(this.key, filteredItems);
  }

  async exists(id: string): Promise<boolean> {
    const items = await this.getAll();
    return items.some((item) => item.id === id);
  }

  async clear(): Promise<void> {
    await this.storage.set(this.key, []);
  }

  async count(): Promise<number> {
    const items = await this.getAll();
    return items.length;
  }
}
