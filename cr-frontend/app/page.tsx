"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/8bit/button";
import { Input } from "@/components/ui/8bit/input";
import { Card, CardContent } from "@/components/ui/8bit/card";

export default function LandingPage() {
  const router = useRouter();

  const [hola, setHola] = useState("Conectando al main frame...");
  const [input, setInput] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASEURL || "http://localhost:3001";

  // Obtener "hola mundo" al cargar
  useEffect(() => {
    const fetchHola = async () => {
      try {
        const res = await fetch(API_BASE, { cache: "no-store" });
        const text = await res.text();
        setHola(text);
      } catch {
        setHola("API GnuCOBOL offline");
      }
    };

    fetchHola();
  }, [API_BASE]);

  // Enviar mensaje a COBOL
  const handleEnviar = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setRespuesta("");

    try {
      const res = await fetch(
        `${API_BASE}/cobol/respuesta?msg=${encodeURIComponent(input)}`,
        { cache: "no-store" }
      );

      const text = await res.text();
      setRespuesta(text);
    } catch {
      setRespuesta("Error de enlace satelital con API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center retro-scanline relative overflow-hidden text-center p-6">
      
      {/* Estrellitas retro */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-primary drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-ping" />
      <div className="absolute top-40 right-20 w-3 h-3 bg-secondary drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse" />
      <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-accent drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-bounce" />

      <h1 className="text-4xl font-black tracking-widest uppercase">
        COCOCASH RETRO
      </h1>
      
      {/* Panel de Conexión GnuCOBOL */}
      <Card className="mb-12 max-w-2xl w-full bg-muted/50 border-4 border-foreground">
        <CardContent className="p-6 flex flex-col gap-4 font-mono">
          <div className="bg-background border-4 p-4 text-primary font-black uppercase shadow-inner">
            <span className="animate-pulse mr-2">▶</span> {hola}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Mensaje de prueba..."
              className="border-4 h-12 rounded-none focus-visible:ring-0 focus-visible:border-primary flex-1 font-mono text-lg"
            />
            <Button
              onClick={handleEnviar}
              disabled={loading}
              className="border-4 h-12 rounded-none bg-primary text-primary-foreground font-black tracking-widest active:translate-y-1"
            >
              ENVIAR A COBOL
            </Button>
          </div>

          <Input
            type="text"
            value={loading ? "Procesando en mainframe..." : respuesta}
            readOnly
            className="border-4 h-12 rounded-none bg-card text-muted-foreground font-bold mt-2 font-mono shadow-inner"
            placeholder="Esperando transmisión..."
          />
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-6">
        <Button 
          onClick={() => router.push("/login")}
          className="px-12 py-8 text-2xl font-black border-4 uppercase hover:bg-secondary hover:border-secondary active:scale-95 transition-all"
        >
          INICIAR SESIÓN
        </Button>
      </div>

      <p className="mt-16 text-muted-foreground font-mono text-sm tracking-widest uppercase">
        © 2026 COCOCASH CORP. LICENCIADO POR GNUCOBOL.
      </p>
    </div>
  );
}
