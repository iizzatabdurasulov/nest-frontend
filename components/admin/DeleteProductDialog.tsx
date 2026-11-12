"use client";
import { useState } from "react";
import type { Product } from "@/features/products/productsApi";
import { useDeleteProductMutation } from "@/features/products/productsApi";
import { apiError } from "@/lib/apiError";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
export default function DeleteProductDialog({
  product,
  onClose,
  onDeleted,
}: {
  product: Product;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [remove, { isLoading }] = useDeleteProductMutation();
  const [error, setError] = useState("");
  async function handleDelete() {
    setError("");
    try {
      await remove(product.id).unwrap();
      onDeleted();
    } catch (error) {
      setError(apiError(error));
    }
  }
  return (
    <AlertDialog
      open
      onOpenChange={(open) => {
        if (!open && !isLoading) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Mahsulotni o‘chirish?</AlertDialogTitle>
          <AlertDialogDescription>
            “{product.title}” katalogdan o‘chiriladi. Bu amalni qaytarib
            bo‘lmaydi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <p role="alert" className="text-sm text-rose-600">
            {error}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Bekor qilish
          </AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={isLoading}
            onClick={handleDelete}
          >
            {isLoading ? "O‘chirilmoqda..." : "Ha, o‘chirish"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
