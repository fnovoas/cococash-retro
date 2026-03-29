"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/context/WalletContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/8bit/card";
import { Input } from "@/components/ui/8bit/input";
import { Button } from "@/components/ui/8bit/button";
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
      <Card className="border-4 bg-primary text-primary-foreground max-w-sm mx-auto mt-20 p-8 text-center shadow-lg">
        <CheckCircle className="w-16 h-16 mx-auto mb-4 animate-bounce" />
        <CardTitle className="text-2xl font-black mb-2 text-primary-foreground">DINERO CARGADO</CardTitle>
        <p className="font-mono">Volviendo al dashboard...</p>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <Card className="border-4 bg-card">
        <CardHeader className="border-b-4 border-foreground pb-4">
          <CardTitle className="text-2xl font-black flex items-center gap-2 uppercase">
            <Download className="w-6 h-6" /> Añadir fondos
          </CardTitle>
          <CardDescription>
            Simulador de depósito local de monedas.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider">Concepto</label>
              <Input 
                className="font-mono py-6 border-4 focus-visible:ring-0 focus-visible:border-primary"
                placeholder="Ej. Nómina, Premio, Bono"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider">Importe</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-xl text-muted-foreground">$</span>
                <Input 
                  type="number"
                  min="0.01"
                  step="0.01"
                  className="font-mono text-xl py-6 pl-10 border-4 focus-visible:ring-0 focus-visible:border-primary"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full py-8 text-xl font-black tracking-widest border-4 bg-primary/20 text-primary border-primary hover:bg-primary/40 active:translate-y-1"
              disabled={submitting}
            >
              {submitting ? "INGRESANDO..." : "CARGAR MONEDAS"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
