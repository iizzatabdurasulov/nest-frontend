import Link from "next/link";
import { ArrowLeft } from "@/components/Icon";
import type { Product } from "@/features/products/productsApi";
import ProductPrice from "@/components/ProductPrice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
export default function ProductInformation({ product }: { product: Product }) {
  return (
    <div className="min-w-0 py-2 lg:py-5">
      <Badge variant="secondary" className="mb-5 bg-[#eff3e7] text-[#244c3b]">
        {product.category || "Forma"}
      </Badge>
      <h1 className="mb-6 text-3xl leading-tight font-semibold tracking-tight wrap-anywhere sm:text-4xl">
        {product.title}
      </h1>
      <ProductPrice
        detailed
        price={product.price}
        oldPrice={product.oldPrice}
      />
      <div className="my-7 border-y border-stone-100 py-6">
        <h2 className="mb-3 text-sm font-semibold">Mahsulot haqida</h2>
        <p className="text-sm leading-7 whitespace-pre-line wrap-anywhere text-stone-500">
          {product.desc || "Bu mahsulot uchun hozircha tavsif qo‘shilmagan."}
        </p>
      </div>
      <p className="mb-6 text-xs text-stone-400">
        Mahsulot raqami: #{product.id}
      </p>
      <Button asChild variant="outline">
        <Link href="/products">
          <ArrowLeft /> Katalogga qaytish
        </Link>
      </Button>
    </div>
  );
}
