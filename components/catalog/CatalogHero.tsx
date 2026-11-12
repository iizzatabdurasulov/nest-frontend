import { ArrowDownRight, Sparkles } from "@/components/Icon";
import { Button } from "@/components/ui/button";
export default function CatalogHero({
  compact = false,
}: {
  compact?: boolean;
}) {
  if (compact)
    return (
      <div className="mb-8">
        <p className="mb-3 text-xs font-semibold tracking-widest text-[#65804a] uppercase">
          Forma / Katalog
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Barcha mahsulotlar<span className="text-[#65804a]">.</span>
        </h1>
        <p className="mt-3 text-sm text-stone-500">
          Bir joyda qidiring, o‘zingizga mosini toping.
        </p>
      </div>
    );
  return (
    <section
      className="relative mb-9 overflow-hidden rounded-3xl bg-[#203e31] p-7 text-white sm:p-10 lg:p-12"
      aria-labelledby="hero-title"
    >
      <div
        className="pointer-events-none absolute -top-24 -right-20 size-96 rounded-full bg-[#65804a]/20 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-end">
        <div>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] tracking-wider text-[#dce9b5]">
            <Sparkles className="size-3" /> YANGI KUN. YANGI TANLOV.
          </span>
          <h1
            id="hero-title"
            className="max-w-xl text-4xl leading-[1.1] font-medium tracking-[-1.5px] sm:text-5xl"
          >
            Yaxshi tanlov.
            <br />
            <span className="text-[#c6db96]">Sizga mos forma.</span>
          </h1>
        </div>
        <div className="md:max-w-xs md:justify-self-end">
          <p className="mb-6 text-sm leading-7 text-stone-300">
            Hayotingizga qulaylik qo‘shadigan mahsulotlarni kashf eting. Oddiy,
            o‘ylangan va siz uchun.
          </p>
          <Button
            asChild
            className="h-11 rounded-full bg-white text-stone-900 hover:bg-[#eff3e7]"
          >
            <a href="#catalog">
              Katalogni ko‘rish <ArrowDownRight />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
