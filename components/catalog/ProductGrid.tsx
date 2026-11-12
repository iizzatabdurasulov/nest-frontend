import type { Product } from "@/features/products/productsApi";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductGrid({
  products = [],
  loading = false,
}: {
  products?: Product[];
  loading?: boolean;
}) {
  return (
    <div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy={loading}
    >
      {loading
        ? [1, 2, 3].map((id) => (
            <div
              key={id}
              className="space-y-5 rounded-2xl border border-stone-200 bg-white p-3"
            >
              <Skeleton className="h-56 rounded-xl" />
              <div className="space-y-3 px-2 pb-3">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
          ))
        : products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
    </div>
  );
}
