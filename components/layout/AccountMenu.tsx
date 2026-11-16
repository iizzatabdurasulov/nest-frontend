"use client";

import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { LogOut, ShoppingCart, UserRound } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useLogoutMutation } from "@/features/auth/authApi";
import { setAccessToken } from "@/features/auth/authSlice";
import { useCartSession } from "@/hooks/useCartSession";
import { baseApi } from "@/lib/redux/baseApi";
import { apiError } from "@/lib/apiError";

export default function AccountMenu() {
  const dispatch = useDispatch();
  const { accessToken, sessionInitialized, sessionError } = useCartSession();
  const [endSession, { isLoading }] = useLogoutMutation();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  async function logout() {
    setError("");
    try {
      await endSession().unwrap();
      dispatch(setAccessToken(""));
      dispatch(baseApi.util.resetApiState());
      setOpen(false);
    } catch (error) {
      setError(apiError(error));
    }
  }

  if (!sessionInitialized && !sessionError) {
    return (
      <Skeleton
        className="size-9 rounded-full"
        role="status"
        aria-label="Profil yuklanmoqda"
      />
    );
  }

  if (!accessToken) {
    return (
      <Button asChild variant="outline" size="sm" className="rounded-full">
        <Link href="/login">Login</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Profil menyusi"
          className="rounded-full border border-[#d4dfc1] bg-[#e3e9d6] text-[#244c3b] hover:bg-[#d4dfc1]"
        >
          <UserRound className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-56 rounded-xl p-2"
      >
        <DropdownMenuLabel className="text-xs text-stone-500">
          Mening hisobim
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="rounded-lg">
          <Link href="/cart">
            <ShoppingCart /> Savatcham
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={isLoading}
          className="rounded-lg"
          onSelect={(event) => {
            event.preventDefault();
            void logout();
          }}
        >
          <LogOut /> {isLoading ? "Chiqilmoqda..." : "Chiqish"}
        </DropdownMenuItem>
        {error && (
          <p role="alert" className="px-2 py-2 text-xs text-rose-600">
            {error}
          </p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
