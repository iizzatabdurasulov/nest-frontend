"use client";

import { SlidersHorizontal } from "@/components/Icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sortOptions = [
  { value: "newest", label: "Eng yangilari" },
  { value: "low", label: "Narx: arzondan" },
  { value: "high", label: "Narx: qimmatdan" },
];

type SortSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
};

export default function SortSelect({ value, onValueChange }: SortSelectProps) {
  return (
    <div className="flex items-center gap-3">
      <SlidersHorizontal
        aria-hidden="true"
        className="size-4 shrink-0 text-stone-400"
      />
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          aria-label="Mahsulotlarni saralash"
          className="h-11 w-full rounded-lg border-stone-200 bg-white text-stone-700 shadow-none sm:w-48"
        >
          <SelectValue placeholder="Saralash" />
        </SelectTrigger>
        <SelectContent
          position="popper"
          align="end"
          sideOffset={8}
          className="min-w-52 rounded-xl border-stone-200 bg-white p-1 shadow-xl shadow-stone-900/10"
        >
          {sortOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="cursor-pointer rounded-lg py-2.5 text-stone-600 focus:bg-[#eff3e7] focus:text-[#244c3b] data-[state=checked]:bg-[#eff3e7] data-[state=checked]:font-medium data-[state=checked]:text-[#244c3b]"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
