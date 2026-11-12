import Products from "./Products";
import SiteHeader from "./layout/SiteHeader";
import SiteFooter from "./layout/SiteFooter";
import CatalogHero from "./catalog/CatalogHero";
export { default as Header } from "./layout/SiteHeader";
export { default as Footer } from "./layout/SiteFooter";

export default function Storefront({
  catalogOnly = false,
}: {
  catalogOnly?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8f2]">
      <SiteHeader active={catalogOnly ? "/products" : "/"} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pt-8 pb-16 sm:px-8">
        <CatalogHero compact={catalogOnly} />
        <Products />
      </main>
      <SiteFooter />
    </div>
  );
}
