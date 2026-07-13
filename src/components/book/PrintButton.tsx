"use client";

export default function PrintButton({
  label = "🖨️ Imprimir",
}: {
  label?: string;
}) {
  return (
    <button
      onClick={() => window.print()}
      className="no-print rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 transition"
    >
      {label}
    </button>
  );
}
