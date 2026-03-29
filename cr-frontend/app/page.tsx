"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [hola, setHola] = useState("");
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
        setHola("API not available");
      }
    };

    fetchHola();
  }, []);

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
      setRespuesta("Error comunicando con API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>CocoCash Retro</h1>

      {/* Hola mundo */}
      <p>{hola}</p>

      {/* UI interactiva */}
      <div style={{ marginTop: "2rem" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          style={{ padding: "0.5rem", width: "250px" }}
        />

        <button
          onClick={handleEnviar}
          style={{ marginLeft: "0.5rem", padding: "0.5rem" }}
        >
          Enviar
        </button>

        <input
          type="text"
          value={loading ? "Procesando..." : respuesta}
          readOnly
          style={{
            marginLeft: "0.5rem",
            padding: "0.5rem",
            width: "250px",
            backgroundColor: "#bdbdbd",
            color: "var(--foreground)",
          }}
        />
      </div>
    </main>
  );
}
