"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import css from "./Register.module.css";
import { useRegister } from "@/lib/api/mutation/authMutation";

type RegisterErrors = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const initialErrors: RegisterErrors = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>(initialErrors);

  const inputNameRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending, error } = useRegister();

  useEffect(() => {
    inputNameRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    const nextErrors: RegisterErrors = {
      name: trimmedName.length >= 2 ? "" : "Name must be at least 2 characters",
      email: /^\S+@\S+\.\S+$/.test(trimmedEmail) ? "" : "Enter a valid email",
      password:
        password.length >= 6 ? "" : "Password must be at least 6 characters",
      confirmPassword:
        password === confirmPassword ? "" : "Passwords do not match",
    };

    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) return;

    mutate({
      name: trimmedName,
      email: trimmedEmail,
      password,
    });
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
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
            }}
            required
            minLength={2}
            className={css.inputField}
          />
          {errors.name && <p className={css.errorText}>{errors.name}</p>}
        </label>

        <label className={css.formLabel}>
          <span className={css.labelText}>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
            }}
            required
            className={css.inputField}
          />
          {errors.email && <p className={css.errorText}>{errors.email}</p>}
        </label>

        <label className={css.formLabel}>
          <span className={css.labelText}>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password || errors.confirmPassword) {
                setErrors((prev) => ({
                  ...prev,
                  password: "",
                  confirmPassword: "",
                }));
              }
            }}
            required
            minLength={6}
            className={css.inputField}
          />
          {errors.password && (
            <p className={css.errorText}>{errors.password}</p>
          )}
        </label>

        <label className={css.formLabel}>
          <span className={css.labelText}>Confirm Password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) {
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }
            }}
            required
            minLength={6}
            className={css.inputField}
          />
          {errors.confirmPassword && (
            <p className={css.errorText}>{errors.confirmPassword}</p>
          )}
        </label>

        {!Object.values(errors).some(Boolean) && error ? (
          <p className={css.errorText}>{error.message}</p>
        ) : null}

        <button
          className={css.registerButton}
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Loading..." : "Register"}
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
