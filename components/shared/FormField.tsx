import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
export default function FormField({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "flex min-w-0 flex-col gap-2 text-xs font-medium text-stone-600",
        className,
      )}
    >
      {label}
      {children}
    </label>
  );
}
