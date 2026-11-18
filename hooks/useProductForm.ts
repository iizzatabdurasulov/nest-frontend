"use client";

import { useState, FormEvent } from "react";
import {
  Product,
  ProductInput,
  useAddProductMutation,
  useUpdateProductMutation,
  useUploadImageMutation,
} from "@/features/products/productsApi";
import { apiError } from "@/lib/apiError";

type Options = { product: Product | null; onSaved: () => void };

export function useProductForm({ product, onSaved }: Options) {
  const [title, setTitle] = useState(product?.title ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [deliveryPrice, setDeliveryPrice] = useState(String(product?.deliveryPrice ?? 0));
  const [oldPrice, setOldPrice] = useState(product?.oldPrice ?? "");
  const [desc, setDesc] = useState(product?.desc ?? "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [image, setImage] = useState(product?.image ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [addProduct, addState] = useAddProductMutation();
  const [updateProduct, updateState] = useUpdateProductMutation();
  const [uploadImage, uploadState] = useUploadImageMutation();
  const busy =
    addState.isLoading || updateState.isLoading || uploadState.isLoading;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (title.trim().length < 2) {
      setError("Mahsulot nomi kamida 2 ta belgidan iborat bo‘lsin.");
      return;
    }
    const delivery = deliveryPrice.trim() === "" ? 0 : Number(deliveryPrice);
    if (!Number.isFinite(delivery) || delivery < 0) {
      setError("Yetkazib berish narxi 0 yoki undan katta son bo‘lsin.");
      return;
    }
    if (
      file &&
      (file.size > 5 * 1024 * 1024 ||
        !["image/jpeg", "image/png", "image/webp"].includes(file.type))
    ) {
      setError("JPG, PNG yoki WebP rasm tanlang. Hajmi 5 MB dan oshmasin.");
      return;
    }

    try {
      let imagePath = image;
      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        const uploaded = await uploadImage(formData).unwrap();
        imagePath = uploaded.image;
        setImage(imagePath);
        setFile(null);
      }
      const body: ProductInput = {
        title: title.trim(),
        price: Number(price),
        deliveryPrice: delivery,
        oldPrice: oldPrice === "" ? null : Number(oldPrice),
        desc,
        category: category.trim() || "Uncategorized",
        isActive,
        image: imagePath || null,
      };
      if (product) {
        await updateProduct({ id: product.id, body }).unwrap();
      } else {
        await addProduct(body).unwrap();
      }
      onSaved();
    } catch (error) {
      setError(apiError(error));
    }
  }

  return {
    title,
    setTitle,
    price,
    setPrice,
    oldPrice,
    setOldPrice,
    deliveryPrice,
    setDeliveryPrice,
    desc,
    setDesc,
    category,
    setCategory,
    isActive,
    setIsActive,
    image,
    setImage,
    file,
    setFile,
    error,
    busy,
    handleSubmit,
  };
}
