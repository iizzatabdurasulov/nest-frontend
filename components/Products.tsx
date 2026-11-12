"use client";
import { useCatalog } from "@/hooks/useCatalog";
import CatalogToolbar from "./catalog/CatalogToolbar";
import ProductGrid from "./catalog/ProductGrid";
import EmptyState from "./shared/EmptyState";
import { Button } from "./ui/button";

export default function Products() {
  const catalog = useCatalog();
  if (catalog.isLoading) return <ProductGrid loading />;
  if (catalog.error)
    return (
      <EmptyState
        error
        title="Mahsulotlar yuklanmadi"
        description="Server bilan aloqani tekshiring va qayta urinib ko‘ring."
      >
        <Button disabled={catalog.isFetching} onClick={() => catalog.refetch()}>
          Qayta urinish
        </Button>
      </EmptyState>
    );
  return (
    <section
      id="catalog"
      className="scroll-mt-28 space-y-6"
      aria-label="Mahsulotlar katalogi"
    >
      <CatalogToolbar
        search={catalog.search}
        onSearch={catalog.setSearch}
        category={catalog.category}
        onCategory={catalog.setCategory}
        categories={catalog.categories}
        sort={catalog.sort}
        onSort={catalog.setSort}
        total={catalog.products.length}
      />
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">
          {catalog.category === "all" ? "Barcha mahsulotlar" : catalog.category}{" "}
          <span className="ml-2 font-normal text-stone-400">
            {catalog.visibleProducts.length} ta
          </span>
        </h2>
        <span className="hidden text-xs text-stone-400 sm:block">
          Siz uchun, bir joyda.
        </span>
      </div>
      {catalog.visibleProducts.length ? (
        <ProductGrid products={catalog.visibleProducts} />
      ) : (
        <EmptyState
          title="Mahsulot topilmadi"
          description="Boshqa nom yoki kategoriya bilan qidirib ko‘ring."
        >
          <Button variant="outline" onClick={catalog.resetFilters}>
            Filtrlarni tozalash
          </Button>
        </EmptyState>
      )}
    </section>
  );
}
