"use client";

import { useEffect, useState } from "react";
import Modal from "../../UI/Modal/Modal";
import { useAddProduct } from "@/lib/api/mutation/productsMutation";
import { getDefaultGuarantee } from "@/utils/getDefaultGuarantee";
import { getUsdToUahRate } from "@/lib/api/client/apiRates";

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

  const handleConfirm = () => {
    mutate(
      { orderId, product: formData },
      {
        onSuccess: () => {
          resetForm();
          onClose();
        },
      },
    );
  };

  const uahPrice = Math.round(usdPrice * usdRate * 100) / 100;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Product to Order"
      onConfirm={handleConfirm}
      confirmText="Add"
      isLoading={isPending}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="text"
          placeholder="Product title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          style={{
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />

        <input
          type="text"
          placeholder="Type (e.g., Monitors)"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          style={{
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />

        <input
          type="number"
          placeholder="Serial Number"
          value={formData.serialNumber}
          onChange={(e) =>
            setFormData({ ...formData, serialNumber: Number(e.target.value) })
          }
          style={{
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />

        <input
          type="text"
          placeholder="Photo URL"
          value={formData.photo}
          onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
          style={{
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />

        <div>
          <input
            type="number"
            placeholder="Price (USD)"
            value={usdPrice}
            onChange={(e) => handlePriceChange(Number(e.target.value))}
            style={{
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              width: "100%",
            }}
          />
          <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#888" }}>
            ≈ {uahPrice.toLocaleString("uk-UA")} UAH (курс НБУ: {usdRate})
          </p>
        </div>
      </div>
    </Modal>
  );
}
