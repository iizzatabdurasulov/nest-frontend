"use client";
import { useState } from "react";
import { Plus, Search, ArrowLeft } from "@/components/Icon";
import {
  useGetProductsQuery,
  type Product,
} from "@/features/products/productsApi";
import { apiError } from "@/lib/apiError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import EmptyState from "@/components/shared/EmptyState";
import ProductGrid from "@/components/catalog/ProductGrid";
import AdminProductForm from "@/components/AdminProductForm";
import AdminStats from "./AdminStats";
import AdminProductTable from "./AdminProductTable";
import DeleteProductDialog from "./DeleteProductDialog";
export default function ProductManager() {
  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useGetProductsQuery();
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<{ product: Product | null } | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [message, setMessage] = useState("");
  if (isLoading) return <ProductGrid loading />;
  if (error)
    return (
      <EmptyState
        error
        title="Mahsulotlar yuklanmadi"
        description={apiError(error)}
      >
        <Button onClick={() => refetch()}>Qayta urinish</Button>
      </EmptyState>
    );
  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.trim().toLowerCase()),
  );
  return (
    <div className="space-y-6">
      {message && (
        <p
          role="status"
          className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          {message}
        </p>
      )}
      {form ? (
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => setForm(null)}>
            <ArrowLeft /> Ro‘yxatga qaytish
          </Button>
          <AdminProductForm
            key={form.product?.id ?? "new"}
            product={form.product}
            onClose={() => setForm(null)}
            onSaved={() => {
              setForm(null);
              setMessage("Mahsulot saqlandi.");
            }}
          />
        </div>
      ) : (
        <>
          <AdminStats products={products} />
          <Card className="gap-0 overflow-hidden border-stone-200/80 py-0 shadow-none">
            <div className="flex flex-wrap items-center justify-between gap-4 p-6">
              <div>
                <h2 className="font-semibold tracking-tight">
                  Mahsulotlar katalogi
                </h2>
                <p className="mt-1 text-xs text-stone-400">
                  {products.length} ta mahsulot. Barcha o‘zgarishlar shu yerda.
                </p>
              </div>
              <Button
                onClick={() => {
                  setForm({ product: null });
                  setMessage("");
                }}
              >
                <Plus /> Mahsulot qo‘shish
              </Button>
            </div>
            <div className="border-t border-stone-100 px-6 py-4">
              <div className="relative max-w-sm">
                <Search
                  className="pointer-events-none absolute top-3 left-3 size-4 text-stone-400"
                  aria-hidden="true"
                />
                <Input
                  type="search"
                  aria-label="Mahsulot qidirish"
                  placeholder="Mahsulot qidirish..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            {filtered.length ? (
              <AdminProductTable
                products={filtered}
                onEdit={(product) => {
                  setForm({ product });
                  setMessage("");
                }}
                onDelete={setDeleting}
              />
            ) : (
              <div className="p-6">
                <EmptyState
                  title="Mahsulot topilmadi"
                  description="Qidiruvni o‘zgartiring yoki yangi mahsulot qo‘shing."
                />
              </div>
            )}
            <p className="border-t border-stone-100 px-6 py-4 text-xs text-stone-400">
              {filtered.length} ta mahsulot ko‘rsatilmoqda
            </p>
          </Card>
        </>
      )}
      {deleting && (
        <DeleteProductDialog
          key={deleting.id}
          product={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={() => {
            setDeleting(null);
            setMessage("Mahsulot o‘chirildi.");
          }}
        />
      )}
    </div>
  );
}
