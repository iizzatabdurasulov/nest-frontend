import { baseApi } from "@/lib/redux/baseApi";
import type { Product } from "@/features/products/productsApi";

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  createdAt: string;
}

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<Cart | null, void>({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation<Omit<CartItem, "product">, number>({
      query: (productId) => ({
        url: `/cart/items/${productId}`,
        method: "POST",
      }),
      invalidatesTags: ["Cart"],
    }),
    decrementCartItem: builder.mutation<{ count: number }, number>({
      query: (productId) => ({
        url: `/cart/items/${productId}/decrement`,
        method: "POST",
      }),
      invalidatesTags: ["Cart"],
    }),
    removeCartItem: builder.mutation<{ count: number }, number>({
      query: (productId) => ({
        url: `/cart/items/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation<{ count: number }, void>({
      query: () => ({ url: "/cart", method: "DELETE" }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveCartItemMutation,
  useDecrementCartItemMutation,
  useClearCartMutation,
} = cartApi;
