"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Categoria = {
  categoria: string;
  ingresos_eur: number;
  unidades_vendidas: number;
};

export default function GraficoCategorias({
  datos,
}: {
  datos: Categoria[];
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold">
        Facturación por categoría
      </h3>

      <p className="mb-6 text-sm text-gray-500">
        Ingresos asociados a productos vendidos | Enero-junio 2026
      </p>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={datos}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="categoria" />

            <YAxis />

<Tooltip
  content={({ active, payload }) => {
    if (!active || !payload?.length) return null;

    const dato = payload[0].payload as Categoria;

    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-md">
        <p className="mb-2 font-semibold">{dato.categoria}</p>
        <p className="text-sm">
          Ingresos: {dato.ingresos_eur.toLocaleString("es-ES", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} €
        </p>
        <p className="text-sm">
          Unidades vendidas: {dato.unidades_vendidas}
        </p>
      </div>
    );
  }}
/>

            <Bar
              dataKey="ingresos_eur"
              fill="#2563eb"
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}