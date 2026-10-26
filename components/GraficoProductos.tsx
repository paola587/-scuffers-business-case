"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Legend,
} from "recharts";

type Producto = {
  producto: string;
  categoria: string;
  ingresos_eur: number;
  unidades_vendidas: number;
  numero_resenas: number;
  valoracion_media: number | null;
};

export default function GraficoProductos({
  datos,
}: {
  datos: Producto[];
}) {
  const productosConValoracion = datos.filter(
    (producto) => producto.valoracion_media !== null
  );

  // Productos prioritarios: ingresos > 1.500 € y valoración < 4
  const productosPrioritarios = productosConValoracion.filter(
    (producto) =>
      producto.ingresos_eur > 1500 &&
      producto.valoracion_media !== null &&
      producto.valoracion_media < 4
  );

  // Resto de productos
  const otrosProductos = productosConValoracion.filter(
    (producto) =>
      !(
        producto.ingresos_eur > 1500 &&
        producto.valoracion_media !== null &&
        producto.valoracion_media < 4
      )
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold">
        Ingresos vs. satisfacción del cliente
      </h3>

      <p className="mb-6 text-sm text-gray-500">
        Relación entre los ingresos generados y la valoración media de cada
        producto | Enero-junio 2026
      </p>

      <div style={{ width: "100%", height: "340px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 30, bottom: 35, left: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              type="number"
              dataKey="ingresos_eur"
              name="Ingresos"
              tickFormatter={(valor) =>
                Number(valor).toLocaleString("es-ES")
              }
              label={{
                value: "Ingresos (€)",
                position: "insideBottom",
                offset: -15,
              }}
            />

            <YAxis
              type="number"
              dataKey="valoracion_media"
              name="Valoración"
              domain={[0, 5]}
              label={{
                value: "Valoración media (0-5)",
                angle: -90,
                position: "insideLeft",
                offset: -10,
              }}
            />

            <ZAxis range={[100, 100]} />

            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;

                const producto = payload[0].payload as Producto;

                return (
                  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-md">
                    <p className="mb-2 font-semibold">
                      {producto.producto}
                    </p>

                    <p className="text-sm">
                      Ingresos:{" "}
                      {producto.ingresos_eur.toLocaleString("es-ES", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      €
                    </p>

                    <p className="text-sm">
                      Valoración: {producto.valoracion_media?.toFixed(2)} / 5
                    </p>

                    <p className="text-sm">
                      Unidades vendidas: {producto.unidades_vendidas}
                    </p>

                    <p className="text-sm">
                      Reseñas: {producto.numero_resenas}
                    </p>
                  </div>
                );
              }}
            />

            <Legend
              verticalAlign="top"
              align="right"
              height={40}
            />

            <Scatter
              name="Resto de productos"
              data={otrosProductos}
              fill="#2563eb"
            />

            <Scatter
              name="Productos prioritarios"
              data={productosPrioritarios}
              fill="#dc2626"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        <span className="font-semibold text-red-600">
          Productos prioritarios:
        </span>{" "}
        ingresos superiores a 1.500 € y valoración media inferior a 4/5.
        Este criterio permite identificar productos con ventas relevantes
        cuya satisfacción del cliente podría mejorarse.
      </p>
    </div>
  );
}