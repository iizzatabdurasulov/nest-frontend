"use client";

import { useRef } from "react";
import { useAddToCartMutation, useDecrementCartItemMutation, useSetCartQuantityMutation } from "@/features/cart/cartApi";
import { apiError } from "@/lib/apiError";
import QuantityControl from "./QuantityControl";

export default function CartQuantityControl({
  productId, quantity, productTitle, available, disabled, onError,
}: {
  productId: number;
  quantity: number;
  productTitle: string;
  available: boolean;
  disabled: boolean;
  onError: (message: string) => void;
}) {
  const [add, adding] = useAddToCartMutation();
  const [decrement, decrementing] = useDecrementCartItemMutation();
  const [setQuantity, setting] = useSetCartQuantityMutation();
  const inFlight = useRef(false);
  const pending = adding.isLoading || decrementing.isLoading || setting.isLoading;

  async function changeQuantity(next: number) {
    if (inFlight.current || disabled || next === quantity || (!available && next > quantity)) return;
    inFlight.current = true;
    onError("");
    try {
      await setQuantity({ productId, quantity: next }).unwrap();
    } catch (error) {
      onError(apiError(error));
    } finally {
      inFlight.current = false;
    }
  }

  async function change(increase: boolean) {
    if (inFlight.current || disabled || (!increase && quantity <= 1) || (increase && !available)) return;
    inFlight.current = true;
    onError("");
    try {
      await (increase ? add(productId) : decrement(productId)).unwrap();
    } catch (error) {
      onError(apiError(error));
    } finally {
      inFlight.current = false;
    }
  }

  return (
    <QuantityControl
      quantity={quantity}
      productTitle={productTitle}
      disabled={disabled || pending}
      pending={pending}
      canIncrease={available}
      onIncrease={() => change(true)}
      onDecrease={() => change(false)}
      onQuantityChange={changeQuantity}
    />
  );
}
