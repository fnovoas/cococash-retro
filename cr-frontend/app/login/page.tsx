"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/8bit/card";
import { Input } from "@/components/ui/8bit/input";
import { Button } from "@/components/ui/8bit/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("INGRESA CREDENCIALES");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError("ACCESO DENEGADO");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background retro-scanline p-4">
      <Card className="w-full max-w-sm border-4 shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,0.2)] bg-card retro">
        <CardHeader className="text-center border-b-4 pb-6 pt-8">
          <CardTitle className="text-4xl font-black tracking-widest uppercase">
            COCOCASH RETRO
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8 pb-8 px-6">
          {error && <div className="text-destructive font-bold text-center mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">CORREO</label>
              <Input 
                type="email" 
                className="font-mono border-4 rounded-none h-12 text-center focus-visible:ring-0 focus-visible:border-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">CONTRASEÑA</label>
              <Input 
                type="password" 
                className="font-mono border-4 rounded-none h-12 text-center focus-visible:ring-0 focus-visible:border-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
              />
            </div>
            <Button 
              type="submit" 
              className="w-full border-4 rounded-none h-14 text-xl font-black uppercase tracking-widest hover:bg-primary active:translate-y-1 transition-all"
              disabled={loading}
            >
              {loading ? "CARGANDO..." : "START"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
