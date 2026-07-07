"use client";

import { useState } from "react";

export default function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable; ignore
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-md bg-indigo-50 px-3 py-1 font-mono text-indigo-700 font-semibold tracking-widest hover:bg-indigo-100 transition"
      title="Copiar código"
    >
      {code}
      <span className="text-xs font-sans font-normal text-indigo-500">
        {copied ? "¡copiado!" : "copiar"}
      </span>
    </button>
  );
}
