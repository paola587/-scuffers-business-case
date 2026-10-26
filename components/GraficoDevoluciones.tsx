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

type Devolucion = {
  motivo: string;
  numero_devoluciones: number;
  importe_devuelto_eur: number;
};

export default function GraficoDevoluciones({
  datos,
}: {
  datos: Devolucion[];
}) {
  const totalDevoluciones = datos.reduce(
    (total, fila) => total + fila.numero_devoluciones,
    0
  );

  const totalReembolsado = datos.reduce(
    (total, fila) => total + fila.importe_devuelto_eur,
    0
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold">
        Principales motivos de devolución
      </h3>

      <p className="mb-6 text-sm text-gray-500">
        Número de registros por motivo | Enero-junio 2026
      </p>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-500">
            Registros de devolución
          </p>
          <p className="mt-1 text-2xl font-bold">
            {totalDevoluciones}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-500">
            Importe total reembolsado
          </p>
          <p className="mt-1 text-2xl font-bold">
            {totalReembolsado.toLocaleString("es-ES", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} €
          </p>
        </div>
      </div>

      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={datos}
            layout="vertical"
            margin={{ top: 10, right: 35, bottom: 10, left: 35 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
            />

            <XAxis
              type="number"
              allowDecimals={false}
            />

            <YAxis
              type="category"
              dataKey="motivo"
              width={190}
              tick={{ fontSize: 12 }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;

                const fila = payload[0].payload as Devolucion;

                return (
                  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-md">
                    <p className="mb-2 font-semibold">
                      {fila.motivo}
                    </p>

                    <p className="text-sm">
                      Registros: {fila.numero_devoluciones}
                    </p>

                    <p className="text-sm">
                      Importe:{" "}
                      {fila.importe_devuelto_eur.toLocaleString("es-ES", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} €
                    </p>
                  </div>
                );
              }}
            />

            <Bar
              dataKey="numero_devoluciones"
              fill="#2563eb"
              radius={[0, 5, 5, 0]}
              barSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Los datos representan registros de la tabla de reembolsos,
        no necesariamente pedidos únicos.
      </p>
    </div>
  );
}