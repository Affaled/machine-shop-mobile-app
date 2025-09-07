import { Product } from './product.model';

export interface Work {
  id: string;
  name: string;
  description?: string;
  parts?: Product[];
  price: number;
}
