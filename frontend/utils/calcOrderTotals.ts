import { Order } from "@/types";

export function getOrderTotalsByCurrency(order: Order) {
  const totals = new Map<string, number>();

  (order.products ?? []).forEach((product) => {
    (product.price ?? []).forEach((p) => {
      const prev = totals.get(p.symbol) ?? 0;
      totals.set(p.symbol, prev + Number(p.value || 0));
    });
  });

  return Array.from(totals.entries());
}
