"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/context/WalletContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/8bit/card";
import { Input } from "@/components/ui/8bit/input";
import { Button } from "@/components/ui/8bit/button";
import { Send, AlertTriangle } from "lucide-react";

export default function TransferPage() {
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { addTransaction, balance, account } = useWallet();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("El monto debe ser superior a 0.");
      return;
    }
    if (numAmount > balance) {
      setError("Fondos insuficientes.");
      return;
    }
    if (!destination.trim()) {
      setError("Ingresa la cuenta destino.");
      return;
    }
    if (destination.trim() === account?.accountNumber) {
      setError("No puedes transferirte a ti mismo.");
      return;
    }

    setSubmitting(true);
    try {
      await addTransaction(destination.trim(), numAmount);
      router.push("/balance");
    } catch (err: any) {
      setError(err.message || "Error en la transferencia.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <Card className="border-4 bg-card">
        <CardHeader className="border-b-4 border-foreground pb-4">
          <CardTitle className="text-2xl font-black flex items-center gap-2">
            <Send className="w-6 h-6" /> GIRO DE FONDOS
          </CardTitle>
          <CardDescription>
            Envía monedas a otra cuenta en el sistema CocoCash Retro.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="bg-primary/20 border-2 border-primary border-dashed p-4 mb-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase">Saldo actual</p>
              {account?.accountNumber && (
                <p className="text-xs font-mono">{account.accountNumber}</p>
              )}
            </div>
            <p className="text-2xl font-black text-primary">
              ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>

          {error && (
            <div className="bg-destructive text-destructive-foreground p-3 mb-6 border-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p className="font-bold flex-1">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider">Cuenta destino</label>
              <Input 
                className="font-mono text-lg py-6 border-4 focus-visible:ring-0 focus-visible:border-primary"
                placeholder="Ej. CC-10294"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider">Monto</label>
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
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full py-8 text-xl font-black tracking-widest border-4 active:translate-y-1"
              disabled={submitting}
            >
              {submitting ? "PROCESANDO..." : "ENVIAR GIRO"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
