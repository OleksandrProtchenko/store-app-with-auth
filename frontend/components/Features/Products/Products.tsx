"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Order, Product } from "@/types";
import { getOrders } from "@/lib/api/client/apiOrders";
import { useDeleteProduct } from "@/lib/api/mutation/productsMutation";

import css from "./Products.module.css";
import AddProductModal from "../AddProduct/AddProduct";
import DeleteConfirmModal from "../../UI/DeleteConfirmModal/DeleteConfirmModal";
import Button from "../../UI/Button/Button";
import { queryKeys } from "@/types/queryKeys";
import { formatDateLong, formatDateShort } from "@/utils/formatDate";

interface ProductsProps {
  order?: Order;
}

interface ProductRow extends Product {
  orderId: string;
  orderTitle: string;
}

export default function Products({ order }: ProductsProps) {
  const isOrderMode = Boolean(order);

  const { data } = useQuery({
    queryKey: queryKeys.orders,
    queryFn: getOrders,
    enabled: !isOrderMode,
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<{
    product: ProductRow;
  } | null>(null);

  const [selectedType, setSelectedType] = useState<string>("all");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!selectRef.current) return;
      if (!selectRef.current.contains(e.target as Node)) setIsSelectOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const allProducts = useMemo<ProductRow[]>(() => {
    if (isOrderMode && order?._id) {
      return (order.products ?? []).map((p: Product) => ({
        ...p,
        orderId: order._id as string,
        orderTitle: order.title,
      }));
    }

    const orders = data ?? [];
    return orders.flatMap((o) =>
      (o.products ?? []).map((p: Product) => ({
        ...p,
        orderId: o._id as string,
        orderTitle: o.title,
      })),
    );
  }, [data, isOrderMode, order]);

  const types = useMemo(() => {
    const unique = Array.from(
      new Set(allProducts.map((p) => p.type).filter(Boolean)),
    );
    return ["all", ...unique];
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    if (selectedType === "all") return allProducts;
    return allProducts.filter((p) => p.type === selectedType);
  }, [allProducts, selectedType]);

  const { mutate: removeProduct, isPending: isDeleting } = useDeleteProduct();

  const confirmDeleteProduct = () => {
    if (!deletingProduct?.product._id) return;
    removeProduct(
      {
        orderId: deletingProduct.product.orderId,
        productId: deletingProduct.product._id,
      },
      { onSuccess: () => setDeletingProduct(null) },
    );
  };

  const pageTitle = isOrderMode ? (order?.title ?? "Products") : "All Products";

  return (
    <div className={css.wrapper}>
      <div className={css.header}>
        <h3 className={css.title}>{pageTitle}</h3>

        <div className={css.headerRight}>
          {!isOrderMode ? (
            <div className={css.selectWrap} ref={selectRef}>
              <button
                type="button"
                className={css.selectButton}
                onClick={() => setIsSelectOpen((prev) => !prev)}
              >
                {selectedType === "all" ? "All types" : selectedType}
                <span className={css.selectArrow}>▾</span>
              </button>

              {isSelectOpen ? (
                <ul className={css.selectMenu}>
                  {types.map((type) => (
                    <li key={type}>
                      <button
                        type="button"
                        className={css.selectOption}
                        onClick={() => {
                          setSelectedType(type);
                          setIsSelectOpen(false);
                        }}
                      >
                        {type === "all" ? "All types" : type}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          {isOrderMode && order?._id ? (
            <Button
              onClick={() => setIsAddOpen(true)}
              className={css.addButton}
            >
              + Add Product
            </Button>
          ) : null}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p className={css.empty}>Products not found</p>
      ) : (
        <ul className={css.list}>
          {filteredProducts.map((product) => (
            <li key={product._id} className={css.card}>
              <div className={css.dot} />

              <div className={css.info}>
                <p className={css.productTitle}>{product.title}</p>
                <p className={css.sub}>SN-{product.serialNumber}</p>
                {!isOrderMode ? (
                  <p className={css.orderName}>Order: {product.orderTitle}</p>
                ) : null}
              </div>

              <div className={css.type}>{product.type}</div>

              <div className={css.guarantee}>
                <span className={css.guaranteeLabel}>Guarantee:</span>
                <span>
                  {formatDateShort(product.guarantee.start)} /{" "}
                  {formatDateLong(product.guarantee.start)}
                </span>
                <span>
                  {formatDateShort(product.guarantee.end)} /{" "}
                  {formatDateLong(product.guarantee.end)}
                </span>
              </div>

              <div className={css.prices}>
                {product.price.map((p, i) => (
                  <span
                    key={i}
                    className={
                      p.isDefault
                        ? `${css.price} ${css.priceDefault}`
                        : css.price
                    }
                  >
                    {p.value} {p.symbol}
                  </span>
                ))}
              </div>

              <Button
                onClick={() => setDeletingProduct({ product })}
                className={css.deleteButton}
              >
                🗑
              </Button>
            </li>
          ))}
        </ul>
      )}

      {isOrderMode && order?._id ? (
        <AddProductModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          orderId={order._id}
        />
      ) : null}

      <DeleteConfirmModal
        isOpen={Boolean(deletingProduct)}
        entityType="product"
        title={deletingProduct?.product.title ?? ""}
        subtitle={`${deletingProduct?.product.type ?? ""} · SN-${deletingProduct?.product.serialNumber ?? ""}`}
        meta={
          deletingProduct
            ? deletingProduct.product.price
                .map((p) => `${p.value} ${p.symbol}`)
                .join(" / ")
            : undefined
        }
        isLoading={isDeleting}
        onClose={() => setDeletingProduct(null)}
        onConfirm={confirmDeleteProduct}
      />
    </div>
  );
}
