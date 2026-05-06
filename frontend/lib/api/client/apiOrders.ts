import { Order } from "@/types";
import api from "./api";

export const getOrders = async (): Promise<Order[]> => {
  const { data } = await api.get<Order[]>("/orders");
  return data;
};

export const createOrder = async (
  order: Omit<Order, "_id">,
): Promise<Order> => {
  const { data } = await api.post<Order>("/orders", order);
  return data;
};

export const updateOrder = async (
  id: string,
  order: Partial<Order>,
): Promise<Order> => {
  const { data } = await api.put<Order>(`/orders/${id}`, order);
  return data;
};

export const deleteOrder = async (id: string): Promise<{ message: string }> => {
  const { data } = await api.delete<{ message: string }>(`/orders/${id}`);
  return data;
};
