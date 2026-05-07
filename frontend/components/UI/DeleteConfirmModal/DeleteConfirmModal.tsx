"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import css from "./DeleteConfirmModal.module.css";
import { IoCloseOutline } from "react-icons/io5";

type EntityType = "order" | "product";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  entityType: EntityType;
  title: string;
  subtitle?: string;
  meta?: string;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  entityType,
  title,
  subtitle,
  meta,
  isLoading = false,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onEsc);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onEsc);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const label = entityType === "order" ? "order" : "product";

  return createPortal(
    <>
      <div className={css.overlay} onClick={onClose} />
      <div className={css.modal} role="dialog" aria-modal="true">
        <button className={css.closeBtn} type="button" onClick={onClose}>
          <IoCloseOutline className={css.modalCloseBtnIcons} />
        </button>

        <div className={css.modalTitle}>
          Are you sure you want to delete this {label}: {title}?
        </div>

        <div className={css.modalFooter}>
          <button
            className={css.cancelBtn}
            type="button"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className={css.deleteBtn}
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}
