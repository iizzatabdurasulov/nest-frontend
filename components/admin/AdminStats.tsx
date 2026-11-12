import { Boxes, CheckCircle2, Shapes } from "@/components/Icon";
import type { Product } from "@/features/products/productsApi";
import { Card, CardContent } from "@/components/ui/card";
export default function AdminStats({ products }: { products: Product[] }) {
  const items = [
    { label: "Jami mahsulotlar", value: products.length, icon: Boxes },
    {
      label: "Faol mahsulotlar",
      value: products.filter((p) => p.isActive).length,
      icon: CheckCircle2,
    },
    {
      label: "Kategoriyalar",
      value: new Set(products.map((p) => p.category).filter(Boolean)).size,
      icon: Shapes,
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map(({ label, value, icon: Icon }) => (
        <Card key={label} className="border-stone-200/80 shadow-none">
          <CardContent className="flex items-center gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#eff3e7] text-[#65804a]">
              <Icon className="size-5" />
            </span>
            <div>
              <p className="text-xs text-stone-400">{label}</p>
              <strong className="mt-1 block text-3xl font-semibold tracking-tight">
                {value}
              </strong>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
