import { Work } from './work.models';

export interface Order {
  id: string;
  customerId: string;
  motorcycleId: string;
  services: Work[];
  createdDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  totalPrice: number;
}
