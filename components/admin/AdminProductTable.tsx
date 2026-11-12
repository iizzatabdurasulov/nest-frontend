import { Pencil, Trash2 } from "@/components/Icon";
import type { Product } from "@/features/products/productsApi";
import CurrencyAmount from "@/components/shared/CurrencyAmount";
import ProductImage from "@/components/ProductImage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
export default function AdminProductTable({
  products,
  onEdit,
  onDelete,
}: {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-stone-50/80 hover:bg-stone-50">
          <TableHead className="pl-6">Mahsulot</TableHead>
          <TableHead>Narx</TableHead>
          <TableHead>Holati</TableHead>
          <TableHead className="pr-6 text-right">Amallar</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="min-w-52 py-4 pl-6">
              <div className="flex items-center gap-3">
                <div className="size-12 shrink-0 overflow-hidden rounded-xl border border-stone-100 bg-stone-50">
                  <ProductImage
                    compact
                    className="p-1"
                    image={product.image}
                    title={product.title}
                  />
                </div>
                <div className="max-w-64">
                  <p className="truncate font-medium text-stone-800">
                    {product.title}
                  </p>
                  <p className="mt-1 text-xs text-stone-400">
                    {product.category} · #{product.id}
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell className="font-medium whitespace-nowrap">
              <CurrencyAmount amount={product.price} />
            </TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className={
                  product.isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-stone-100 text-stone-500"
                }
              >
                {product.isActive ? "Faol" : "Nofaol"}
              </Badge>
            </TableCell>
            <TableCell className="pr-6">
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`${product.title}: tahrirlash`}
                  onClick={() => onEdit(product)}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                  aria-label={`${product.title}: o‘chirish`}
                  onClick={() => onDelete(product)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
