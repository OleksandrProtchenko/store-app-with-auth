"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getOrders } from "@/lib/api/client/apiOrders";
import { Order } from "@/types";
import Products from "../Products/Products";
import css from "./Groups.module.css";
import { queryKeys } from "@/types/queryKeys";

export default function Groups() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.orders,
    queryFn: getOrders,
  });

  const orders = data ?? [];

  useEffect(() => {
    if (!orders.length) return;

    if (initialOrderId) {
      const found = orders.find((o) => o._id === initialOrderId);
      if (found) {
        setSelectedOrder(found);
        return;
      }
    }

    setSelectedOrder(orders[0]);
  }, [orders, initialOrderId]);

  useEffect(() => {
    if (!selectedOrder?._id || !orders.length) return;
    const updated = orders.find((o) => o._id === selectedOrder._id);
    if (updated) setSelectedOrder(updated);
  }, [data]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className={css.layout}>
      <ul className={css.orderList}>
        {orders.map((order) => {
          const isActive = selectedOrder?._id === order._id;
          return (
            <li
              key={order._id}
              className={`${css.orderItem} ${isActive ? css.active : ""}`}
              onClick={() => setSelectedOrder(order)}
            >
              <div className={css.orderIcon}>☰</div>
              <div className={css.orderInfo}>
                <p className={css.orderCount}>
                  {order.products?.length ?? 0}
                  <span> Products</span>
                </p>
                <p className={css.orderDate}>
                  {order.date
                    ? new Date(order.date).toLocaleDateString("uk-UA")
                    : "-"}
                </p>
              </div>
              {isActive && <div className={css.arrow}>›</div>}
            </li>
          );
        })}
      </ul>

      <div className={css.productsPanel}>
        {selectedOrder ? (
          <Products order={selectedOrder} />
        ) : (
          <p>Select an order</p>
        )}
      </div>
    </div>
  );
}
