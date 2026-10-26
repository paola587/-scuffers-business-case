"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type DatoMensual = {
  mes: string;
  canal: string;
  roas: number;
};

const colores: Record<string, string> = {
  "email": "#2563eb",
  "google ads": "#16a34a",
  "instagram ads": "#dc2626",
  "meta ads": "#9333ea",
  "tiktok ads": "#ea580c",
};

export default function EvolucionMarketing({
  datos,
}: {
  datos: DatoMensual[];
}) {
  const meses = ["2026-03", "2026-04", "2026-05", "2026-06"];

  const datosGrafico = meses.map((mes) => {
    const fila: Record<string, string | number | null> = { mes };

    datos
      .filter((dato) => dato.mes === mes)
      .forEach((dato) => {
        fila[dato.canal] = dato.roas;
      });

    return fila;
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold">
        Evolución mensual del ROAS
      </h3>

      <p className="mb-6 text-sm text-gray-500">
        Ingresos por euro invertido | Marzo - junio 2026
      </p>

      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={datosGrafico}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="mes" />

            <YAxis />

            <Tooltip />

            <Legend />

            {Object.entries(colores).map(([canal, color]) => (
              <Line
                key={canal}
                type="monotone"
                dataKey={canal}
                stroke={color}
                strokeWidth={2}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}