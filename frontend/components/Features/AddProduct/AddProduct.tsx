"use client";

import { useEffect, useState } from "react";
import Modal from "../../UI/Modal/Modal";
import { useAddProduct } from "@/lib/api/mutation/productsMutation";
import { getDefaultGuarantee } from "@/utils/getDefaultGuarantee";
import { getUsdToUahRate } from "@/lib/api/client/apiRates";
import css from "./AddProduct.module.css";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

const FALLBACK_RATE = 41;

export default function AddProductModal({
  isOpen,
  onClose,
  orderId,
}: AddProductModalProps) {
  const [usdRate, setUsdRate] = useState<number>(FALLBACK_RATE);
  const [usdPrice, setUsdPrice] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    specification: "",
    serialNumber: 0,
    isNew: 1,
    photo: "",
    price: [
      { value: 0, symbol: "USD", isDefault: 1 },
      { value: 0, symbol: "UAH", isDefault: 0 },
    ],
    guarantee: getDefaultGuarantee(),
  });

  const [errors, setErrors] = useState({
    title: "",
    type: "",
    serialNumber: "",
    price: "",
  });
  const [submitError, setSubmitError] = useState("");

  const { mutate, isPending } = useAddProduct();

  useEffect(() => {
    if (!isOpen) return;
    getUsdToUahRate().then(setUsdRate);
  }, [isOpen]);

  const handlePriceChange = (usd: number) => {
    const uah = Math.round(usd * usdRate * 100) / 100;
    setUsdPrice(usd);
    setFormData((prev) => ({
      ...prev,
      price: [
        { value: usd, symbol: "USD", isDefault: 1 },
        { value: uah, symbol: "UAH", isDefault: 0 },
      ],
    }));
  };

  const resetForm = () => {
    setUsdPrice(0);
    setFormData({
      title: "",
      type: "",
      specification: "",
      serialNumber: 0,
      isNew: 1,
      photo: "",
      price: [
        { value: 0, symbol: "USD", isDefault: 1 },
        { value: 0, symbol: "UAH", isDefault: 0 },
      ],
      guarantee: getDefaultGuarantee(),
    });
  };

  const validateForm = () => {
    const nextErrors = {
      title: formData.title.trim() ? "" : "Enter product title",
      type: formData.type.trim() ? "" : "Enter product type",
      serialNumber:
        Number.isFinite(formData.serialNumber) && formData.serialNumber > 0
          ? ""
          : "Serial number must be greater than 0",
      price:
        Number.isFinite(usdPrice) && usdPrice > 0
          ? ""
          : "Enter a price greater than 0",
    };

    setErrors(nextErrors);
    return Object.values(nextErrors).every((msg) => !msg);
  };

  const handleConfirm = () => {
    setSubmitError("");
    if (!validateForm()) return;

    mutate(
      { orderId, product: formData },
      {
        onSuccess: () => {
          resetForm();
          setErrors({ title: "", type: "", serialNumber: "", price: "" });
          setSubmitError("");
          onClose();
        },
        onError: (error: unknown) => {
          const message =
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? "Failed to add product";
          setSubmitError(message);
        },
      },
    );
  };

  const handleClose = () => {
    resetForm();
    setErrors({ title: "", type: "", serialNumber: "", price: "" });
    setSubmitError("");
    onClose();
  };

  const uahPrice = Math.round(usdPrice * usdRate * 100) / 100;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Product to Order"
      onConfirm={handleConfirm}
      confirmText="Add"
      isLoading={isPending}
    >
      <div className={css.addProductWrapper}>
        <label className={css.productLabel}>
          <span className={css.productLabelText}>Product Title</span>
          <input
            className={css.productInput}
            type="text"
            placeholder="Product title"
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
            }}
          />
          {errors.title ? (
            <p className={css.inputError}>{errors.title}</p>
          ) : null}
        </label>

        <label className={css.productLabel}>
          <span className={css.productLabelText}>Product Type</span>
          <input
            className={css.productInput}
            type="text"
            placeholder="Type (e.g., Monitors)"
            value={formData.type}
            onChange={(e) => {
              setFormData({ ...formData, type: e.target.value });
              if (errors.type) setErrors((prev) => ({ ...prev, type: "" }));
            }}
          />
          {errors.type ? <p className={css.inputError}>{errors.type}</p> : null}
        </label>

        <label className={css.productLabel}>
          <span className={css.productLabelText}>Serial Number</span>
          <input
            className={css.productInput}
            type="number"
            placeholder="Serial Number"
            value={formData.serialNumber}
            onChange={(e) => {
              setFormData({
                ...formData,
                serialNumber: Number(e.target.value),
              });
              if (errors.serialNumber)
                setErrors((prev) => ({ ...prev, serialNumber: "" }));
            }}
          />
          {errors.serialNumber ? (
            <p className={css.inputError}>{errors.serialNumber}</p>
          ) : null}
        </label>

        {/* For future add image */}
        {/*         <label className={css.productLabel}>
          <span className={css.productLabelText}>Photo URL</span>
          <input
            type="text"
            placeholder="Photo URL"
            value={formData.photo}
            onChange={(e) =>
              setFormData({ ...formData, photo: e.target.value })
            }
          />
        </label> */}

        <label className={css.productLabel}>
          <span className={css.productLabelText}>Price (USD)</span>
          <input
            className={css.productInput}
            type="number"
            placeholder="Price (USD)"
            value={usdPrice}
            onChange={(e) => {
              handlePriceChange(Number(e.target.value));
              if (errors.price) setErrors((prev) => ({ ...prev, price: "" }));
            }}
          />
          {errors.price ? (
            <p className={css.inputError}>{errors.price}</p>
          ) : null}
          <p>
            ≈ {uahPrice.toLocaleString("uk-UA")} UAH (курс НБУ: {usdRate})
          </p>
        </label>
        {submitError ? <p className={css.submitError}>{submitError}</p> : null}
      </div>
    </Modal>
  );
}
