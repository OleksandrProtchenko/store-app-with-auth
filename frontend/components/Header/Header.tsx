"use client";

import css from "./Header.module.css";
import Link from "next/link";
import Image from "next/image";
import Clock from "../Clock/Clock";
import { useAuthStore } from "@/lib/store/authStore";
import Button from "../Button/Button";
import api from "@/lib/api/api";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      logout();
      router.replace("/auth/login");
    }
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
      {isDashboard && (
        <Button onClick={handleLogout} className={css.btnLogout}>
          Logout
        </Button>
      )}
    </div>
  );
}
