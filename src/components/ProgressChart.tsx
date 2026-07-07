"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type ProgressPoint = {
  date: string;
  wpm: number | null;
  comprehension: number | null;
};

export default function ProgressChart({ data }: { data: ProgressPoint[] }) {
  if (data.length === 0) {
    return (
      <p className="text-slate-500 text-sm py-10 text-center">
        Todavía no tienes intentos registrados. ¡Haz tu primer ejercicio!
      </p>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="wpm"
            name="Palabras/min"
            stroke="#4f46e5"
            strokeWidth={2}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="comprehension"
            name="Comprensión %"
            stroke="#14b8a6"
            strokeWidth={2}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
