"use client";
import Link from "next/link";
import css from "./page.module.css";

export default function Home() {
  return (
    <div className={css.container}>
      <div className={css.wrapper}>
        <h1 className={css.title}>Welcome to the Store</h1>
        <Link className={css.link} href="/auth/login">
          Login
        </Link>

        <Link className={css.link} href="/auth/register">
          Register
        </Link>
      </div>
    </div>
  );
}
