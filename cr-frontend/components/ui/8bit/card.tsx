import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

import {
  Card as ShadcnCard,
  CardAction as ShadcnCardAction,
  CardContent as ShadcnCardContent,
  CardDescription as ShadcnCardDescription,
  CardFooter as ShadcnCardFooter,
  CardHeader as ShadcnCardHeader,
  CardTitle as ShadcnCardTitle,
} from "@/components/ui/card";

import "./styles/retro.css";

export type RetroFrame = "primary" | "foreground" | "brand" | "none";

const frameBorderClass: Record<Exclude<RetroFrame, "none">, string> = {
  primary: "border-primary",
  foreground: "border-foreground dark:border-ring",
  brand: "border-[#9bb16b]",
};

export const cardVariants = cva("", {
  variants: {
    font: {
      normal: "",
      retro: "retro",
    },
  },
  defaultVariants: {
    font: "retro",
  },
});

export interface BitCardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
  frame?: RetroFrame;
  wrapperClassName?: string;
}

function Card({
  className,
  wrapperClassName,
  font,
  frame = "none",
  ...props
}: BitCardProps) {
  const innerCard = (
    <ShadcnCard
      {...props}
      className={cn(
        "rounded-none !w-full shadow-none gap-0 !py-0 relative",
        frame !== "none" && "border-4 bg-card",
        frame === "brand" && "border-white",
        frame !== "none" && frame !== "brand" && "border-background",
        font !== "normal" && "retro",
        className
      )}
    />
  );

  if (frame === "none") {
    return innerCard;
  }

  const borderClass = frameBorderClass[frame];

  return (
    <div
      className={cn("relative !p-0 border-y-6", borderClass, wrapperClassName)}
    >
      {innerCard}
      <div
        className={cn(
          "absolute inset-0 border-x-6 -mx-1.5 pointer-events-none",
          borderClass
        )}
        aria-hidden="true"
      />
    </div>
  );
}

function CardHeader({ className, font, ...props }: BitCardProps) {
  return (
    <ShadcnCardHeader
      className={cn(
        font !== "normal" && "retro",
        "px-6 pt-6 pb-4",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, font, ...props }: BitCardProps) {
  return (
    <ShadcnCardTitle
      className={cn(font !== "normal" && "retro", className)}
      {...props}
    />
  );
}

function CardDescription({ className, font, ...props }: BitCardProps) {
  return (
    <ShadcnCardDescription
      className={cn(font !== "normal" && "retro", className)}
      {...props}
    />
  );
}

function CardAction({ className, font, ...props }: BitCardProps) {
  return (
    <ShadcnCardAction
      className={cn(font !== "normal" && "retro", className)}
      {...props}
    />
  );
}

function CardContent({ className, font, ...props }: BitCardProps) {
  return (
    <ShadcnCardContent
      className={cn(
        font !== "normal" && "retro",
        "px-6 pb-6 pt-4",
        className
      )}
      {...props}
    />
  );
}

function CardFooter({ className, font, ...props }: BitCardProps) {
  return (
    <ShadcnCardFooter
      data-slot="card-footer"
      className={cn(font !== "normal" && "retro", "px-6 pb-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
