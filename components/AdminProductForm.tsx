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
import ProductImage from "./ProductImage";

export default function AdminProductForm({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(product?.title ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [oldPrice, setOldPrice] = useState(product?.oldPrice ?? "");
  const [desc, setDesc] = useState(product?.desc ?? "");
  const [category, setCategory] = useState(product?.category ?? "");
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
        oldPrice: oldPrice === "" ? null : Number(oldPrice),
        desc,
        category: category.trim() || "Uncategorized",
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

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <p className="admin-eyebrow">KATALOGNI YANGILASH</p>
      <h2>{product ? "Mahsulotni tahrirlash" : "Mahsulot qo‘shish"}</h2>
      <p className="admin-form-description">
        Mahsulot ma’lumotlarini kiriting va o‘zgarishlarni saqlang.
      </p>
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      <fieldset disabled={busy}>
        <label>
          Mahsulot nomi
          <input
            required
            placeholder="Masalan, yog‘och stol"
            minLength={2}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
        <label className="admin-price-field">
          Narx (so‘m)
          <input
            type="number"
            required
            min="0.01"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
        </label>
        <label className="admin-price-field">
          Eski narx (ixtiyoriy)
          <input
            type="number"
            min="0"
            step="0.01"
            value={oldPrice}
            onChange={(event) => setOldPrice(event.target.value)}
          />
        </label>
        <label>
          Kategoriya
          <input
            value={category}
            placeholder="Masalan, uy jihozlari"
            onChange={(event) => setCategory(event.target.value)}
          />
        </label>
        <label>
          Tavsif
          <textarea
            rows={3}
            placeholder="Mahsulot haqida qisqacha ma’lumot..."
            value={desc}
            onChange={(event) => setDesc(event.target.value)}
          />
        </label>
        <label className="admin-upload">
          Rasm (JPG, PNG, WebP, 5 MB gacha)
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </label>
        {image && (
          <div className="admin-image-preview">
            <div className="admin-thumbnail">
              <ProductImage image={image} title={title} />
            </div>
            <button
              type="button"
              onClick={() => {
                setImage("");
                setFile(null);
              }}
            >
              Rasmni olib tashlash
            </button>
          </div>
        )}
        <div className="admin-actions">
          <button className="primary-button" type="submit">
            {busy ? "Saqlanmoqda..." : "Saqlash"}
          </button>
          <button type="button" onClick={onClose}>
            Bekor qilish
          </button>
        </div>
      </fieldset>
    </form>
  );
}
