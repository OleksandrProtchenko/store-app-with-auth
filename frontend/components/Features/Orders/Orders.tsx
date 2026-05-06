"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Button from "../../UI/Button/Button";
import Modal from "../../UI/Modal/Modal";
import AddOrderModal from "../AddOrder/AddOrder";
import { getOrders } from "@/lib/api/client/apiOrders";
import {
  useDeleteOrder,
  useUpdateOrder,
} from "@/lib/api/mutation/ordersMutation";
import { Order } from "@/types";
import css from "./Orders.module.css";
import DeleteConfirmModal from "../../UI/DeleteConfirmModal/DeleteConfirmModal";
import { useRouter } from "next/navigation";
import { queryKeys } from "@/types/queryKeys";
import { getOrderTotalsByCurrency } from "@/utils/calcOrderTotals";
import { formatDateDmy, formatDateMonthYear } from "@/utils/formatDate";

export default function Orders() {
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);

  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.orders,
    queryFn: getOrders,
  });

  const { mutate: removeOrder, isPending: isDeleting } = useDeleteOrder();
  const { mutate: editOrder, isPending: isUpdating } = useUpdateOrder();

  const orders = useMemo(() => data ?? [], [data]);

  const openEdit = (order: Order) => {
    setEditingOrder(order);
    setTitle(order.title ?? "");
    setDescription(order.description ?? "");
  };

  const closeEdit = () => {
    setEditingOrder(null);
    setTitle("");
    setDescription("");
  };

  const handleUpdate = () => {
    if (!editingOrder?._id) return;
    if (!title.trim() || !description.trim()) return;

    editOrder(
      {
        id: editingOrder._id,
        data: { title: title.trim(), description: description.trim() },
      },
      {
        onSuccess: closeEdit,
      },
    );
  };

  const requestDeleteOrder = (order: Order) => {
    setDeletingOrder(order);
  };

  const confirmDeleteOrder = () => {
    if (!deletingOrder?._id) return;
    removeOrder(deletingOrder._id, {
      onSuccess: () => setDeletingOrder(null),
    });
  };

  if (isLoading) {
    return <p className={css.stateText}>Loading orders...</p>;
  }

  if (isError) {
    return (
      <p className={css.stateText}>
        Failed to load orders: {(error as Error)?.message ?? "Unknown error"}
      </p>
    );
  }

  return (
    <div className={css.wrapper}>
      <div className={css.headerRow}>
        <h2 className={css.title}>Orders</h2>
        <Button
          onClick={() => setIsAddOrderOpen(true)}
          className={css.addButton}
        >
          + Add Order
        </Button>
      </div>

      {orders.length === 0 ? (
        <p className={css.stateText}>No orders yet</p>
      ) : (
        <ul className={css.list}>
          {orders.map((order) => {
            const productCount = order.products?.length ?? 0;
            const totals = getOrderTotalsByCurrency(order);
            return (
              <li key={order._id} className={css.card}>
                <div className={css.cardTop}>
                  <h3 className={css.orderTitle}>{order.title}</h3>
                  <span className={css.badge}>Products: {productCount}</span>
                </div>

                <p className={css.description}>{order.description}</p>

                <p className={css.meta}>
                  Created: {formatDateDmy(order.date)} /{" "}
                  {formatDateMonthYear(order.date)}
                </p>

                <p className={css.meta}>
                  Total:{" "}
                  {totals.length
                    ? totals
                        .map(
                          ([symbol, value]) =>
                            `${value.toLocaleString("uk-UA")} ${symbol}`,
                        )
                        .join(" / ")
                    : "-"}
                </p>

                <div className={css.actions}>
                  <Button
                    onClick={() =>
                      router.push(`/dashboard/groups?orderId=${order._id}`)
                    }
                    className={css.viewButton}
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => openEdit(order)}
                    className={css.editButton}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => requestDeleteOrder(order)}
                    className={css.deleteButton}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <AddOrderModal
        isOpen={isAddOrderOpen}
        onClose={() => setIsAddOrderOpen(false)}
      />

      <Modal
        isOpen={Boolean(editingOrder)}
        onClose={closeEdit}
        title="Edit Order"
        onConfirm={handleUpdate}
        confirmText={isUpdating ? "Saving..." : "Save"}
        isLoading={isUpdating}
      >
        <div className={css.form}>
          <label className={css.label}>
            Title
            <input
              className={css.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Order title"
            />
          </label>

          <label className={css.label}>
            Description
            <textarea
              className={css.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Order description"
            />
          </label>
        </div>
      </Modal>
      <DeleteConfirmModal
        isOpen={Boolean(deletingOrder)}
        entityType="order"
        title={deletingOrder?.title ?? ""}
        subtitle={deletingOrder?.description ?? ""}
        meta={
          deletingOrder?.date
            ? new Date(deletingOrder.date).toLocaleString()
            : undefined
        }
        isLoading={isDeleting}
        onClose={() => setDeletingOrder(null)}
        onConfirm={confirmDeleteOrder}
      />
    </div>
  );
}
