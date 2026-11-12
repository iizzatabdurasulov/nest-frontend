"use client";
import { Save, Loader2 } from "@/components/Icon";
import type { Product } from "@/features/products/productsApi";
import { useProductForm } from "@/hooks/useProductForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";
import ProductFields from "./admin/ProductFields";
export default function AdminProductForm({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const form = useProductForm({ product, onSaved });
  return (
    <Card className="border-stone-200/80 shadow-none">
      <CardHeader>
        <CardTitle className="text-xl tracking-tight">
          {product ? "Mahsulotni tahrirlash" : "Yangi mahsulot"}
        </CardTitle>
        <CardDescription>
          Ma’lumotlarni to‘ldiring va katalogga saqlang.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit}>
          {form.error && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600"
            >
              {form.error}
            </p>
          )}
          <fieldset disabled={form.busy} className="min-w-0 space-y-7">
            <ProductFields form={form} />
            <div className="flex flex-wrap gap-3 border-t border-stone-100 pt-6">
              <Button type="submit">
                {form.busy ? <Loader2 className="animate-spin" /> : <Save />}
                {form.busy ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Bekor qilish
              </Button>
            </div>
          </fieldset>
        </form>
      </CardContent>
    </Card>
  );
}
