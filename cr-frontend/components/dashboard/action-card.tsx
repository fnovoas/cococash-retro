import type { LucideIcon } from "lucide-react";
import { Link2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
} from "@/components/ui/8bit/card";

interface DashboardActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  onClick: () => void;
}

export function DashboardActionCard({
  icon: Icon,
  title,
  description,
  actionLabel,
  onClick,
}: DashboardActionCardProps) {
  return (
    <Card
      frame="none"
      className="h-full cursor-pointer hover:-translate-y-1 transition-transform group border-4 bg-card"
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col items-start gap-4 h-full">
        <div className="bg-primary/20 p-4 border-2 group-hover:bg-primary/40 transition-colors">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <div>
          <CardDescription className="text-xl font-black">{title}</CardDescription>
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        </div>
        <div className="mt-auto pt-4 text-primary font-bold flex items-center gap-2">
          {actionLabel} <Link2 className="w-4 h-4" />
        </div>
      </CardContent>
    </Card>
  );
}
