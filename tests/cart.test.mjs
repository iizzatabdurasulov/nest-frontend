import { afterEach, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { setAccessToken } from "../features/auth/authSlice";
import currencyReducer from "../features/currency/currencySlice";
import { cartApi } from "../features/cart/cartApi";
import Cart from "../components/cart/Cart";
import CartLink from "../components/cart/CartLink";
import QuantityControl from "../components/cart/QuantityControl";

const originalFetch = globalThis.fetch;
const stores = [];
afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const store of stores.splice(0))
    store.dispatch(cartApi.util.resetApiState());
});
function setup(token = "test-token") {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      currency: currencyReducer,
      [cartApi.reducerPath]: cartApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(cartApi.middleware),
  });
  store.dispatch(setAccessToken(token));
  stores.push(store);
  return store;
}
const render = (store, component) =>
  renderToStaticMarkup(
    createElement(Provider, { store }, createElement(component)),
  );

test("guests see customer login rather than admin access requirements", () => {
  const html = render(setup(""), Cart);
  expect(html).toContain("Hisobingizga kiring");
  expect(html).toContain("Ro‘yxatdan o‘ting");
  expect(html).not.toContain("admin yoki owner");
});

test("a user with no cart sees the empty state", async () => {
  const store = setup();
  await store.dispatch(
    cartApi.util.upsertQueryData("getCart", undefined, null),
  );
  const html = render(store, Cart);
  expect(html).toContain("Savatchangiz hozircha bo‘sh");
  expect(html).toContain('href="/products"');
});

test("cart renders backend delivery and totals with quantities and product links", async () => {
  const store = setup();
  await store.dispatch(
    cartApi.util.upsertQueryData("getCart", undefined, {
      id: 7,
      userId: 42,
      subTotal: 55,
      deliveryPrice: 8,
      totalPrice: 63,
      items: [
        {
          id: 101,
          productId: 5,
          quantity: 2,
          product: {
            id: 5,
            title: "Test stul",
            category: "Mebel",
            price: "12.50",
            deliveryPrice: "3.00",
            image: null,
            isActive: true,
          },
        },
        {
          id: 102,
          productId: 6,
          quantity: 1,
          product: {
            id: 6,
            title: "Test stol",
            category: "Mebel",
            price: "30.00",
            deliveryPrice: "2.00",
            image: null,
            isActive: false,
          },
        },
      ],
    }),
  );
  const html = render(store, Cart);
  expect(html).toContain("Test stul");
  expect(html).toContain('href="/products/5"');
  expect(html).toContain("$25.00");
  expect(html).toContain("$55.00");
  expect(html).toContain("$8.00");
  const delivery = html.match(
    /<ul[^>]*aria-label="Mahsulotlar bo‘yicha yetkazib berish narxlari"[^>]*>(.*?)<\/ul>/s,
  )?.[1];
  expect(delivery).toBeDefined();
  expect(delivery).toContain("Test stul");
  expect(delivery).toContain("Test stol");
  expect(delivery).toContain("$3.00");
  expect(delivery).toContain("× 2 dona");
  expect(delivery).toContain("$6.00");
  expect(delivery).toContain("$2.00");
  expect(html).toContain("Jami yetkazib berish");
  expect(html).not.toContain("eng yuqori yetkazib berish");
  expect(html).toContain("$63.00");
  expect(html).toContain("Yetkazib berish");
  expect(html).not.toContain("Yetkazib berish narxi hisobga olinmagan");
  expect(html).toContain("3 ta");
  expect(html).toContain("Hozir sotuvda yo‘q");
  expect(html).toContain("Savatchani tozalash");
  const link = render(store, CartLink);
  expect(link).toContain("Savatcha, 3 ta mahsulot");
});

test("guest cart badge does not expose previously cached quantities", async () => {
  const store = setup("");
  await store.dispatch(
    cartApi.util.upsertQueryData("getCart", undefined, {
      id: 7,
      userId: 42,
      items: [{ productId: 5, quantity: 9 }],
    }),
  );
  expect(render(store, CartLink)).toContain("Savatcha, 0 ta mahsulot");
});

function quantityButtons(props = {}) {
  const html = renderToStaticMarkup(
    createElement(QuantityControl, {
      quantity: 2,
      productTitle: "Stul",
      onIncrease: () => {},
      onDecrease: () => {},
      ...props,
    }),
  );
  const buttons = html.match(/<button\b[^>]*>/g);
  return { html, minus: buttons[0], plus: buttons[1] };
}

test("quantity control shows both actions around the current quantity", () => {
  const { html, minus, plus } = quantityButtons({ quantity: 12 });
  expect(html).toContain(">12</output>");
  expect(minus).toContain("bittaga kamaytirish");
  expect(plus).toContain("bittaga oshirish");
  expect(minus).not.toContain('disabled=""');
  expect(plus).not.toContain('disabled=""');
});

