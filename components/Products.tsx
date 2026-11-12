"use client"

import { useGetProductsQuery } from "@/features/products/productsApi";
import React from "react";

const ProductsList = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

  return (
    <div>
      {products?.map((product) => {
        return (
          <div key={product.id}>
            <img src={`http://localhost:8080${product.image}`} alt="" />
            <h2>{product.title}</h2>
            <span>{product.price}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ProductsList;
