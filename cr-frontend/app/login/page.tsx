"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthError, useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/8bit/button";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { AuthField } from "@/components/auth/auth-field";
import { useRedirectIfAuthenticated } from "@/hooks/use-redirect-if-authenticated";
import { isValidEmail } from "@/lib/validation";

const submitButtonClassName =
  "w-full border-4 rounded-none h-14 text-xl font-black uppercase tracking-widest hover:bg-secondary hover:border-secondary active:translate-y-1 transition-all";

const registerLinkClassName =
  "underline underline-offset-4 hover:text-primary transition-colors";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<React.ReactNode>("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  useRedirectIfAuthenticated();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("INGRESA CREDENCIALES");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Ingresa un correo válido");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof AuthError && err.code === "USER_NOT_FOUND") {
        setError(
          <>
            Este usuario no está registrado. Debes{" "}
            <Link href="/register" className={registerLinkClassName}>
              registrarte
            </Link>{" "}
            primero.
          </>
        );
      } else {
        setError("ACCESO DENEGADO");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormShell error={error}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthField label="CORREO" type="email" value={email} onChange={setEmail} />
        <AuthField
          label="CONTRASEÑA"
          type="password"
          value={password}
          onChange={setPassword}
        />
        <Button type="submit" className={submitButtonClassName} disabled={loading}>
          {loading ? "CARGANDO..." : "INICIAR SESIÓN"}
        </Button>
      </form>
    </AuthFormShell>
  );
}
