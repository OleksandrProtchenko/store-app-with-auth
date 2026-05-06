import type { Product } from "./products";

export interface Order {
  _id?: string;
  title: string;
  date: string;
  description: string;
  products?: Product[];
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}
