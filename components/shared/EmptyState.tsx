import type { ReactNode } from "react";
import { PackageSearch } from "@/components/Icon";
import { Card, CardContent } from "@/components/ui/card";

export default function EmptyState({
  title,
  description,
  children,
  error = false,
}: {
  title: string;
  description: string;
  children?: ReactNode;
  error?: boolean;
}) {
  return (
    <Card className="border-dashed shadow-none">
      <CardContent
        className="flex min-h-64 flex-col items-center justify-center gap-4 px-6 py-12 text-center"
        role={error ? "alert" : "status"}
      >
        <span className="grid size-14 place-items-center rounded-2xl bg-[#eff3e7] text-[#65804a]">
          <PackageSearch className="size-6" />
        </span>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-stone-500">
            {description}
          </p>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
