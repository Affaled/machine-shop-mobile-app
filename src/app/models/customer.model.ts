import { Motorcycle } from './motorcycle.model';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  motorcycles?: Motorcycle[];
}
