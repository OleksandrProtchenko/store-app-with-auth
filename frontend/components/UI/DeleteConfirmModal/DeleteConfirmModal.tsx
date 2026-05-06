"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import css from "./DeleteConfirmModal.module.css";

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

  const label = entityType === "order" ? "ордер" : "продукт";

  return createPortal(
    <>
      <div className={css.overlay} onClick={onClose} />
      <div className={css.modal} role="dialog" aria-modal="true">
        <button className={css.closeBtn} type="button" onClick={onClose}>
          x
        </button>

        <div className={css.head}>
          Вы уверены, что хотите удалить этот {label}?
        </div>

        <div className={css.preview}>
          <div className={css.dot} />
          <div className={css.info}>
            <p className={css.title}>{title}</p>
            {subtitle ? <p className={css.subtitle}>{subtitle}</p> : null}
            {meta ? <p className={css.meta}>{meta}</p> : null}
          </div>
        </div>

        <div className={css.footer}>
          <button
            className={css.cancelBtn}
            type="button"
            onClick={onClose}
            disabled={isLoading}
          >
            Отменить
          </button>
          <button
            className={css.deleteBtn}
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Удаление..." : "Удалить"}
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}
