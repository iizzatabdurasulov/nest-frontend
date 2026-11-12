"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import { baseApi } from "@/lib/redux/baseApi";
import { setAccessToken } from "@/features/auth/authSlice";
import { useGetAdminQuery } from "@/features/auth/authApi";
import {
  Product,
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/features/products/productsApi";
import { apiError } from "@/lib/apiError";
import AdminLogin from "./AdminLogin";
import AdminProductForm from "./AdminProductForm";
import ProductImage from "./ProductImage";
import { formatPrice } from "@/lib/formatPrice";
import Icon from "./Icon";

function ProductManager() {
  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useGetProductsQuery();
  const [deleteProduct, deleteState] = useDeleteProductMutation();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");

  async function handleDelete(id: number) {
    setActionError("");
    setMessage("");
    try {
      await deleteProduct(id).unwrap();
      setDeletingId(null);
      setMessage("Mahsulot o‘chirildi.");
    } catch (error) {
      setActionError(apiError(error));
    }
  }

  if (isLoading)
    return (
      <p className="admin-state" role="status">
        Mahsulotlar yuklanmoqda...
      </p>
    );
  if (error)
    return (
      <div className="admin-state" role="alert">
        <p>{apiError(error)}</p>
        <button onClick={() => refetch()}>Qayta urinish</button>
      </div>
    );

  const visibleProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.trim().toLowerCase()),
  );
  const activeCount = products.filter((product) => product.isActive).length;
  const categoryCount = new Set(products.map((product) => product.category))
    .size;

  return (
    <>
      {message && (
        <p className="success-message" role="status">
          {message}
        </p>
      )}
      {actionError && (
        <p className="error-message" role="alert">
          {actionError}
        </p>
      )}
      {showForm ? (
        <AdminProductForm
          key={editing?.id ?? "new"}
          product={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            setMessage("Mahsulot saqlandi.");
          }}
        />
      ) : (
        <>
          <div className="admin-stats">
            <div className="admin-stat">
              <span className="admin-stat-icon">
                <Icon name="box" />
              </span>
              <div>
                <p>Jami mahsulotlar</p>
                <strong>{products.length}</strong>
              </div>
              <span className="admin-stat-note">Katalogda</span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat-icon">
                <Icon name="check" />
              </span>
              <div>
                <p>Faol mahsulotlar</p>
                <strong>{activeCount}</strong>
              </div>
              <span className="admin-stat-note">Faol holatda</span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat-icon">
                <Icon name="sun" />
              </span>
              <div>
                <p>Kategoriyalar</p>
                <strong>{categoryCount}</strong>
              </div>
              <span className="admin-stat-note">Turli tanlovlar</span>
            </div>
          </div>
          <section className="admin-catalog" aria-label="Mahsulotlar ro‘yxati">
            <div className="admin-section-heading">
              <div>
                <h2>Mahsulotlar ro‘yxati</h2>
                <p>Katalogdagi barcha mahsulotlarni boshqaring.</p>
              </div>
              <span className="admin-count">{products.length} ta mahsulot</span>
            </div>
            <div className="admin-toolbar">
              <label className="admin-search">
                <Icon name="search" />
                <input
                  type="search"
                  aria-label="Mahsulot qidirish"
                  value={search}
                  placeholder="Mahsulot nomi bo‘yicha qidirish..."
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
              <button
                className="primary-button"
                onClick={() => {
                  setEditing(null);
                  setShowForm(true);
                  setMessage("");
                  setActionError("");
                }}
              >
                <span aria-hidden="true">＋</span> Mahsulot qo‘shish
              </button>
            </div>
            <div className="admin-table-heading" aria-hidden="true">
              <span>MAHSULOT</span>
              <span>NARX</span>
              <span>HOLATI</span>
              <span>AMALLAR</span>
            </div>
            {visibleProducts.length === 0 && (
              <div className="admin-empty">
                <Icon name="box" />
                <h3>Mahsulot topilmadi</h3>
                <p>
                  {search
                    ? "Boshqa nom bilan qidirib ko‘ring."
                    : "Birinchi mahsulotingizni katalogga qo‘shing."}
                </p>
              </div>
            )}
            <div className="admin-products">
              {visibleProducts.map((product) => (
                <article className="admin-product" key={product.id}>
                  <div className="admin-product-summary">
                    <div className="admin-thumbnail">
                      <ProductImage
                        image={product.image}
                        title={product.title}
                      />
                    </div>
                    <div className="admin-product-info">
                      <h2>{product.title}</h2>
                      <p>
                        {product.category || "Kategoriyasiz"}{" "}
                        <span>· #{product.id}</span>
                      </p>
                    </div>
                  </div>
                  <div className="admin-product-price">
                    <strong>
                      {formatPrice(product.price)} <span>so‘m</span>
                    </strong>
                    {product.oldPrice && (
                      <del>{formatPrice(product.oldPrice)} so‘m</del>
                    )}
                  </div>
                  <span
                    className={`admin-status ${product.isActive ? "is-active" : ""}`}
                  >
                    <span />
                    {product.isActive ? "Faol" : "Nofaol"}
                  </span>
                  <div className="admin-actions">
                    {deletingId === product.id ? (
                      <>
                        <span>O‘chirishni tasdiqlaysizmi?</span>
                        <button
                          className="danger-button"
                          disabled={deleteState.isLoading}
                          onClick={() => handleDelete(product.id)}
                        >
                          Ha, o‘chirish
                        </button>
                        <button
                          disabled={deleteState.isLoading}
                          onClick={() => setDeletingId(null)}
                        >
                          Bekor qilish
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          disabled={deleteState.isLoading}
                          onClick={() => {
                            setEditing(product);
                            setShowForm(true);
                            setMessage("");
                            setActionError("");
                            setDeletingId(null);
                          }}
                        >
                          Tahrirlash
                        </button>
                        <button
                          className="danger-button"
                          disabled={deleteState.isLoading}
                          onClick={() => setDeletingId(product.id)}
                        >
                          O‘chirish
                        </button>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
            <div className="admin-list-footer">
              {visibleProducts.length} ta mahsulot ko‘rsatilmoqda
            </div>
          </section>
        </>
      )}
    </>
  );
}

export default function AdminPanel() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const {
    data: admin,
    isLoading,
    isFetching,
    error,
  } = useGetAdminQuery(undefined, { skip: !token });

  function logout() {
    dispatch(setAccessToken(""));
    dispatch(baseApi.util.resetApiState());
  }

  if (!token) return <AdminLogin />;
  if (isLoading || isFetching)
    return (
      <p className="admin-state" role="status">
        Kirish huquqi tekshirilmoqda...
      </p>
    );
  if (error || !admin)
    return (
      <div className="admin-state" role="alert">
        <p>{apiError(error)}</p>
        <button onClick={logout}>Kirishga qaytish</button>
      </div>
    );

  return (
    <>
      <div className="admin-account">
        <span className="admin-avatar" aria-hidden="true">
          {admin.email.charAt(0).toUpperCase()}
        </span>
        <div>
          <p>{admin.email}</p>
          <span>{admin.role === "owner" ? "Sayt egasi" : "Administrator"}</span>
        </div>
        <button onClick={logout}>Chiqish</button>
      </div>
      <ProductManager />
    </>
  );
}
