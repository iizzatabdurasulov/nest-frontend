import Link from "next/link";
import { ArrowUpRight } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import CurrencySelector from "./CurrencySelector";
import Brand from "./Brand";
import { cn } from "@/lib/utils";
export default function SiteHeader({ active = "/" }: { active?: string }) {
  return (
    <header className="border-b border-stone-200/70 bg-white/95">
      <div className="mx-auto flex min-h-20 max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Brand />
        <nav
          className="order-3 flex w-full gap-6 text-sm sm:order-none sm:w-auto"
          aria-label="Asosiy menyu"
        >
          {[
            { href: "/", label: "Bosh sahifa" },
            { href: "/products", label: "Mahsulotlar" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active === item.href ? "page" : undefined}
              className={cn(
                "py-1 transition-colors hover:text-[#244c3b]",
                active === item.href
                  ? "font-semibold text-stone-900"
                  : "text-stone-400",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <CurrencySelector />
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link href="/admin">
              Admin panel <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
