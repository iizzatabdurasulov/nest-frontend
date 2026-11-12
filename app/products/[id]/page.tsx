"use client"

import { useGetProductByIdQuery } from "@/features/products/productsApi";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import ProductImage from "@/components/ProductImage";

const ProductDetail = () => {
  const params = useParams();

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductByIdQuery(Number(params.id), { skip: !params.id });
  if (isLoading) return <p role="status">Yuklanmoqda...</p>;
  if (error || !product) return <p role="alert">Mahsulot topilmadi yoki server bilan aloqa yo‘q.</p>;
  return (
    <div>
      <div className="w-100 h-100">
        <ProductImage image={product.image} title={product.title} />
      </div>
      <h2>{product?.title}</h2>
      <span>{product?.category}</span>
      <p>{product?.desc}</p>
      <h3>{product?.price} $</h3>
      <h4 className="line-through">{product?.oldPrice} $</h4>
    </div>
  );
};

export default function ProductPage() {
  return (
    <Suspense fallback={<p>Yuklanmoqda...</p>}>
      <ProductDetail />
    </Suspense>
  );
}
