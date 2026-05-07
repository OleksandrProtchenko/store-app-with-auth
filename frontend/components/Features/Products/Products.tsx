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
import { IoMdArrowDropdown } from "react-icons/io";
import { MdOutlineDeleteForever } from "react-icons/md";

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
    <div className={css.productsWrapper}>
      <div className={css.productsHeader}>
        <h3 className={css.productsHeaderTitle}>{pageTitle}</h3>

        <div className={css.productsHeaderFilters}>
          {!isOrderMode ? (
            <div className={css.filtersWrapper} ref={selectRef}>
              <Button
                type="button"
                className={css.selectFilterButton}
                onClick={() => setIsSelectOpen((prev) => !prev)}
              >
                {selectedType === "all" ? "All types" : selectedType}
                <span>
                  <IoMdArrowDropdown
                    className={
                      !isSelectOpen
                        ? css.selectArrow
                        : `${css.selectArrow} ${css.selectArrowOpen}`
                    }
                  />
                </span>
              </Button>

              {isSelectOpen ? (
                <ul className={css.selectFiltersList}>
                  {types.map((type) => (
                    <li key={type} className={css.selectFiltersItem}>
                      <Button
                        type="button"
                        className={css.filtersItemType}
                        onClick={() => {
                          setSelectedType(type);
                          setIsSelectOpen(false);
                        }}
                      >
                        {type === "all" ? "All types" : type}
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          {isOrderMode && order?._id ? (
            <Button
              onClick={() => setIsAddOpen(true)}
              className={css.addProductButton}
            >
              + Add Product
            </Button>
          ) : null}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p className={css.emptyProductsText}>Products not found</p>
      ) : (
        <ul className={css.productsList}>
          {filteredProducts.map((product) => (
            <li key={product._id} className={css.productItem}>
              <div className={css.productTitleWrapper}>
                <div className={css.productTitleInfo}>
                  <p className={css.productTitle}>{product.title}</p>
                  {!isOrderMode ? (
                    <p className={css.productOrderName}>
                      Order: {product.orderTitle}
                    </p>
                  ) : null}
                </div>

                <div className={css.productType}>Type: {product.type}</div>
              </div>

              <div className={css.productDetailsWrapper}>
                <div className={css.productGuarantee}>
                  <div className={css.productGuaranteeDates}>
                    <span>{formatDateShort(product.guarantee.start)}</span>
                    <span>{formatDateShort(product.guarantee.end)}</span>
                  </div>
                </div>

                <div className={css.productPrices}>
                  {product.price.map((p, i) => (
                    <span
                      key={i}
                      className={
                        p.isDefault
                          ? `${css.productItemTotalUSD} ${css.productItemTotalUSD}`
                          : css.productItemTotalUAH
                      }
                    >
                      {p.value} {p.symbol}
                    </span>
                  ))}
                </div>

                <Button
                  onClick={() => setDeletingProduct({ product })}
                  className={css.productDeleteButton}
                >
                  <MdOutlineDeleteForever className={css.productDeleteIcons} />
                </Button>
              </div>
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
