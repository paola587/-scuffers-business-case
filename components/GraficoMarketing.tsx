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

type Canal = {
  nombre: string;
  roas: number;
};

export default function GraficoMarketing({
  canales,
}: {
  canales: Canal[];
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        ROAS por canal
      </h3>

      <p className="mb-6 text-sm text-gray-500">
        Ingresos atribuidos por cada euro invertido
      </p>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={canales}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 25, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />

            <XAxis type="number" />

            <YAxis
              dataKey="nombre"
              type="category"
              width={110}
              tick={{ fontSize: 12 }}
            />

<Tooltip
  formatter={(value) => [
    Number(value).toFixed(2),
    "ROAS",
  ]}
/>

            <Bar
              dataKey="roas"
              fill="#2563eb"
              radius={[0, 5, 5, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
