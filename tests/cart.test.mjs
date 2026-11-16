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

const stores = [];
afterEach(() => {
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

test("cart renders quantities, line totals, total and product links", async () => {
  const store = setup();
  await store.dispatch(
    cartApi.util.upsertQueryData("getCart", undefined, {
      id: 7,
      userId: 42,
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
