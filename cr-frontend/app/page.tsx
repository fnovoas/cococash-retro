"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/8bit/button";
import { Input } from "@/components/ui/8bit/input";
import { useAuth } from "@/context/AuthContext";
import { CardTitle } from "@/components/ui/8bit/card";
import { RetroPanel } from "@/components/retro/retro-panel";
import { BrandIsotipo } from "@/components/brand-isotipo";
import { API_BASE } from "@/lib/api";

export default function LandingPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [hola, setHola] = useState("Conectando al core...");
  const [input, setInput] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHola = async () => {
      try {
        const res = await fetch(API_BASE, { cache: "no-store" });
        setHola(await res.text());
      } catch {
        setHola("API GnuCOBOL offline");
      }
    };

    fetchHola();
  }, []);

  const handleEnviar = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setRespuesta("");

    try {
      const res = await fetch(
        `${API_BASE}/cobol/respuesta?msg=${encodeURIComponent(input)}`,
        { cache: "no-store" }
      );
      setRespuesta(await res.text());
    } catch {
      setRespuesta("Error de conexión con API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center retro-scanline relative overflow-hidden text-center p-6">
      <div className="absolute top-10 left-10 w-2 h-2 bg-primary drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-ping" />
      <div className="absolute top-40 right-20 w-3 h-3 bg-secondary drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse" />
      <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-accent drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-bounce" />

      <div className="flex flex-col items-center gap-4 mb-8">
        <BrandIsotipo size={80} priority />
        <CardTitle className="text-4xl font-black tracking-widest uppercase">
          COCOCASH RETRO
        </CardTitle>
      </div>

      <RetroPanel
        frame="brand"
        wrapperClassName="mb-12 max-w-2xl w-full"
        className="bg-muted/50"
        contentClassName="flex flex-col gap-4 font-mono"
      >
        <div className="bg-background border-4 p-4 text-primary font-black uppercase shadow-inner">
          <span className="animate-pulse mr-2">▶</span> {hola}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
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
            className="border-4 h-12 rounded-none bg-primary text-primary-foreground font-black tracking-widest hover:bg-secondary hover:border-secondary active:translate-y-1 transition-all"
          >
            ENVIAR AL CORE
          </Button>
        </div>

        <Input
          type="text"
          value={loading ? "Procesando en core..." : respuesta}
          readOnly
          className="border-4 h-12 rounded-none bg-card text-muted-foreground font-bold font-mono shadow-inner"
          placeholder="Esperando transmisión..."
        />
      </RetroPanel>

      <div className="flex flex-col gap-6">
        {user ? (
          <>
            <Button
              onClick={() => router.push("/dashboard")}
              className="px-12 py-8 text-2xl font-black border-4 uppercase bg-primary text-primary-foreground hover:secondary hover:border-secondary active:scale-95 transition-all"
            >
              IR AL DASHBOARD
            </Button>
            <Button
              onClick={logout}
              className="px-12 py-8 text-2xl font-black border-4 uppercase text-destructive hover:bg-destructive hover:text-white active:scale-95 transition-all"
            >
              CERRAR SESIÓN
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => router.push("/register")}
              className="px-12 py-8 text-2xl font-black border-4 uppercase bg-primary text-primary-foreground hover:bg-secondary hover:border-secondary active:scale-95 transition-all"
            >
              REGISTRARSE
            </Button>
            <Button
              onClick={() => router.push("/login")}
              className="px-12 py-8 text-2xl font-black border-4 uppercase hover:bg-secondary hover:border-secondary active:scale-95 transition-all"
            >
              INICIAR SESIÓN
            </Button>
          </>
        )}
      </div>

      <p className="mt-16 text-muted-foreground font-mono text-sm tracking-widest uppercase">
        © 2026 COCOCASH CORP. CON TECNOLOGÍA DE GNUCOBOL.
      </p>
    </div>
  );
}
