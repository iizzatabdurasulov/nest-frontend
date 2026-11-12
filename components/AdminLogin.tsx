"use client";

import { useState, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "@/features/auth/authApi";
import { setAccessToken } from "@/features/auth/authSlice";
import { baseApi } from "@/lib/redux/baseApi";
import { apiError } from "@/lib/apiError";

import { ArrowRight, Layers2, ShieldCheck } from "@/components/Icon";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import FormField from "./shared/FormField";

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
    <div className="grid overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm md:grid-cols-2">
      <div className="relative flex flex-col justify-between gap-12 overflow-hidden bg-[#203e31] p-8 text-white sm:p-10">
        <span
          className="absolute -right-24 -bottom-24 size-80 rounded-full bg-[#65804a]/20 blur-3xl"
          aria-hidden="true"
        />
        <Layers2 className="size-8 text-[#c6db96]" />
        <div className="relative">
          <p className="mb-4 text-[10px] tracking-[2px] text-[#c6db96]">
            FORMA WORKSPACE
          </p>
          <h2 className="text-3xl leading-tight font-medium tracking-tight">
            Katalogingiz.
            <br />
            Sizning nazoratingizda.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-7 text-stone-400">
            Har bir mahsulot, har bir o‘zgarish — bitta tartibli ish makonida.
          </p>
        </div>
        <p className="relative flex items-center gap-2 text-xs text-stone-400">
          <ShieldCheck className="size-4 text-[#c6db96]" /> Admin va owner
          hisoblari uchun
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5 p-8 sm:p-10">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            Xush kelibsiz
          </h2>
          <p className="mt-2 text-sm text-stone-400">
            Davom etish uchun hisobingizga kiring.
          </p>
        </div>
        {error && (
          <p
            role="alert"
            className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600"
          >
            {error}
          </p>
        )}
        <FormField label="Email">
          <Input
            type="email"
            autoComplete="username"
            required
            placeholder="siz@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormField>
        <FormField label="Parol">
          <Input
            type="password"
            autoComplete="current-password"
            required
            placeholder="Parolingizni kiriting"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormField>
        <Button disabled={isLoading} className="mt-2 w-full justify-between">
          {isLoading ? "Kirilmoqda..." : "Panelga kirish"}
          <ArrowRight />
        </Button>
        <p className="text-center text-xs text-stone-400">
          Hisob huquqlari serverda tekshiriladi.
        </p>
      </form>
    </div>
  );
}
