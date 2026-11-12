"use client";
import { useState } from "react";
import Icon from "./Icon";
export default function ProductImage({
  image,
  title,
}: {
  image?: string | null;
  title: string;
}) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  let source = "";
  try {
    const resolved = image ? new URL(image, new URL(apiUrl).origin) : null;
    if (resolved && ["http:", "https:"].includes(resolved.protocol))
      source = resolved.href;
  } catch {
    /* Invalid image URLs use the placeholder. */
  }
  if (!source || failedSource === source)
    return (
      <div className="image-placeholder">
        <Icon name="box" />
        <span>Rasm mavjud emas</span>
      </div>
    );
  // Backend upload origins are configurable; preserve the original image URL.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={source}
      alt={title}
      loading="lazy"
      onError={() => setFailedSource(source)}
    />
  );
}
