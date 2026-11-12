import { Suspense } from "react";
import ProductDetail from "@/components/ProductDetail";
import { Header, Footer } from "@/components/Storefront";

async function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetail id={Number(id)} />;
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8f2] text-stone-900">
      <Header active="/products" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pt-8 pb-16 sm:px-8 lg:px-10">
        <Suspense
          fallback={
            <p className="rounded-2xl border border-zinc-200 bg-white p-8 text-sm text-zinc-400">
              Yuklanmoqda...
            </p>
          }
        >
          <Detail params={params} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
