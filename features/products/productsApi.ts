import { baseApi } from "@/lib/redux/baseApi";

export interface Product {
  id: number;
  title: string;
  price: number | string;
  deliveryPrice: number | string;
  oldPrice: string | null;
  desc: string;
  category: string;
  isActive: boolean;
  isSale: boolean;
  views: number;
  soldCount: number;
  createdAt: string;
  userId: number;
  image: string | null;
}

export interface ProductInput {
  title: string;
  isActive?: boolean;
  price: number;
  deliveryPrice?: number;
  oldPrice?: number | null;
  desc: string;
  category: string;
  image?: string | null;
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get products
    getProducts: builder.query<Product[], void>({
      query: (currency) => ({
        url: `/products?currency=${currency}`,
        method: "GET"
      }),
      providesTags: ["Products"],
    }),

    // Get product by id

    getProductById: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
      providesTags: ["Products"],
    }),

    // Add products

    addProduct: builder.mutation<Product, ProductInput>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products", "Cart"],
    }),

    // Delete products

    deleteProduct: builder.mutation<{ message: string; data: Product }, number>(
      {
        query: (id) => ({
          url: `/products/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Products", "Cart"],
      },
    ),

    updateProduct: builder.mutation<
      Product,
      { id: number; body: ProductInput }
    >({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Products", "Cart"],
    }),
    uploadImage: builder.mutation<{ image: string }, FormData>({
      query: (body) => ({ url: "/products/upload", method: "POST", body }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useUploadImageMutation,
} = productsApi;
