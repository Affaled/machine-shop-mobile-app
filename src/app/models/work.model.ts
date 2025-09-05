import { Product } from './product.model';

export interface Work {
  id: string;
  description?: string;
  parts?: Product[];
  price: number;
}
