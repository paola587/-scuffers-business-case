"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type VentaMensual = {
  mes: string;
  pedidos: number;
  ventas_eur: number;
};

export default function EvolucionVentas({
  datos,
}: {
  datos: VentaMensual[];
}) {
  const nombresMeses: Record<string, string> = {
    "01": "Ene",
    "02": "Feb",
    "03": "Mar",
    "04": "Abr",
    "05": "May",
    "06": "Jun",
  };

  const datosGrafico = datos.map((fila) => ({
    ...fila,
    mesNombre: nombresMeses[fila.mes.slice(5, 7)] ?? fila.mes,
  }));

  const euros = (valor: number) =>
    valor.toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " €";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold">
        Evolución mensual de ventas
      </h3>

      <p className="mb-6 text-sm text-gray-500">
        Facturación de pedidos entregados | Enero-junio 2026
      </p>

      <div style={{ width: "100%", height: "320px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={datosGrafico}
            margin={{ top: 15, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="mesNombre"
              tick={{ fontSize: 12 }}
            />

            <YAxis
              tickFormatter={(valor) =>
                Number(valor).toLocaleString("es-ES")
              }
              tick={{ fontSize: 12 }}
              width={65}
              domain={[0, "auto"]}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;

                const fila = payload[0].payload as VentaMensual;

                return (
                  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-md">
                    <p className="mb-2 font-semibold">
                      {fila.mes}
                    </p>

                    <p className="text-sm">
                      Facturación: {euros(fila.ventas_eur)}
                    </p>

                    <p className="text-sm">
                      Pedidos: {fila.pedidos}
                    </p>
                  </div>
                );
              }}
            />

            <Line
              type="monotone"
              dataKey="ventas_eur"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        La facturación incluye el importe total del pedido,
        incluidos los conceptos de envío e impuestos.
        Se excluyen los pedidos no entregados y los eliminados.
      </p>
    </div>
  );
}