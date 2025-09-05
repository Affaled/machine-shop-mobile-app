import { Product } from './product.model';
import { Work } from './work.model';

export interface Order {
  id: string;
  customerId: string;
  motorcycleId: string;
  services?: Work[];
  products?: Product[];
  createdDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  totalPrice: number;
}
