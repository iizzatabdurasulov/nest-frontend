"use client";

import { useGetProductsQuery } from "@/features/products/productsApi";
import Link from "next/link";
import React from "react";
import ProductImage from "./ProductImage";

const Products = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();
  if (isLoading) return <p role="status">Yuklanmoqda...</p>;
  if (error) return <p role="alert">Mahsulotlar yuklanmadi.</p>;
  return (
    <div className="flex gap-4">
      {products?.map((product) => {
        return (
          <div key={product.id}>
            <Link href={`/products/${product.id}`}>
              <div className="w-100 h-100">
                <ProductImage image={product.image} title={product.title} />
              </div>
              <h2>{product.title}</h2>
              <span>{product.category}</span>
              <p>{product.desc}</p>
              <h3>{product?.price} $</h3>
              <h4 className="line-through">{product?.oldPrice} $</h4>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Products;
