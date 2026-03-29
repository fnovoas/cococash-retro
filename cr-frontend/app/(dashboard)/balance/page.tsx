"use client";
import React from "react";
import { useWallet } from "@/context/WalletContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/8bit/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/8bit/card";
import { Button } from "@/components/ui/8bit/button";
import { RefreshCw, History } from "lucide-react";

export default function BalancePage() {
  const { transactions, walletLoading, account, refreshWallet } = useWallet();

  return (
    <div className="max-w-6xl mx-auto w-full">
      <Card className="border-4 bg-card">
        {/* HEADER DENTRO DEL CARD */}
        <CardHeader className="border-b-4 border-foreground pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-black flex items-center gap-2 uppercase">
              <History className="w-6 h-6" /> Historial de movimientos
            </CardTitle>
            <CardDescription>
              Consulta todos los movimientos de tu cuenta.
            </CardDescription>
          </div>

          <Button
            onClick={refreshWallet}
            disabled={walletLoading}
            className="border-4"
            variant="outline"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${
                walletLoading ? "animate-spin" : ""
              }`}
            />
            RECARGAR
          </Button>
        </CardHeader>

        {/* CONTENIDO */}
        <CardContent className="p-4 sm:p-6 overflow-x-auto w-full">
          <div className="min-w-fit flex md:justify-center">
            <Card className="border-4 bg-card w-full p-6 flex justify-center">
              <Table variant="borderless">
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="font-bold border-r-2 border-b-4 text-center">
                  FECHA
                </TableHead>
                <TableHead className="font-bold border-r-2 border-b-4 text-center">
                  TIPO
                </TableHead>
                <TableHead className="font-bold border-r-2 border-b-4 text-center">
                  DETALLE
                </TableHead>
                <TableHead className="font-bold border-b-4 text-center">
                  MONTO
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center font-bold text-muted-foreground uppercase"
                  >
                    No hay registros de transacciones.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => {
                  const isNegative = tx.amount < 0;
                  const date = new Date(tx.date).toLocaleDateString(
                    "es-CO",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  );

                  return (
                  <TableRow
                    key={tx.id}
                    className="hover:bg-muted/50 border-b-2"
                  >
                    {/* FECHA */}
                    <TableCell className="text-center border-r-2 whitespace-nowrap">
                      <CardDescription>
                        {date}
                      </CardDescription>
                    </TableCell>

                    {/* TIPO (se deja igual, es badge visual) */}
                    <TableCell className="border-r-2 text-center">
                      <span
                        className={`px-2 py-1 text-xs font-bold border-2 inline-block ${
                          tx.type === "DEPOSIT"
                            ? "bg-accent/20 border-accent text-accent"
                            : "bg-primary/20 border-primary text-primary"
                        }`}
                      >
                        {tx.type}
                      </span>
                    </TableCell>

                    {/* DETALLE (ya estaba bien, pero lo dejamos consistente) */}
                    <TableCell className="border-r-2 text-center">
                      <CardDescription>
                        {tx.description}
                      </CardDescription>
                    </TableCell>

                    {/* MONTO */}
                    <TableCell className="text-center">
                      <CardDescription
                        className={isNegative ? "text-destructive" : "text-primary"}
                      >
                        {isNegative ? "-" : "+"}$
                        {Math.abs(tx.amount).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </CardDescription>
                    </TableCell>
                  </TableRow>
                  );
                })
              )}
            </TableBody>
              </Table>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}