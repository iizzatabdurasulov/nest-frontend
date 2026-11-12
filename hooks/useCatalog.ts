"use client";
import { useState } from "react";
import { useGetProductsQuery } from "@/features/products/productsApi";

export function useCatalog() {
  const query = useGetProductsQuery();
  const products = query.data ?? [];
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const categories = [
    ...new Set(products.map((product) => product.category)),
  ].filter(Boolean);
  const visibleProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(search.trim().toLowerCase()) &&
      (category === "all" || product.category === category),
  );
  visibleProducts.sort((a, b) => {
    if (sort === "low") return Number(a.price) - Number(b.price);
    if (sort === "high") return Number(b.price) - Number(a.price);
    return b.id - a.id;
  });
  function resetFilters() {
    setSearch("");
    setCategory("all");
  }
  return {
    ...query,
    products,
    visibleProducts,
    categories,
    search,
    setSearch,
    category,
    setCategory,
    sort,
    setSort,
    resetFilters,
  };
}
