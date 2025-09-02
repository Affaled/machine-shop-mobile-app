import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class BudgetRepository {
  private key = 'budgets';

  constructor(private storage: StorageService) {}
}
