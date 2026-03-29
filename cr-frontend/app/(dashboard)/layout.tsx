"use client";
import React from "react";
import { CreditCard, History, Home, LogOut, FileText, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarFooter
} from "@/components/ui/sidebar";

import { DashboardHeader } from "@/components/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    { title: "Inicio", url: "/dashboard", icon: Home },
    { title: "Transferir", url: "/transfer", icon: CreditCard },
    { title: "Movimientos", url: "/balance", icon: History },
    { title: "Depositar", url: "/deposit", icon: Download },
    { title: "Certificados", url: "/certificates", icon: FileText },
  ];

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <div className="flex border w-full h-screen bg-background">
        <Sidebar className="retro border-r-4 border-foreground dark:border-ring">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-lg font-bold mt-4">CocoCash Retro</SidebarGroupLabel>
              <SidebarGroupContent className="mt-8">
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:text-destructive">
                  <LogOut />
                  <span>Cerrar sesión</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="overflow-y-auto">
          <DashboardHeader />
          <div className="flex flex-1 flex-col p-4 md:p-6 pb-20">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
