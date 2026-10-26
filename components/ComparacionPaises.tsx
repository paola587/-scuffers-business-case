"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Pais = {
  pais: string;
  pedidos: number;
  ventas_eur: number;
  ticket_medio_eur: number;
  subtotal_medio_eur: number;
  envio_medio_eur: number;
  impuestos_medios_eur: number;
};

export default function ComparacionPaises({
  datos,
}: {
  datos: Pais[];
}) {
  const espana = datos.find(
    (pais) => pais.pais === "ES"
  );

  const alemania = datos.find(
    (pais) => pais.pais === "DE"
  );

  const euros = (valor: number) =>
    valor.toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " €";

  const comparacion = [
    {
      indicador: "Facturación",
      España: espana?.ventas_eur ?? 0,
      Alemania: alemania?.ventas_eur ?? 0,
      unidad: "€",
    },
    {
      indicador: "Pedidos",
      España: espana?.pedidos ?? 0,
      Alemania: alemania?.pedidos ?? 0,
      unidad: "",
    },
    {
      indicador: "Ticket medio",
      España: espana?.ticket_medio_eur ?? 0,
      Alemania: alemania?.ticket_medio_eur ?? 0,
      unidad: "€",
    },
  ];

  if (!espana || !alemania) {
    return (
      <p>No hay datos suficientes para comparar ambos países.</p>
    );
  }

  const diferenciaTicket =
    ((alemania.ticket_medio_eur / espana.ticket_medio_eur) - 1) * 100;

  return (
    <div className="space-y-6">

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-2 text-lg font-semibold">
          Comparación de mercados
        </h3>

        <p className="mb-6 text-sm text-gray-500">
          Pedidos entregados | Enero-junio 2026
        </p>

        <div
  className="grid gap-4"
  style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
>
          {comparacion.map((metrica) => (
            <div
              key={metrica.indicador}
              className="rounded-lg border border-gray-100 p-4"
            >
              <h4 className="mb-4 text-center font-semibold">
                {metrica.indicador}
              </h4>

		<div style={{ width: "100%", height: "240px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        pais: "España",
                        valor: metrica.España,
                      },
                      {
                        pais: "Alemania",
                        valor: metrica.Alemania,
                      },
                    ]}
                    margin={{
                      top: 10,
                      right: 10,
                      bottom: 5,
                      left: 5,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis dataKey="pais" />

                    <YAxis
                      width={55}
                      tick={{ fontSize: 11 }}
                      tickFormatter={(valor) =>
                        Number(valor).toLocaleString("es-ES")
                      }
                    />

                    <Tooltip
                      formatter={(valor) =>
                        metrica.unidad === "€"
                          ? euros(Number(valor))
                          : Number(valor).toLocaleString("es-ES")
                      }
                    />

                    <Bar
                      dataKey="valor"
                      fill="#2563eb"
                      radius={[5, 5, 0, 0]}
                      barSize={55}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-lg font-semibold">
          Desglose del pedido medio
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Indicador</th>
                <th className="p-4 text-right">España</th>
                <th className="p-4 text-right">Alemania</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-t">
                <td className="p-4">Subtotal medio</td>
                <td className="p-4 text-right">
                  {euros(espana.subtotal_medio_eur)}
                </td>
                <td className="p-4 text-right">
                  {euros(alemania.subtotal_medio_eur)}
                </td>
              </tr>

              <tr className="border-t">
                <td className="p-4">Envío medio</td>
                <td className="p-4 text-right">
                  {euros(espana.envio_medio_eur)}
                </td>
                <td className="p-4 text-right">
                  {euros(alemania.envio_medio_eur)}
                </td>
              </tr>

              <tr className="border-t">
                <td className="p-4">Impuestos medios</td>
                <td className="p-4 text-right">
                  {euros(espana.impuestos_medios_eur)}
                </td>
                <td className="p-4 text-right">
                  {euros(alemania.impuestos_medios_eur)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}