"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/context/WalletContext";
import {
  Card,
  CardTitle,
  CardDescription,
} from "@/components/ui/8bit/card";
import { Input } from "@/components/ui/8bit/input";
import { Button } from "@/components/ui/8bit/button";
import { CurrencyInput } from "@/components/forms/currency-input";
import { RetroPanel } from "@/components/retro/retro-panel";
import { Download, CheckCircle } from "lucide-react";

export default function DepositPage() {
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { deposit } = useWallet();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    setSubmitting(true);
    await deposit(numAmount, desc || "DEPÓSITO LOCAL");
    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  if (success) {
    return (
      <Card
        frame="none"
        className="bg-primary text-primary-foreground max-w-sm mx-auto mt-20 text-center shadow-lg py-0"
      >
        <div className="border-4 border-border px-8 py-2 -my-8">
          <div className="py-8">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 animate-bounce" />
            <CardTitle className="text-2xl font-black mb-2 text-primary-foreground">
              DINERO CARGADO
            </CardTitle>
            <CardDescription className="mt-2 animate-pulse text-primary-foreground/80">
              Volviendo al dashboard...
            </CardDescription>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <RetroPanel
        header={
          <>
            <CardTitle className="text-2xl font-black flex items-center gap-2 uppercase">
              <Download className="w-6 h-6" /> Añadir fondos
            </CardTitle>
            <CardDescription>
              Simulador de depósito local de monedas.
            </CardDescription>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="form-label-sm">Concepto</label>
            <Input
              className="font-mono py-6 border-4 focus-visible:ring-0 focus-visible:border-primary"
              placeholder="Ej. Nómina, Premio, Bono"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="form-label-sm">Importe</label>
            <CurrencyInput value={amount} onChange={setAmount} required />
          </div>

          <Button
            type="submit"
            className="w-full py-8 text-xl font-black tracking-widest border-4 bg-primary/20 text-primary border-primary hover:bg-primary/40 active:translate-y-1"
            disabled={submitting}
          >
            {submitting ? "INGRESANDO..." : "CARGAR MONEDAS"}
          </Button>
        </form>
      </RetroPanel>
    </div>
  );
}
