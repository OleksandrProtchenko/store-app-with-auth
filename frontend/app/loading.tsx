"use client";
import css from "./loading.module.css";
import Loader from "@/components/Loader/Loader";

export default function Loading() {
  return (
    <div className={css.container}>
      <Loader />
    </div>
  );
}
