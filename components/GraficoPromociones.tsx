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

type Promocion = {
  promocion: string;
  descuento_pct: number;
  pedidos: number;
  ingresos_asociados_eur: number;
};

export default function GraficoPromociones({
  datos,
}: {
  datos: Promocion[];
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold">
        Rendimiento por promoción
      </h3>

      <p className="mb-6 text-sm text-gray-500">
        Ingresos asociados a cada promoción | Enero-junio 2026
      </p>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={datos}
            layout="vertical"
            margin={{ top: 10, right: 35, bottom: 10, left: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
            />

            <XAxis
              type="number"
              tickFormatter={(valor) =>
                Number(valor).toLocaleString("es-ES")
              }
              unit=" €"
            />

            <YAxis
              type="category"
              dataKey="promocion"
              width={145}
              tick={{ fontSize: 12 }}
            />

            <Tooltip
              cursor={{ fill: "#f3f4f6" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;

                const promocion = payload[0].payload as Promocion;

                return (
                  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-md">
                    <p className="mb-2 font-semibold">
                      {promocion.promocion}
                    </p>

                    <p className="text-sm">
                      Pedidos asociados: {promocion.pedidos}
                    </p>

                    <p className="text-sm">
                      Ingresos asociados:{" "}
                      {promocion.ingresos_asociados_eur.toLocaleString(
                        "es-ES",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )} €
                    </p>
                  </div>
                );
              }}
            />

            <Bar
              dataKey="ingresos_asociados_eur"
              fill="#2563eb"
              radius={[0, 5, 5, 0]}
              barSize={35}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Los ingresos representan la facturación de los pedidos
        asociados a cada promoción, no el incremento de ventas
        generado por ella. Un pedido puede estar asociado a
        varias promociones.
      </p>
    </div>
  );
}