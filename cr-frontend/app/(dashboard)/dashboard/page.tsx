"use client";

import { useWallet } from "@/context/WalletContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/8bit/card";
import { useRouter } from "next/navigation";
import { ArrowRight, History, Download } from "lucide-react";
import { DashboardActionCard } from "@/components/dashboard/action-card";
import { formatCurrency } from "@/lib/format";

export default function DashboardPage() {
  const { balance, account, walletLoading, error } = useWallet();
  const router = useRouter();

  if (walletLoading) {
    return (
      <Card frame="none" className="w-full bg-transparent shadow-none">
        <CardDescription className="animate-pulse text-muted-foreground px-6 py-6">
          Calculando monedas...
        </CardDescription>
      </Card>
    );
  }

  if (error) {
    return (
      <Card frame="none" className="border-destructive bg-destructive/10">
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
      <Card frame="none" className="bg-primary text-primary-foreground border-4">
        <CardHeader>
          <CardTitle className="text-xl md:text-3xl text-primary-foreground">
            Saldo disponible
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Cuenta activa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl md:text-7xl font-black drop-shadow-md">
              ${formatCurrency(balance)}
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

      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        <DashboardActionCard
          icon={ArrowRight}
          title="Enviar dinero"
          description="Transfiere fondos al instante a otras cuentas CocoCash Retro."
          actionLabel="INICIAR"
          onClick={() => router.push("/transfer")}
        />
        <DashboardActionCard
          icon={History}
          title="Movimientos"
          description="Revisa el historial de transferencias y depósitos."
          actionLabel="VER"
          onClick={() => router.push("/balance")}
        />
        <DashboardActionCard
          icon={Download}
          title="Certificados"
          description="Descarga de extractos mensuales."
          actionLabel="GENERAR"
          onClick={() => router.push("/certificates")}
        />
      </div>
    </div>
  );
}
