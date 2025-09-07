import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readyPromise: Promise<void>;

  constructor(private storage: Storage) {
     this.readyPromise = this.init();
  }

  async ready(){
    return this.readyPromise;
  }
  private async init(): Promise<void> {
    await this.storage.create();
  }
  

  async set<T>(key: string, value: T): Promise<void> {
    await this.ready();
    await this.storage.set(key,value);
  }

  async get<T>(key: string): Promise<T | null> {
    await this.ready();
    return (await this.storage.get(key)) ?? null;
  }

  async remove(key: string): Promise<void> {
    await this.storage?.remove(key);
  }

  async clear(): Promise<void> {
    await this.ready();
    await this.storage?.clear();
  }
}
