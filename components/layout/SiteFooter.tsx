import Link from "next/link";
import { ArrowUpRight } from "@/components/Icon";
import Brand from "./Brand";
export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-stone-200/70 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-5 py-7 sm:px-8">
        <Brand />
        <p className="text-xs text-stone-400">
          Kundalik hayot uchun, did bilan tanlangan.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-medium text-stone-500 hover:text-[#244c3b]"
        >
          Katalogga o‘tish <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </footer>
  );
}
