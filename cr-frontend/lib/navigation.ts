import {
  CreditCard,
  Download,
  FileText,
  History,
  Home,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export const dashboardNavItems: NavItem[] = [
  { title: "Inicio", url: "/dashboard", icon: Home },
  { title: "Transferir", url: "/transfer", icon: CreditCard },
  { title: "Movimientos", url: "/balance", icon: History },
  { title: "Depositar", url: "/deposit", icon: Download },
  { title: "Certificados", url: "/certificates", icon: FileText },
];
