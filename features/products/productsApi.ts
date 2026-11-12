import { baseApi } from "@/lib/redux/baseApi";

export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get products
    getProducts: builder.query<Product[], void>({
      query: () => "/products",
      providesTags: ["Products"],
    }),

    // Get product by id

    getProductById: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
    }),

    // Add products

    addProduct: builder.mutation<Product, Partial<Product>>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),

    // Delete products

    deleteProduct: builder.mutation<{ message: string; data: Product }, number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    // Update product
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useDeleteProductMutation,
} = productsApi;
