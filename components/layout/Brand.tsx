import Link from "next/link";
import { Layers2 } from "@/components/Icon";
import { cn } from "@/lib/utils";
export default function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Forma bosh sahifa"
      className={cn(
        "inline-flex items-center gap-2.5 text-2xl font-bold tracking-tight",
        light ? "text-white" : "text-stone-950",
      )}
    >
      <span className="grid size-8 place-items-center rounded-xl bg-[#244c3b] text-white">
        <Layers2 className="size-4" />
      </span>
      forma<span className="-ml-2 text-[#65804a]">.</span>
    </Link>
  );
}
