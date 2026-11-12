import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-zinc-500 focus-visible:border-[#65804a] focus-visible:ring-[3px] focus-visible:ring-[#65804a]/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-600 aria-invalid:ring-red-600/20 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
