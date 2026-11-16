"use client";

import { useState, type FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useLoginMutation, useRegisterMutation } from "@/features/auth/authApi";
import { setAccessToken } from "@/features/auth/authSlice";
import { baseApi } from "@/lib/redux/baseApi";
import { apiError } from "@/lib/apiError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormField from "@/components/shared/FormField";

export default function CustomerLogin({
  description = "Davom etish uchun hisobingizga kiring yoki yangi hisob yarating.",
}: {
  description?: string;
}) {
  const dispatch = useDispatch();
  const [login, loginState] = useLoginMutation();
  const [register, registerState] = useRegisterMutation();
  const [creating, setCreating] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const busy = loginState.isLoading || registerState.isLoading;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      const result = await (creating ? register : login)({
        email,
        password,
      }).unwrap();
      dispatch(baseApi.util.resetApiState());
      dispatch(setAccessToken(result.accessToken));
    } catch (error) {
      setError(apiError(error));
    }
  }
  return (
    <form
      onSubmit={submit}
      className="mx-auto max-w-md space-y-5 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8"
    >
      <div>
        <h2 className="text-xl font-semibold">
          {creating ? "Hisob yarating" : "Hisobingizga kiring"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-500">{description}</p>
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600"
        >
          {error}
        </p>
      )}
      <FormField label="Email">
        <Input
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </FormField>
      <FormField label="Parol">
        <Input
          type="password"
          autoComplete={creating ? "new-password" : "current-password"}
          required
          minLength={creating ? 6 : undefined}
          maxLength={creating ? 128 : undefined}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </FormField>
      {creating && (
        <p className="text-xs text-stone-500">
          Parol kamida 6 ta belgidan iborat bo‘lsin.
        </p>
      )}
      <Button className="w-full rounded-xl" disabled={busy}>
        {busy ? "Kutilmoqda..." : creating ? "Ro‘yxatdan o‘tish" : "Kirish"}
      </Button>
      <Button
        type="button"
        variant="link"
        className="w-full"
        disabled={busy}
        onClick={() => {
          setCreating(!creating);
          setPassword("");
          setError("");
        }}
      >
        {creating
          ? "Hisobingiz bormi? Kiring"
          : "Hisobingiz yo‘qmi? Ro‘yxatdan o‘ting"}
      </Button>
    </form>
  );
}
