"use client";

import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { ArrowLeft, LogOut, ShoppingCart, Trash2 } from "@/components/Icon";
import ProductImage from "@/components/ProductImage";
import CurrencyAmount from "@/components/shared/CurrencyAmount";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useLogoutMutation } from "@/features/auth/authApi";
import { setAccessToken } from "@/features/auth/authSlice";
import {
  useGetCartQuery,
  useRemoveCartItemMutation,
  useClearCartMutation,
} from "@/features/cart/cartApi";
import { useCartSession } from "@/hooks/useCartSession";
import { apiError } from "@/lib/apiError";
import { baseApi } from "@/lib/redux/baseApi";
import CustomerLogin from "@/components/auth/CustomerLogin";
import CartQuantityControl from "./CartQuantityControl";

export default function Cart() {
  const dispatch = useDispatch();
  const { accessToken, sessionInitialized, sessionError, retrySession } =
    useCartSession();
  const {
    currentData: cart,
    isLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useGetCartQuery(undefined, { skip: !accessToken });
  const [remove, removing] = useRemoveCartItemMutation();
  const [clear, clearing] = useClearCartMutation();
  const [endSession, loggingOut] = useLogoutMutation();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const busy =
    removing.isLoading ||
    clearing.isLoading ||
    loggingOut.isLoading;

  async function change(action: () => Promise<unknown>, success: string) {
    setError("");
    setMessage("");
    try {
      await action();
      setMessage(success);
    } catch (error) {
      setError(apiError(error));
    }
  }

  async function logout() {
    await endSession().unwrap();
    dispatch(setAccessToken(""));
    dispatch(baseApi.util.resetApiState());
  }

  const items = cart?.items ?? [];
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subTotal = cart?.subTotal ?? 0;
  const deliveryPrice = cart?.deliveryPrice ?? 0;
  const total = cart?.totalPrice ?? 0;

  let content;
  if (!sessionInitialized || (accessToken && isLoading && cart === undefined)) {
    content =
      !sessionInitialized && sessionError ? (
        <EmptyState
          error
          title="Sessiyani tekshirib bo‘lmadi"
          description={apiError(sessionError)}
        >
          <Button onClick={() => retrySession()}>Qayta urinish</Button>
        </EmptyState>
      ) : (
        <div
          role="status"
          aria-label="Savatcha yuklanmoqda"
          className="space-y-4"
        >
          <Skeleton className="h-36 w-full rounded-2xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
        </div>
      );
  } else if (!accessToken) {
    content = (
      <CustomerLogin description="Mahsulotlarni savatchaga saqlash uchun hisobingizga kiring." />
    );
  } else if (queryError && cart === undefined) {
    content = (
      <EmptyState
        error
        title="Savatchani yuklab bo‘lmadi"
        description={apiError(queryError)}
      >
        <Button disabled={isFetching} onClick={() => refetch()}>
          Qayta urinish
        </Button>
      </EmptyState>
    );
  } else if (!items.length) {
    content = (
      <EmptyState
        title="Savatchangiz hozircha bo‘sh"
        description="Katalogdan yoqqan mahsulotlaringizni tanlab, savatchaga qo‘shing."
      >
        <Button asChild className="rounded-full">
          <Link href="/products">Mahsulotlarni ko‘rish</Link>
        </Button>
      </EmptyState>
    );
  } else {
    content = (
      <div
        className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
        aria-busy={busy}
      >
        <ul className="space-y-4" aria-label="Savatchadagi mahsulotlar">
          {items.map(({ product, productId, quantity }) => (
            <li
              key={productId}
              className="flex flex-wrap gap-4 rounded-2xl border border-stone-200/80 bg-white p-4 sm:gap-5 sm:p-5"
            >
              <Link
                href={`/products/${productId}`}
                className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-stone-100 sm:size-28"
              >
                <ProductImage
                  image={product.image}
                  title={product.title}
                  className="absolute inset-0 p-2"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="mb-1 text-[10px] font-semibold tracking-wider text-[#65804a] uppercase">
                  {product.category}
                </p>
                <Link
                  href={`/products/${productId}`}
                  className="font-semibold wrap-anywhere hover:text-[#244c3b]"
                >
                  {product.title}
                </Link>
                <p className="mt-2 text-sm text-stone-500">
                  <CurrencyAmount amount={product.price} /> / dona
                </p>
                {!product.isActive && (
                  <p className="mt-2 text-xs text-rose-600">
                    Hozir sotuvda yo‘q
                  </p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <CartQuantityControl
                    productId={productId}
                    quantity={quantity}
                    productTitle={product.title}
                    disabled={busy}
                    available={product.isActive}
                    onError={setError}
                  />
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-stone-400 hover:text-rose-600"
                    disabled={busy}
                    aria-label={`${product.title}ni savatchadan o‘chirish`}
                    onClick={() =>
                      change(
                        () => remove(productId).unwrap(),
                        "Mahsulot savatchadan o‘chirildi.",
                      )
                    }
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
              <p className="w-full text-right font-semibold sm:w-auto">
                <CurrencyAmount amount={Number(product.price) * quantity} />
              </p>
            </li>
          ))}
        </ul>
        <aside className="rounded-2xl border border-stone-200/80 bg-white p-6 lg:sticky lg:top-6">
          <h2 className="text-lg font-semibold">Savatcha hisobi</h2>
          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between gap-3 text-stone-500">
              <dt>Mahsulotlar soni</dt>
              <dd>{count} ta</dd>
            </div>
            <div className="flex justify-between gap-3 text-stone-500">
              <dt>Mahsulotlar summasi</dt>
              <dd><CurrencyAmount amount={subTotal} /></dd>
            </div>
            <div className="border-t border-stone-100 pt-4">
              <dt className="font-medium text-stone-700">Yetkazib berish</dt>
              <dd className="mt-3">
                <ul className="space-y-3" aria-label="Mahsulotlar bo‘yicha yetkazib berish narxlari">
                  {items.map(({ product, productId, quantity }) => (
                    <li key={productId} className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/products/${productId}`}
                          className="block text-xs leading-5 wrap-anywhere text-stone-600 hover:text-[#244c3b]"
                        >
                          {product.title}
                        </Link>
                        <p className="mt-1 text-xs text-stone-400">
                          <CurrencyAmount amount={product.deliveryPrice} /> × {quantity} dona
                        </p>
                      </div>
                      <span className="shrink-0 text-right text-xs leading-5 font-medium text-stone-700">
                        {Number(product.deliveryPrice) === 0 ? "Bepul" : (
                          <CurrencyAmount amount={Number(product.deliveryPrice) * quantity} />
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-between gap-3 border-t border-stone-100 pt-3 text-stone-500">
                  <span>Jami yetkazib berish</span>
                  <span className="shrink-0 font-medium text-stone-700">
                    {deliveryPrice === 0 ? "Bepul" : <CurrencyAmount amount={deliveryPrice} />}
                  </span>
                </div>
              </dd>
            </div>
            <div className="flex flex-wrap justify-between gap-3 border-t border-stone-100 pt-4 text-base font-semibold">
              <dt>Jami</dt>
              <dd>
                <CurrencyAmount amount={total} />
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-5 text-stone-400">
            Har bir mahsulotning yetkazib berish narxi uning soniga ko‘paytirilib, jamlanadi.
          </p>
          <Button asChild className="mt-6 w-full rounded-xl">
            <Link href="/products">Xaridni davom ettirish</Link>
          </Button>
          <Button
            variant="ghost"
            className="mt-2 w-full text-stone-500"
            disabled={busy}
            onClick={() => {
              setError("");
              setConfirmClear(true);
            }}
          >
            <Trash2 /> Savatchani tozalash
          </Button>
        </aside>
      </div>
    );
  }

  return (
    <>
      <Link
        href="/products"
        className="mb-7 inline-flex items-center gap-2 text-xs text-stone-500 hover:text-[#244c3b]"
      >
        <ArrowLeft className="size-4" /> Katalogga qaytish
      </Link>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wider text-[#65804a] uppercase">
            <ShoppingCart className="size-4" /> Sizning tanlovingiz
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Savatcha
          </h1>
        </div>
        {accessToken && (
          <Button
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => change(logout, "Hisobdan chiqdingiz.")}
          >
            <LogOut /> Chiqish
          </Button>
        )}
      </div>
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-600"
        >
          {error}
        </p>
      )}
      <p role="status" className="mb-4 min-h-5 text-sm text-[#244c3b]">
        {message}
      </p>
      {queryError && cart !== undefined && (
        <div role="alert" className="mb-4 flex flex-wrap items-center gap-3 text-sm text-rose-600">
          <p>Savatchani yangilab bo‘lmadi. {apiError(queryError)}</p>
          <Button variant="outline" size="sm" disabled={isFetching} onClick={() => refetch()}>
            Qayta urinish
          </Button>
        </div>
      )}
      {content}
      <AlertDialog
        open={confirmClear && !!accessToken}
        onOpenChange={(open) => {
          if (!clearing.isLoading) setConfirmClear(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Savatchani tozalash?</AlertDialogTitle>
            <AlertDialogDescription>
              Barcha mahsulotlar savatchadan o‘chiriladi. Ularni katalogdan
              qayta qo‘shishingiz mumkin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && (
            <p role="alert" className="text-sm text-rose-600">
              {error}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={clearing.isLoading}>
              Bekor qilish
            </AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={busy}
              onClick={() =>
                change(async () => {
                  await clear().unwrap();
                  setConfirmClear(false);
                }, "Savatcha tozalandi.")
              }
            >
              {clearing.isLoading ? "Tozalanmoqda..." : "Ha, tozalash"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
