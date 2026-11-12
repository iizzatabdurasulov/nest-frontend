"use client";
import Link from "next/link";
import { useGetProductByIdQuery } from "@/features/products/productsApi";
import ProductImage from "./ProductImage";
import ProductInformation from "./catalog/ProductInformation";
import ProductGrid from "./catalog/ProductGrid";
import EmptyState from "./shared/EmptyState";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
export default function ProductDetail({ id }: { id: number }) {
  const valid = Number.isSafeInteger(id) && id > 0;
  const {
    data: product,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useGetProductByIdQuery(id, { skip: !valid });
  if (isLoading) return <ProductGrid loading />;
  if (error || !product)
    return (
      <EmptyState
        error
        title="Mahsulotni ko‘rsatib bo‘lmadi"
        description="Mahsulot mavjudligini va server bilan aloqani tekshiring."
      >
        {valid && (
          <Button disabled={isFetching} onClick={() => refetch()}>
            Qayta urinish
          </Button>
        )}
        <Button asChild variant="outline">
          <Link href="/products">Katalogga qaytish</Link>
        </Button>
      </EmptyState>
    );
  return (
    <>
      <nav
        aria-label="Sahifa yo‘li"
        className="mb-7 flex flex-wrap gap-3 text-xs text-stone-400"
      >
        <Link href="/products" className="hover:text-[#244c3b]">
          Mahsulotlar
        </Link>
        <span>/</span>
        <span className="wrap-anywhere text-stone-600">{product.title}</span>
      </nav>
      <Card className="border-stone-200/80 shadow-none">
        <CardContent className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="relative h-72 overflow-hidden rounded-2xl bg-stone-100 sm:h-96 lg:h-[460px]">
            <ProductImage
              image={product.image}
              title={product.title}
              className="absolute inset-0 p-5 sm:p-8"
            />
          </div>
          <ProductInformation product={product} />
        </CardContent>
      </Card>
    </>
  );
}
