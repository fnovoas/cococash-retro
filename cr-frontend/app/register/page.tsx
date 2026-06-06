"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/8bit/button";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { AuthField } from "@/components/auth/auth-field";
import { useRedirectIfAuthenticated } from "@/hooks/use-redirect-if-authenticated";
import { isValidEmail } from "@/lib/validation";

const submitButtonClassName =
  "w-full border-4 rounded-none h-14 text-xl font-black uppercase tracking-widest hover:bg-secondary hover:border-secondary active:translate-y-1 transition-all";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<React.ReactNode>("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  useRedirectIfAuthenticated();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("POR FAVOR LLENA TODOS LOS CAMPOS");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Ingrese un correo válido");
      return;
    }

    if (password !== confirmPassword) {
      setError("LAS CONTRASEÑAS NO COINCIDEN");
      return;
    }

    setLoading(true);
    try {
      await register(email, password, name);
      router.push("/dashboard");
    } catch {
      setError("ERROR AL REGISTRAR. INTENTA DE NUEVO.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormShell error={error}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthField label="NOMBRE" value={name} onChange={setName} />
        <AuthField label="CORREO" type="email" value={email} onChange={setEmail} />
        <AuthField
          label="CONTRASEÑA"
          type="password"
          value={password}
          onChange={setPassword}
        />
        <AuthField
          label="CONFIRMAR CONTRASEÑA"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />
        <div className="flex flex-col gap-4 mt-2">
          <Button type="submit" className={submitButtonClassName} disabled={loading}>
            {loading ? "CARGANDO..." : "REGISTRARSE"}
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/login")}
            className={submitButtonClassName}
            disabled={loading}
          >
            INICIAR SESIÓN
          </Button>
        </div>
      </form>
    </AuthFormShell>
  );
}
