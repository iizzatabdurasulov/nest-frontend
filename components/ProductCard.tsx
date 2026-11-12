import Link from "next/link";
import { ArrowUpRight } from "@/components/Icon";
import type { Product } from "@/features/products/productsApi";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import ProductImage from "./ProductImage";
import ProductPrice from "./ProductPrice";
export default function ProductCard({ product }: { product: Product }) {
  const discounted = Number(product.oldPrice) > Number(product.price);
  return (
    <Card className="group gap-0 overflow-hidden rounded-2xl border-stone-200/80 py-0 shadow-none transition-all hover:-translate-y-1 hover:border-[#dce9b5] hover:shadow-xl hover:shadow-[#203e31]/5 motion-reduce:transform-none">
      <Link href={`/products/${product.id}`} className="flex h-full flex-col">
        <div className="relative m-2.5 h-60 overflow-hidden rounded-xl bg-stone-100">
          <ProductImage
            image={product.image}
            title={product.title}
            className="absolute inset-0 p-3 transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
          />
          {discounted && (
            <Badge className="absolute top-3 left-3 border-0 bg-white text-[#244c3b] shadow-sm">
              Chegirma
            </Badge>
          )}
        </div>
        <CardContent className="flex flex-1 flex-col px-5 pt-3 pb-5">
          <p className="mb-2 text-[10px] font-semibold tracking-wider wrap-anywhere text-[#65804a] uppercase">
            {product.category || "Forma tanlovi"}
          </p>
          <h2 className="mb-2 line-clamp-2 text-base font-semibold tracking-tight wrap-anywhere text-stone-900">
            {product.title}
          </h2>
          <p className="mb-5 line-clamp-2 text-xs leading-5 wrap-anywhere text-stone-400">
            {product.desc || "Mahsulot tafsilotlari bilan tanishing."}
          </p>
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-stone-100 pt-4">
            <ProductPrice price={product.price} oldPrice={product.oldPrice} />
            <span className="grid size-10 shrink-0 place-items-center rounded-full border border-stone-200 text-stone-400 transition-colors group-hover:border-[#244c3b] group-hover:bg-[#244c3b] group-hover:text-white">
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
