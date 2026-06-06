import {
  Card,
  CardContent,
  CardHeader,
  type BitCardProps,
  type RetroFrame,
} from "@/components/ui/8bit/card";
import { cn } from "@/lib/utils";

export interface RetroPanelProps extends Omit<BitCardProps, "frame"> {
  frame?: RetroFrame;
  wrapperClassName?: string;
  header?: React.ReactNode;
  headerClassName?: string;
  contentClassName?: string;
  children: React.ReactNode;
}

export function RetroPanel({
  frame = "primary",
  className,
  wrapperClassName,
  header,
  headerClassName,
  contentClassName,
  children,
  ...cardProps
}: RetroPanelProps) {
  return (
    <Card
      frame={frame}
      className={className}
      wrapperClassName={wrapperClassName}
      {...cardProps}
    >
      {header && (
        <CardHeader className={cn("retro-header", headerClassName)}>
          {header}
        </CardHeader>
      )}
      <CardContent className={cn(!header && "pt-6", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