test("quantity control disables minus at 1 and both buttons during requests", () => {
  const minimum = quantityButtons({ quantity: 1 });
  expect(minimum.minus).toContain('disabled=""');
  expect(minimum.plus).not.toContain('disabled=""');
  const busy = quantityButtons({ disabled: true });
  expect(busy.minus).toContain('disabled=""');
  expect(busy.plus).toContain('disabled=""');
});

test("unavailable products can still be reduced but cannot be increased", () => {
  const { minus, plus } = quantityButtons({ canIncrease: false });
  expect(minus).not.toContain('disabled=""');
  expect(plus).toContain('disabled=""');
});

test("a missing backend cart renders as empty instead of an error", async () => {
  globalThis.fetch = async () =>
    Response.json({ message: "Cart not found" }, { status: 404 });
  const store = setup();
  const cart = await store
    .dispatch(cartApi.endpoints.getCart.initiate())
    .unwrap();
  expect(cart).toBeNull();
  expect(render(store, Cart)).toContain("Savatchangiz hozircha bo‘sh");
});

test("cart server failures remain errors", async () => {
  globalThis.fetch = async () =>
    Response.json({ message: "Unavailable" }, { status: 500 });
  const store = setup();
  const result = await store.dispatch(cartApi.endpoints.getCart.initiate());
  expect(result.error.status).toBe(500);
});

test("zero delivery is shown as free", async () => {
  const store = setup();
  await store.dispatch(
    cartApi.util.upsertQueryData("getCart", undefined, {
      id: 7,
      userId: 42,
      subTotal: 10,
      deliveryPrice: 0,
      totalPrice: 10,
      items: [
        {
          productId: 5,
          quantity: 1,
          product: {
            id: 5,
            title: "Test",
            price: 10,
            deliveryPrice: 0,
            isActive: true,
            category: "Mebel",
            image: null,
          },
        },
      ],
    }),
  );
  const html = render(store, Cart);
  expect(html).toContain("Bepul");
  expect(html).toContain("$10.00");
});

const quantityCart = () => ({
  id: 7,
  userId: 42,
  subTotal: 20,
  deliveryPrice: 6,
  totalPrice: 26,
  items: [
    {
      productId: 5,
      quantity: 2,
      product: {
        id: 5,
        title: "Stul",
        price: "10",
        deliveryPrice: "3",
        isActive: true,
        category: "Mebel",
        image: null,
      },
    },
  ],
});
const cachedCart = (store) =>
  cartApi.endpoints.getCart.select()(store.getState()).data;

test("quantity and delivery update immediately while the server request is pending", async () => {
  const store = setup();
  await store.dispatch(
    cartApi.util.upsertQueryData("getCart", undefined, quantityCart()),
  );
  let finish;
  globalThis.fetch = () =>
    new Promise((resolve) => {
      finish = resolve;
    });
  const request = store.dispatch(cartApi.endpoints.addToCart.initiate(5));
  expect(cachedCart(store).items[0].quantity).toBe(3);
  expect(cachedCart(store).subTotal).toBe(30);
  expect(cachedCart(store).deliveryPrice).toBe(9);
  expect(cachedCart(store).totalPrice).toBe(39);
  const html = render(store, Cart);
  expect(html).toContain("Stul");
  expect(html).toContain("$39.00");
  expect(html).not.toContain("Savatcha yuklanmoqda");
  while (!finish) await Bun.sleep(1);
  finish(Response.json({ productId: 5, quantity: 3 }));
  await request.unwrap();
});

test("failed quantity changes restore both the quantity and delivery totals", async () => {
  const store = setup();
  await store.dispatch(
    cartApi.util.upsertQueryData("getCart", undefined, quantityCart()),
  );
  store.dispatch(cartApi.endpoints.getCart.initiate());
  let finish;
  globalThis.fetch = (request) =>
    request.method === "GET"
      ? Promise.resolve(Response.json(quantityCart()))
      : new Promise((resolve) => {
          finish = resolve;
        });
  const request = store.dispatch(
    cartApi.endpoints.decrementCartItem.initiate(5),
  );
  expect(cachedCart(store).items[0].quantity).toBe(1);
  expect(cachedCart(store).totalPrice).toBe(13);
  while (!finish) await Bun.sleep(1);
  finish(Response.json({ message: "Unavailable" }, { status: 500 }));
  await request;
  expect(cachedCart(store)).toEqual(quantityCart());
});

test("background refetch retains the cart and totals without a loading screen", async () => {
  const store = setup();
  await store.dispatch(
    cartApi.util.upsertQueryData("getCart", undefined, quantityCart()),
  );
  let finish;
  globalThis.fetch = () =>
    new Promise((resolve) => {
      finish = resolve;
    });
  const request = store.dispatch(
    cartApi.endpoints.getCart.initiate(undefined, { forceRefetch: true }),
  );
  const html = render(store, Cart);
  expect(html).toContain("Stul");
  expect(html).toContain("$26.00");
  expect(html).not.toContain("Savatcha yuklanmoqda");
  while (!finish) await Bun.sleep(1);
  finish(Response.json(quantityCart()));
  await request.unwrap();
});
