import { Order } from "@/types";
import { apiServer } from "./api";

export async function getOrdersServer(cookieHeader: string): Promise<Order[]> {
  try {
    const { data } = await apiServer.get<Order[]>("/orders", {
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    });
    return data;
  } catch {
    return [];
  }
}
