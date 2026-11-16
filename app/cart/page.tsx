import Cart from "@/components/cart/Cart";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata = { title: "Savatcha | Forma" };

export default function CartPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8f2] text-stone-900">
      <SiteHeader active="/cart" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pt-8 pb-16 sm:px-8">
        <Cart />
      </main>
      <SiteFooter />
    </div>
  );
}
