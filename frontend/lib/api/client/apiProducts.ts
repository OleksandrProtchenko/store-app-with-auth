import { Order, Product } from "@/types";
import api from "./api";

export const addProductToOrder = async (
  orderId: string,
  product: Omit<Product, "_id">,
): Promise<Order> => {
  const { data } = await api.post<Order>(
    `/orders/${orderId}/products`,
    product,
  );
  return data;
};

export const deleteProductFromOrder = async (
  orderId: string,
  productId: string,
): Promise<Order> => {
  const { data } = await api.delete<Order>(
    `/orders/${orderId}/products/${productId}`,
  );
  return data;
};
