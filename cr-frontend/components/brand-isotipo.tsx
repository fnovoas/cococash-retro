import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandIsotipoProps {
  size?: number;
  className?: string;
  priority?: boolean;
}

export function BrandIsotipo({
  size = 80,
  className,
  priority = false,
}: BrandIsotipoProps) {
  const intrinsic = 64;

  return (
    <Image
      src="/isotipo.png"
      alt="CocoCash Retro"
      width={intrinsic}
      height={intrinsic}
      priority={priority}
      unoptimized
      className={cn("pixelated shrink-0 [image-rendering:pixelated]", className)}
      style={{
        imageRendering: "pixelated",
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
}
