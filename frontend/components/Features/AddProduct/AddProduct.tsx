"use client";

import { useState } from "react";
import Modal from "../../UI/Modal/Modal";
import { useAddProduct } from "@/lib/api/mutation/productsMutation";
import { getDefaultGuarantee } from "@/utils/getDefaultGuarantee";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

export default function AddProductModal({
  isOpen,
  onClose,
  orderId,
}: AddProductModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    specification: "",
    serialNumber: 0,
    isNew: 1,
    photo: "",
    price: [{ value: 0, symbol: "USD", isDefault: 1 }],
    guarantee: getDefaultGuarantee(),
  });

  const { mutate, isPending } = useAddProduct();

  const handleConfirm = () => {
    mutate(
      { orderId, product: formData },
      {
        onSuccess: () => {
          setFormData({
            title: "",
            type: "",
            specification: "",
            serialNumber: 0,
            isNew: 1,
            photo: "",
            price: [{ value: 0, symbol: "USD", isDefault: 1 }],
            guarantee: getDefaultGuarantee(),
          });
          onClose();
        },
      },
    );
  };

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

        <input
          type="number"
          placeholder="Price"
          value={formData.price[0].value}
          onChange={(e) =>
            setFormData({
              ...formData,
              price: [{ ...formData.price[0], value: Number(e.target.value) }],
            })
          }
          style={{
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
      </div>
    </Modal>
  );
}
