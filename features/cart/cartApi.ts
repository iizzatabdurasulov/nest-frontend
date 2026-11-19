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
  subTotal: number;
  deliveryPrice: number;
  totalPrice: number;
}

function changeCachedQuantity(cart: Cart | null, productId: number, delta: number) {
  const item = cart?.items.find((item) => item.productId === productId);
  if (!cart || !item) return 0;
  const previousQuantity = item.quantity;
  item.quantity = Math.max(1, item.quantity + delta);
  cart.subTotal = cart.items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity, 0,
  );
  cart.deliveryPrice = cart.items.reduce(
    (sum, item) => sum + Number(item.product.deliveryPrice) * item.quantity, 0,
  );
  cart.totalPrice = cart.subTotal + cart.deliveryPrice;
  return item.quantity - previousQuantity;
}

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<Cart | null, void>({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        const result = await baseQuery("/cart");
        if (result.error?.status === 404) return { data: null };
        if (result.error) return { error: result.error };
        return { data: result.data as Cart | null };
      },
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation<Omit<CartItem, "product">, number>({
      query: (productId) => ({
        url: `/cart/items/${productId}`,
        method: "POST",
      }),
      async onQueryStarted(productId, { dispatch, queryFulfilled }) {
        let appliedDelta = 0;
        dispatch(cartApi.util.updateQueryData("getCart", undefined, (cart) => {
          appliedDelta = changeCachedQuantity(cart, productId, 1);
        }));
        try {
          await queryFulfilled;
        } catch {
          dispatch(cartApi.util.updateQueryData("getCart", undefined, (cart) => {
            changeCachedQuantity(cart, productId, -appliedDelta);
          }));
        }
      },
      invalidatesTags: ["Cart"],
    }),
    decrementCartItem: builder.mutation<{ count: number }, number>({
      query: (productId) => ({
        url: `/cart/items/${productId}/decrement`,
        method: "POST",
      }),
      async onQueryStarted(productId, { dispatch, queryFulfilled }) {
        let appliedDelta = 0;
        dispatch(cartApi.util.updateQueryData("getCart", undefined, (cart) => {
          appliedDelta = changeCachedQuantity(cart, productId, -1);
        }));
        try {
          await queryFulfilled;
        } catch {
          dispatch(cartApi.util.updateQueryData("getCart", undefined, (cart) => {
            changeCachedQuantity(cart, productId, -appliedDelta);
          }));
        }
      },
      invalidatesTags: ["Cart"],
    }),
    removeCartItem: builder.mutation<{ count: number }, number>({
      query: (productId) => ({
        url: `/cart/items/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    setCartQuantity: builder.mutation<{ count: number }, { productId: number; quantity: number }>({
      query: ({ productId, quantity }) => ({
        url: `/cart/items/${productId}`,
        method: "PATCH",
        body: { quantity },
      }),
      async onQueryStarted({ productId, quantity }, { dispatch, queryFulfilled }) {
        let appliedDelta = 0;
        dispatch(cartApi.util.updateQueryData("getCart", undefined, (cart) => {
          const item = cart?.items.find((item) => item.productId === productId);
          if (item) appliedDelta = changeCachedQuantity(cart, productId, quantity - item.quantity);
        }));
        try {
          await queryFulfilled;
        } catch {
          dispatch(cartApi.util.updateQueryData("getCart", undefined, (cart) => {
            changeCachedQuantity(cart, productId, -appliedDelta);
          }));
        }
      },
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
  useSetCartQuantityMutation,
} = cartApi;
