import { Service } from './work.models';

export interface Order {
  id: string;
  customerId: string;
  motorcycleId: string;
  services: Service[];
  createdDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  totalPrice: number;
}
