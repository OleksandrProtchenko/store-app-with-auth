"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import css from "./Login.module.css";
import { useLogin } from "@/lib/api/mutation/authMutation";

type LoginErrors = {
  email: string;
  password: string;
};

const initialErrors: LoginErrors = {
  email: "",
  password: "",
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>(initialErrors);

  const inputEmailRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending, error } = useLogin();

  useEffect(() => {
    inputEmailRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    const nextErrors: LoginErrors = {
      email: /^\S+@\S+\.\S+$/.test(trimmedEmail) ? "" : "Enter a valid email",
      password:
        password.length >= 6 ? "" : "Password must be at least 6 characters",
    };

    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) return;

    mutate({ email: trimmedEmail, password });
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
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
            }}
            required
          />
          {errors.email && <p className={css.errorText}>{errors.email}</p>}
        </label>

        <label className={`${css.formLabel} ${css.lastLabel}`}>
          <span className={css.labelText}>Password</span>
          <input
            className={css.passwordInput}
            type="password"
            value={password}
            placeholder="Your password"
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: "" }));
              }
            }}
            required
            minLength={6}
          />
          {errors.password && (
            <p className={css.errorText}>{errors.password}</p>
          )}
        </label>

        {!Object.values(errors).some(Boolean) && error ? (
          <p className={css.errorText}>{error.message}</p>
        ) : null}

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
