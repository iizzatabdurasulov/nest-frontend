"use client";

import { useState } from "react";
import Icon from "./Icon";

type ProductImageProps = {
  image?: string | null;
  title: string;
  className?: string;
  compact?: boolean;
};

export default function ProductImage({
  image,
  title,
  className = "",
  compact = false,
}: ProductImageProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  let source = "";

  try {
    const resolved = image ? new URL(image, new URL(apiUrl).origin) : null;
    if (resolved && ["http:", "https:"].includes(resolved.protocol)) {
      source = resolved.href;
    }
  } catch {
    // Invalid image URLs use the placeholder.
  }

  if (!source || failedSource === source) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center text-center ${compact ? "gap-[3px] text-[9px] text-[#9aa68c]" : "gap-2 text-[11px] text-[#a1ad93]"}`}
      >
        <Icon
          name="box"
          className={compact ? "size-[18px]" : "size-8 stroke-1"}
        />
        {!compact && <span>Rasm mavjud emas</span>}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`h-full w-full object-contain ${className}`}
      src={source}
      alt={title}
      loading="lazy"
      onError={() => setFailedSource(source)}
    />
  );
}
