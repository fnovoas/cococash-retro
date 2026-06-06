"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/8bit/card";
import { Button } from "@/components/ui/8bit/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/8bit/select";
import { RetroPanel } from "@/components/retro/retro-panel";
import { FileText, Download } from "lucide-react";

export default function CertificatesPage() {
  const handleDownload = () => {
    alert("Generando PDF... Por favor, espere.");
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <RetroPanel
        header={
          <>
            <CardTitle className="text-2xl font-black flex items-center gap-2 uppercase">
              <FileText className="w-6 h-6" /> Certificados y extractos
            </CardTitle>
            <CardDescription>
              Descarga documentos oficiales y extractos de tu cuenta.
            </CardDescription>
          </>
        }
      >
        <Card
          frame="none"
          className="border-4 bg-muted/20 hover:bg-muted/40 transition-colors"
        >
          <CardHeader className="border-b-4 pb-4">
            <CardTitle className="text-lg font-black uppercase">
              Descargar extracto
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col xl:flex-row justify-between xl:items-center gap-6">
            <CardDescription>
              Descarga el extracto bancario mensual de tu cuenta en formato PDF.
              Los extractos se generan automáticamente el primer día de cada mes e
              incluyen todas las transacciones del periodo.
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full xl:w-auto">
              <Select defaultValue="marzo-2026">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue font="retro" placeholder="Mes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="febrero-2026">febrero de 2026</SelectItem>
                  <SelectItem value="marzo-2026">marzo de 2026</SelectItem>
                  <SelectItem value="abril-2026">abril de 2026</SelectItem>
                  <SelectItem value="mayo-2026">mayo de 2026</SelectItem>
                  <SelectItem value="junio-2026">junio de 2026</SelectItem>
                  <SelectItem value="julio-2026">julio de 2026</SelectItem>
                  <SelectItem value="agosto-2026">agosto de 2026</SelectItem>
                  <SelectItem value="septiembre-2026">septiembre de 2026</SelectItem>
                  <SelectItem value="octubre-2026">octubre de 2026</SelectItem>
                  <SelectItem value="noviembre-2026">noviembre de 2026</SelectItem>
                  <SelectItem value="diciembre-2026">diciembre de 2026</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleDownload}
                className="border-4 px-6 hover:-translate-y-1 whitespace-nowrap w-full sm:w-auto"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </Button>
            </div>
          </CardContent>
        </Card>
      </RetroPanel>
    </div>
  );
}
