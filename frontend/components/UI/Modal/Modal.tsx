"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";
import { IoCloseOutline } from "react-icons/io5";
import Button from "../Button/Button";

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
        <div className={css.modalHeader}>
          <h2 className={css.modalHeaderTitle}>{title}</h2>
          <Button className={css.modalCloseBtn} onClick={onClose}>
            <IoCloseOutline className={css.modalCloseBtnIcons} />
          </Button>
        </div>

        <div className={css.modalContent}>{children}</div>

        <div className={css.modalFooter}>
          <Button
            className={css.modalCancelBtn}
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          {onConfirm && (
            <Button
              className={css.modalConfirmBtn}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : confirmText}
            </Button>
          )}
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}
