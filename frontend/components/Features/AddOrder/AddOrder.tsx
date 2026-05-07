"use client";

import { useState } from "react";
import Modal from "../../UI/Modal/Modal";
import { useCreateOrder } from "@/lib/api/mutation/ordersMutation";

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddOrderModal({ isOpen, onClose }: AddOrderModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { mutate, isPending } = useCreateOrder();

  const handleConfirm = () => {
    if (!title.trim() || !description.trim()) return;

    mutate(
      {
        title,
        description,
        products: [],
      },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Order"
      onConfirm={handleConfirm}
      confirmText="Create"
      isLoading={isPending}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Order title"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "1rem",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Order description"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "1rem",
              minHeight: "100px",
              fontFamily: "inherit",
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
