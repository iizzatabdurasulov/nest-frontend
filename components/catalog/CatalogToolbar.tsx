import { Search } from "@/components/Icon";
import { Input } from "@/components/ui/input";
import SortSelect from "./SortSelect";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  search: string;
  onSearch: (value: string) => void;
  category: string;
  onCategory: (value: string) => void;
  categories: string[];
  sort: string;
  onSort: (value: string) => void;
  total: number;
};
export default function CatalogToolbar({
  search,
  onSearch,
  category,
  onCategory,
  categories,
  sort,
  onSort,
  total,
}: Props) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm shadow-stone-200/30 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-stone-400"
          />
          <Input
            type="search"
            aria-label="Mahsulot qidirish"
            placeholder="Mahsulot nomini kiriting..."
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            className="h-11 border-stone-200 bg-stone-50/60 pl-10"
          />
        </div>
        <SortSelect value={sort} onValueChange={onSort} />
      </div>
      <div className="min-w-0 overflow-x-auto pb-1">
        <Tabs value={category} onValueChange={onCategory}>
          <TabsList className="h-auto w-max gap-1 bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="rounded-full px-4 py-2 data-[state=active]:bg-[#244c3b] data-[state=active]:text-white"
            >
              Barchasi <span className="ml-1 opacity-50">{total}</span>
            </TabsTrigger>
            {categories.map((name) => (
              <TabsTrigger
                key={name}
                value={name}
                className="rounded-full px-4 py-2 data-[state=active]:bg-[#244c3b] data-[state=active]:text-white"
              >
                {name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
