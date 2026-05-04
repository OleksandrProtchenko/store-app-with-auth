"use client";

import css from "./Header.module.css";
import Link from "next/link";
import Image from "next/image";
import Clock from "../Clock/Clock";
import { useAuthStore } from "@/lib/store/authStore";
import Button from "../Button/Button";

export default function Header() {
  const { logout } = useAuthStore();
  const accessToken = useAuthStore((state) => state.accessToken);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={css.headerContainer}>
      <div className={css.wrapper}>
        <Link className={css.logoLink} href="/">
          <Image
            className={css.logoImage}
            src="/logo.png"
            alt="Logo"
            width={38}
            height={45}
          />
          <span className={css.logoText}>Inventory</span>
        </Link>

        <div className={css.todayDateWrapper}>
          <p className={css.currentDay}>Today</p>
          <div className={css.fullDateWrapper}>
            <Clock />
          </div>
        </div>
      </div>
      {accessToken && (
        <Button onClick={handleLogout} className={css.btnLogout}>
          Logout
        </Button>
      )}
    </div>
  );
}
