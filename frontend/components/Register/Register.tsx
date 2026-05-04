"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import css from "./Register.module.css";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const inputNameRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  useEffect(() => {
    inputNameRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Пароли не совпадают.");
      return;
    }

    setIsLoading(true);
  };

  return (
    <div className={css.registerWrapper}>
      <h1 className={css.registerTitle}>Register</h1>

      <form className={css.registerForm} onSubmit={handleSubmit}>
        <label className={css.formLabel}>
          <span className={css.labelText}>Name</span>
          <input
            ref={inputNameRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            className={css.inputField}
          />
        </label>

        <label className={css.formLabel}>
          <span className={css.labelText}>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={css.inputField}
          />
        </label>

        <label className={css.formLabel}>
          <span className={css.labelText}>Password</span>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className={css.inputField}
          />
        </label>

        <label className={css.formLabel}>
          <span className={css.labelText}>Confirm Password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className={css.inputField}
          />
        </label>

        {error ? <p className={css.errorText}>{error}</p> : null}

        <button
          className={css.registerButton}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Register"}
        </button>
      </form>

      <p className={css.loginText}>
        Already have an account?{" "}
        <Link className={css.loginLink} href="/auth/login">
          Login
        </Link>
      </p>
    </div>
  );
}
