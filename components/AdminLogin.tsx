"use client";

import { useState, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "@/features/auth/authApi";
import { setAccessToken } from "@/features/auth/authSlice";
import { baseApi } from "@/lib/redux/baseApi";
import { apiError } from "@/lib/apiError";
import Icon from "./Icon";

export default function AdminLogin() {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      const result = await login({ email, password }).unwrap();
      dispatch(baseApi.util.resetApiState());
      dispatch(setAccessToken(result.accessToken));
    } catch (error) {
      setError(apiError(error));
    }
  }

  return (
    <div className="admin-login-layout">
      <div className="admin-login-intro">
        <span className="admin-login-badge">
          <Icon name="box" /> FORMA ADMIN
        </span>
        <h2>
          Katalogingiz.
          <br />
          Sizning nazoratingizda.
        </h2>
        <p>
          Mahsulotlarni qo‘shing, yangilang va barcha tanlovlarni bir joydan
          boshqaring.
        </p>
        <div className="admin-login-features">
          <span>
            <Icon name="check" /> Qulay boshqaruv
          </span>
          <span>
            <Icon name="check" /> Tartibli katalog
          </span>
        </div>
      </div>
      <form className="admin-form login-form" onSubmit={handleSubmit}>
        <span className="admin-login-icon">
          <Icon name="arrow" />
        </span>
        <h2>Admin hisobiga kirish</h2>
        <p>Admin yoki owner hisobingiz bilan kiring.</p>
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        <label>
          Email
          <input
            type="email"
            autoComplete="username"
            placeholder="siz@example.com"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          Parol
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Parolingizni kiriting"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button className="primary-button" disabled={isLoading}>
          {isLoading ? "Kirilmoqda..." : "Panelga kirish"} <Icon name="arrow" />
        </button>
        <p className="admin-login-note">
          Faqat admin va owner hisoblari uchun.
        </p>
      </form>
    </div>
  );
}
