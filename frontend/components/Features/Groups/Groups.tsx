"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getOrders } from "@/lib/api/client/apiOrders";
import { Order } from "@/types";
import Products from "../Products/Products";
import css from "./Groups.module.css";
import { queryKeys } from "@/types/queryKeys";
import Loader from "@/components/UI/Loader/Loader";
import { IoMdReorder } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";

export default function Groups() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId");
  const router = useRouter();
  const pathname = usePathname();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isProductsOpen, setIsProductsOpen] = useState(true);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.orders,
    queryFn: getOrders,
  });

  const orders = data ?? [];
  const isPanelInitializing =
    isProductsOpen && orders.length > 0 && !selectedOrder;

  useEffect(() => {
    if (!orders.length || !isProductsOpen) return;

    if (initialOrderId) {
      const found = orders.find((o) => o._id === initialOrderId);
      if (found) {
        setSelectedOrder((prev) => (prev?._id === found._id ? prev : found));
      }
      return;
    }

    // Важно: если уже выбран ордер локально, не подставляем первый
    if (selectedOrder?._id) return;

    const firstOrder = orders[0];
    const firstOrderId = firstOrder?._id;
    if (!firstOrder || !firstOrderId) return;

    setSelectedOrder((prev) =>
      prev?._id === firstOrderId ? prev : firstOrder,
    );

    const params = new URLSearchParams(searchParams.toString());
    if (params.get("orderId") !== firstOrderId) {
      params.set("orderId", firstOrderId);
      router.replace(pathname + "?" + params.toString(), { scroll: false });
    }
  }, [
    orders,
    initialOrderId,
    isProductsOpen,
    selectedOrder?._id,
    pathname,
    router,
    searchParams,
  ]);

  useEffect(() => {
    if (!selectedOrder?._id || !orders.length) return;
    const updated = orders.find((o) => o._id === selectedOrder._id);
    if (updated) setSelectedOrder(updated);
  }, [orders, selectedOrder?._id]);

  const handleSelectOrder = (order: Order) => {
    if (!order?._id) return;

    // Сначала обновляем локальный state, чтобы не было мигания
    setSelectedOrder(order);
    setIsProductsOpen(true);

    const currentOrderId = searchParams.get("orderId");
    if (currentOrderId !== order._id) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("orderId", order._id);
      router.replace(pathname + "?" + params.toString(), { scroll: false });
    }
  };

  const handleCloseProducts = () => {
    setIsProductsOpen(false);
    setSelectedOrder(null);

    const params = new URLSearchParams(searchParams.toString());
    if (params.has("orderId")) {
      params.delete("orderId");
      const next = params.toString();
      router.replace(next ? `${pathname}?${next}` : pathname, {
        scroll: false,
      });
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className={css.layout}>
      <ul className={css.orderList}>
        {orders.map((order) => {
          const isActive = selectedOrder?._id === order._id;
          return (
            <li
              key={order._id}
              className={`${css.orderItem} ${isActive ? css.active : ""}`}
              onClick={() => handleSelectOrder(order)}
            >
              <div className={css.orderIcon}>
                <IoMdReorder />
              </div>
              <div className={css.orderInfo}>
                <p className={css.orderCount}>
                  {order.products?.length ?? 0}
                  <span> Products</span>
                </p>
                <p className={css.orderDate}>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("uk-UA")
                    : "-"}
                </p>
              </div>
              {isActive && (
                <div className={css.arrow}>
                  <IoIosArrowForward />
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className={css.productsPanel}>
        {!isPanelInitializing && selectedOrder && isProductsOpen ? (
          <button
            type="button"
            className={css.closePanelButton}
            onClick={handleCloseProducts}
            aria-label="Close products panel"
          >
            <IoCloseOutline className={css.modalCloseBtnIcons} />
          </button>
        ) : null}
        {isPanelInitializing ? (
          <Loader />
        ) : selectedOrder && isProductsOpen ? (
          <Products key={selectedOrder._id} order={selectedOrder} />
        ) : (
          <p className={css.selectOrderText}>Select an order</p>
        )}
      </div>
    </div>
  );
}
