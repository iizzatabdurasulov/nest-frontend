import { ImagePlus, X } from "@/components/Icon";
import { useRef } from "react";
import ProductImage from "@/components/ProductImage";
import FormField from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
type Props = {
  image: string;
  title: string;
  onFile: (file: File | null) => void;
  onRemove: () => void;
};
export default function ProductImageField({
  image,
  title,
  onFile,
  onRemove,
}: Props) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-4 rounded-xl border border-dashed border-[#dce9b5] bg-[#eff3e7]/40 p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-white text-[#65804a]">
          <ImagePlus className="size-5" />
        </span>
        <div>
          <h3 className="text-sm font-medium">Mahsulot rasmi</h3>
          <p className="mt-1 text-xs text-stone-400">
            JPG, PNG yoki WebP · 5 MB gacha
          </p>
        </div>
      </div>
      <FormField label="Rasm tanlash">
        <Input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          className="h-auto bg-white py-2"
        />
      </FormField>
      {image && (
        <div className="flex items-center gap-3">
          <div className="size-16 overflow-hidden rounded-xl border bg-white">
            <ProductImage compact image={image} title={title} className="p-1" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => {
              if (input.current) input.current.value = "";
              onRemove();
            }}
          >
            <X /> Rasmni olib tashlash
          </Button>
        </div>
      )}
    </div>
  );
}
