"use client";

import { getMe } from "@/lib/api/apiClient";
import SidebarPage from "./@sidebar/default";
import css from "./layout.module.css";
import { useAuthStore } from "@/lib/store/authStore";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setUser = useAuthStore((s) => s.setUser);

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  useEffect(() => {
    if (user) setUser(user);
  }, [user, setUser]);

  return (
    <div className={css.dashboardWrapper}>
      <aside className={css.aside}>
        <SidebarPage />
      </aside>
      <section className={css.dashboardContainer}>{children}</section>
    </div>
  );
}
