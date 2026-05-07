"use client";

import { useState } from "react";
import Modal from "../../UI/Modal/Modal";
import { useCreateOrder } from "@/lib/api/mutation/ordersMutation";
import css from "./AddOrder.module.css";

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddOrderModal({ isOpen, onClose }: AddOrderModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({ title: "", description: "" });
  const { mutate, isPending } = useCreateOrder();

  const handleConfirm = () => {
    const newErrors = {
      title: title.trim() ? "" : "Title is required",
      description: description.trim() ? "" : "Description is required",
    };

    setErrors(newErrors);

    if (newErrors.title || newErrors.description) return;

    mutate(
      { title, description, products: [] },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          setErrors({ title: "", description: "" });
          onClose();
        },
      },
    );
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setErrors({ title: "", description: "" });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Order"
      onConfirm={handleConfirm}
      confirmText="Create"
      isLoading={isPending}
    >
      <div className={css.wrapper}>
        <div className={css.field}>
          <label className={css.label}>
            <span className={css.labelText}>Title</span>
          </label>
          <input
            className={css.inputTitle}
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
            }}
            placeholder="Order title"
          />
          {errors.title && <p className={css.error}>{errors.title}</p>}
        </div>

        <div className={css.field}>
          <label className={css.label}>
            <span className={css.labelText}>Description</span>
          </label>
          <textarea
            className={css.inputDescription}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description)
                setErrors((prev) => ({ ...prev, description: "" }));
            }}
            placeholder="Order description"
          />
          {errors.description && (
            <p className={css.error}>{errors.description}</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
