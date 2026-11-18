import type { useProductForm } from "@/hooks/useProductForm";
import FormField from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ProductImageField from "./ProductImageField";
export default function ProductFields({
  form,
}: {
  form: ReturnType<typeof useProductForm>;
}) {
  return (
    <div className="grid gap-7 lg:grid-cols-[1.3fr_1fr]">
      <div className="space-y-5">
        <FormField label="Mahsulot nomi">
          <Input
            required
            minLength={2}
            value={form.title}
            placeholder="Masalan, MacBook Air"
            onChange={(e) => form.setTitle(e.target.value)}
          />
        </FormField>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 p-4">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={(event) => form.setIsActive(event.target.checked)}
            className="size-4 accent-emerald-700"
          />
          <span className="text-sm font-medium text-stone-700">
            Faol mahsulot
            <span className="mt-1 block text-xs font-normal text-stone-500">
              Joriy holat: {form.isActive ? "Faol" : "Nofaol"}
            </span>
          </span>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Narx ($)">
            <Input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={form.price}
              onChange={(e) => form.setPrice(e.target.value)}
            />
          </FormField>
          <FormField label="Eski narx ($, ixtiyoriy)">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.oldPrice}
              onChange={(e) => form.setOldPrice(e.target.value)}
            />
          </FormField>
        </div>
        <FormField label="Yetkazib berish narxi ($)">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={form.deliveryPrice}
            onChange={(e) => form.setDeliveryPrice(e.target.value)}
          />
          <span className="text-xs font-normal text-stone-500">
            Bepul yetkazib berish uchun 0 kiriting. Bo‘sh qoldirilsa ham 0 saqlanadi.
          </span>
        </FormField>
        <FormField label="Kategoriya">
          <Input
            value={form.category}
            placeholder="Masalan, Laptop"
            onChange={(e) => form.setCategory(e.target.value)}
          />
        </FormField>
        <FormField label="Tavsif">
          <Textarea
            rows={4}
            value={form.desc}
            placeholder="Mahsulot haqida qisqacha ma’lumot..."
            onChange={(e) => form.setDesc(e.target.value)}
            className="resize-y"
          />
        </FormField>
      </div>
      <div>
        <ProductImageField
          image={form.image}
          title={form.title}
          onFile={form.setFile}
          onRemove={() => {
            form.setImage("");
            form.setFile(null);
          }}
        />
      </div>
    </div>
  );
}
