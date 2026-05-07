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

import { MdOutlineEdit, MdDeleteForever, MdViewList } from "react-icons/md";

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
      <p className={css.stateTextError}>
        Failed to load orders: {(error as Error)?.message ?? "Unknown error"}
      </p>
    );
  }

  return (
    <div className={css.ordersWrapper}>
      <div className={css.ordersHeader}>
        <h2 className={css.headerTitle}>Orders</h2>
        <Button
          onClick={() => setIsAddOrderOpen(true)}
          className={css.addOrderButton}
        >
          + Add Order
        </Button>
      </div>

      {orders.length === 0 ? (
        <p className={css.stateText}>No orders yet</p>
      ) : (
        <ul className={css.ordersList}>
          {orders.map((order) => {
            const { products, description, _id, title, createdAt } = order;
            const productCount = products?.length ?? 0;
            const totals = getOrderTotalsByCurrency(order);
            return (
              <li key={_id} className={css.ordersItem}>
                <div className={css.orderItemHeader}>
                  <h3
                    className={css.orderItemTitle}
                    onClick={() =>
                      router.push(`/dashboard/groups?orderId=${_id}`)
                    }
                  >
                    {title}
                  </h3>
                  <p className={css.orderItemProductsCount}>
                    Products: {productCount}
                  </p>
                </div>

                <div className={css.orderItemContent}>
                  <p className={css.orderItemDescription} title={description}>
                    {description}
                  </p>

                  <div className={css.orderItemCreated}>
                    <p className={css.orderItemCreatedShort}>
                      {formatDateMonthYear(createdAt)}
                    </p>
                    <p className={css.orderItemCreatedFull}>
                      {formatDateDmy(createdAt)}
                    </p>
                  </div>

                  <p className={css.orderItemTotals}>
                    {totals.length
                      ? totals.map(([symbol, value], i) => (
                          <span
                            key={symbol}
                            className={
                              css[`orderItemTotal${symbol}` as keyof typeof css]
                            }
                          >
                            {value.toLocaleString("uk-UA")} {symbol}
                          </span>
                        ))
                      : "0"}
                  </p>

                  <div className={css.orderItemActions}>
                    <Button
                      onClick={() =>
                        router.push(`/dashboard/groups?orderId=${_id}`)
                      }
                      className={css.viewButton}
                    >
                      <MdViewList className={css.orderItemActionsIcons} />
                    </Button>
                    <Button
                      onClick={() => openEdit(order)}
                      className={css.editButton}
                    >
                      <MdOutlineEdit className={css.orderItemActionsIcons} />
                    </Button>
                    <Button
                      onClick={() => requestDeleteOrder(order)}
                      className={css.deleteButton}
                    >
                      <MdDeleteForever className={css.orderItemActionsIcons} />
                    </Button>
                  </div>
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
        <div className={css.wrapperEditModal}>
          <label className={css.labelEditModal}>
            <span className={css.labelText}>Title</span>
            <input
              className={css.inputEditTitle}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Order title"
            />
          </label>

          <label className={css.labelEditModal}>
            <span className={css.labelText}>Description</span>
            <textarea
              className={css.inputEditDescription}
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
          deletingOrder?.createdAt
            ? new Date(deletingOrder.createdAt).toLocaleString()
            : undefined
        }
        isLoading={isDeleting}
        onClose={() => setDeletingOrder(null)}
        onConfirm={confirmDeleteOrder}
      />
    </div>
  );
}
