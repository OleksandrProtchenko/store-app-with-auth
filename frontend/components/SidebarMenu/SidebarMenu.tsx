"use client";

import Link from "next/link";
import css from "./SidebarMenu.module.css";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/groups", label: "Groups" },
  { href: "/dashboard/products", label: "Products" },
  { href: "/dashboard/users", label: "Users" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function SidebarMenu() {
  const pathname = usePathname();

  return (
    <ul className={css.sidebarList}>
      {items.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <li key={item.href} className={css.sidebarItem}>
            <Link
              href={item.href}
              className={`${css.sidebarLink} ${isActive ? css.active : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
