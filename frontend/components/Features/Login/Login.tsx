"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import css from "./Login.module.css";

import { useRouter } from "next/navigation";
import axios from "axios";
import { useLogin } from "@/lib/api/mutation/authMutation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const inputEmailRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { mutate, isPending, error } = useLogin();

  useEffect(() => {
    inputEmailRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <div className={css.loginWrapper}>
      <h1 className={css.loginTitle}>Login</h1>
      <form onSubmit={handleSubmit} className={css.loginForm}>
        <label className={css.formLabel}>
          <span className={css.labelText}>Email</span>
          <input
            className={css.emailInput}
            ref={inputEmailRef}
            type="email"
            value={email}
            placeholder="email@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className={`${css.formLabel} ${css.lastLabel}`}>
          <span className={css.labelText}>Password</span>
          <input
            className={css.passwordInput}
            type="password"
            value={password}
            placeholder="Your password"
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>

        {error ? <p className={css.errorText}>{error.message}</p> : null}

        <button className={css.loginButton} type="submit" disabled={isPending}>
          {isPending ? "Loading..." : "Login"}
        </button>
      </form>

      <p className={css.registerText}>
        Don't have an account?{" "}
        <Link className={css.registerLink} href="/auth/register">
          Register
        </Link>
      </p>
    </div>
  );
}
