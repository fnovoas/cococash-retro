"use client";
import React, { useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/8bit/card";
import { useRouter } from "next/navigation";
import { ArrowRight, History, Download, Link2 } from "lucide-react";

export default function DashboardPage() {
  const { balance, account, walletLoading, error } = useWallet();
  const router = useRouter();

  if (walletLoading) {
    return (
      <Card className="w-full border-0 bg-transparent shadow-none [&>div.absolute]:hidden">
        <CardDescription className="animate-pulse text-muted-foreground">
          Calculando monedas...
        </CardDescription>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive bg-destructive/10">
        <CardHeader>
          <CardTitle className="text-destructive">CRITICAL ERROR</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Overview Card */}
      <Card className="bg-primary text-primary-foreground border-4">
        <CardHeader>
          <CardTitle className="text-xl md:text-3xl text-primary-foreground">Saldo disponible</CardTitle>
          <CardDescription className="text-primary-foreground/80">Cuenta activa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl md:text-7xl font-black drop-shadow-md">
              ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </h1>
            {account?.accountNumber && (
              <div className="flex items-center gap-2 mt-4">
                <span className="font-mono bg-background text-foreground px-3 py-1 text-sm border-2">
                  ID: {account.accountNumber}
                </span>
                <span className="font-mono bg-green-500 text-black px-3 py-1 text-sm border-2 animate-pulse">
                  ONLINE
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Modules */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card
          className="cursor-pointer hover:-translate-y-1 transition-transform group"
          onClick={() => router.push("/transfer")}
        >
          <CardContent className="p-6 flex flex-col items-start gap-4 h-full">
            <div className="bg-primary/20 p-4 border-2 group-hover:bg-primary/40 transition-colors">
              <ArrowRight className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardDescription className="text-xl font-black">
                Enviar dinero
              </CardDescription>
              <p className="text-sm text-muted-foreground mt-2">
                Transfiere fondos al instante a otras cuentas CocoCash Retro.
              </p>
            </div>
            <div className="mt-auto pt-4 text-primary font-bold flex items-center gap-2">
              INICIAR <Link2 className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:-translate-y-1 transition-transform group"
          onClick={() => router.push("/balance")}
        >
          <CardContent className="p-6 flex flex-col items-start gap-4 h-full">
            <div className="bg-primary/20 p-4 border-2 group-hover:bg-primary/40 transition-colors">
              <History className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardDescription className="text-xl font-black">
                Movimientos
              </CardDescription>
              <p className="text-sm text-muted-foreground mt-2">
                Revisa el historial de transferencias y depósitos.
              </p>
            </div>
            <div className="mt-auto pt-4 text-primary font-bold flex items-center gap-2">
              VER DATOS <Link2 className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:-translate-y-1 transition-transform group"
          onClick={() => router.push("/certificates")}
        >
          <CardContent className="p-6 flex flex-col items-start gap-4 h-full">
            <div className="bg-accent/20 p-4 border-2 group-hover:bg-accent/40 transition-colors">
              <Download className="w-8 h-8 text-accent" />
            </div>
            <div>
              <CardDescription className="text-xl font-black">
                Certificados
              </CardDescription>
              <p className="text-sm text-muted-foreground mt-2">
                Descarga de extractos mensuales.
              </p>
            </div>
            <div className="mt-auto pt-4 text-accent font-bold flex items-center gap-2">
              DESCARGAR <Link2 className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
