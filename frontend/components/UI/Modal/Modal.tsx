"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <>
      <div className={css.overlay} onClick={onClose} />
      <div
        className={css.modal}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className={css.header}>
          <h2 className={css.title}>{title}</h2>
          <button className={css.closeBtn} onClick={onClose} type="button">
            x
          </button>
        </div>

        <div className={css.content}>{children}</div>

        <div className={css.footer}>
          <button
            className={css.cancelBtn}
            onClick={onClose}
            disabled={isLoading}
            type="button"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              className={css.confirmBtn}
              onClick={onConfirm}
              disabled={isLoading}
              type="button"
            >
              {isLoading ? "Loading..." : confirmText}
            </button>
          )}
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}
