import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Slot } from "radix-ui";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-zinc-200 border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-zinc-400 focus-visible:ring-[3px] focus-visible:ring-zinc-400/50 aria-invalid:border-red-600 aria-invalid:ring-red-600/20 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-zinc-900 text-zinc-50 [a&]:hover:bg-zinc-900/90",
        secondary: "bg-zinc-100 text-zinc-900 [a&]:hover:bg-zinc-100/90",
        destructive:
          "bg-red-600 text-white focus-visible:ring-red-600/20 [a&]:hover:bg-red-600/90",
        outline:
          "border-zinc-200 text-zinc-950 [a&]:hover:bg-zinc-100 [a&]:hover:text-zinc-900",
        ghost: "[a&]:hover:bg-zinc-100 [a&]:hover:text-zinc-900",
        link: "text-zinc-900 underline-offset-4 [a&]:hover:underline ",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
