import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Package, Sparkles } from "@/components/Icon";
import CurrencySelector from "@/components/layout/CurrencySelector";
import Brand from "@/components/layout/Brand";
export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f8f2] lg:grid lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="flex flex-wrap items-center justify-between gap-4 bg-[#203e31] p-5 text-white lg:sticky lg:top-0 lg:h-screen lg:flex-nowrap lg:flex-col lg:items-stretch lg:justify-start lg:p-6">
        <Brand light />
        <p className="mt-12 mb-4 hidden text-[10px] tracking-widest text-stone-500 lg:block">
          BOSHQARUV
        </p>
        <nav className="flex gap-2 lg:flex-col" aria-label="Admin menyusi">
          <Link
            href="/admin"
            aria-current="page"
            className="flex items-center gap-3 rounded-xl bg-[#65804a]/20 px-3 py-3 text-xs font-medium text-[#dce9b5]"
          >
            <Package className="size-4" /> Mahsulotlar
          </Link>
          <Link
            href="/products"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-xs text-stone-400 hover:bg-white/5"
          >
            <ArrowUpRight className="size-4" />
            <span className="hidden sm:inline">Saytga o‘tish</span>
          </Link>
        </nav>
        <div className="mt-auto hidden rounded-2xl border border-white/10 bg-white/5 p-4 lg:block">
          <Sparkles className="mb-3 size-5 text-[#c6db96]" />
          <p className="text-xs leading-6 text-stone-400">
            Katalogingizni bir joydan boshqaring.
          </p>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 bg-white px-5 py-5 text-xs text-stone-400 sm:px-8">
          <span>
            Forma <span className="mx-3 text-stone-200">/</span> Boshqaruv
            paneli
          </span>
          <CurrencySelector />
        </header>
        <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          <p className="mb-3 text-[10px] font-semibold tracking-[2px] text-[#65804a] uppercase">
            Sizning ish makoningiz
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Mahsulotlar boshqaruvi<span className="text-[#65804a]">.</span>
          </h1>
          <p className="mt-3 mb-7 text-sm text-stone-400">
            Katalogni yangilang. Har bir detal nazoratingizda.
          </p>
          {children}
        </main>
      </div>
    </div>
  );
}
