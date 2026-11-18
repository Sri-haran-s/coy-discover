"use client";

import { useEffect, useRef, useState } from "react";
import { fallbackAvatar } from "@/lib/avatar";
import { cn } from "@/lib/utils";

interface SmartImageProps {
  src: string;
  alt: string;
  /** Used to build the on-brand fallback portrait if `src` fails. */
  fallbackName: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}

/**
 * <img> with a shimmer placeholder while loading and a generated fallback
 * portrait if the remote photo fails. Fills its parent by default.
 */
export function SmartImage({
  src,
  alt,
  fallbackName,
  className,
  imgClassName,
  priority = false,
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset when the source changes; also catch images that finished before hydration.
  useEffect(() => {
    setFailed(false);
    const img = imgRef.current;
    setLoaded(Boolean(img?.complete && img.naturalWidth > 0));
  }, [src]);

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-cream-200", className)}>
      {!loaded && <div aria-hidden className="shimmer absolute inset-0" />}
      {/* eslint-disable-next-line @next/next/no-img-element -- remote placeholder portraits */}
      <img
        ref={imgRef}
        src={failed ? fallbackAvatar(fallbackName) : src}
        alt={alt}
        draggable={false}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={cn(
          "h-full w-full select-none object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          imgClassName,
        )}
      />
    </div>
  );
}
