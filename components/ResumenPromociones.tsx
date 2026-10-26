type PromocionResumen = {
  pedidos_unicos_promocionados: number;
  pedidos_con_varias_promociones: number;
  ingresos_unicos_eur: number;
  ingresos_asociados_eur: number;
  solapamiento_eur: number;
};

export default function ResumenPromociones({
  datos,
}: {
  datos: PromocionResumen[];
}) {
  const resumen = datos[0];

  if (!resumen) {
    return <p>No hay datos de promociones disponibles.</p>;
  }

  const euros = (valor: number) =>
    valor.toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " €";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold">
        Impacto de las promociones
      </h3>

      <p className="mb-6 text-sm text-gray-500">
        Pedidos entregados con promociones | Enero-junio 2026
      </p>

      <div
  className="grid gap-4"
  style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
>
        <div className="rounded-lg bg-gray-50 p-5">
          <p className="text-sm text-gray-500">
            Pedidos únicos promocionados
          </p>
          <p className="mt-2 text-2xl font-bold">
            {resumen.pedidos_unicos_promocionados}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-5">
          <p className="text-sm text-gray-500">
            Pedidos con varias promociones
          </p>
          <p className="mt-2 text-2xl font-bold">
            {resumen.pedidos_con_varias_promociones}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-5">
          <p className="text-sm text-gray-500">
            Ingresos únicos de pedidos promocionados
          </p>
          <p className="mt-2 text-2xl font-bold">
            {euros(resumen.ingresos_unicos_eur)}
          </p>
        </div>

        <div className="rounded-lg bg-red-50 p-5">
          <p className="text-sm text-red-600">
            Ingresos contabilizados más de una vez
          </p>
          <p className="mt-2 text-2xl font-bold text-red-600">
            {euros(resumen.solapamiento_eur)}
          </p>
        </div>
      </div>

      <p className="mt-5 text-sm text-gray-500">
        Los ingresos asociados a promociones no deben sumarse directamente:
        un mismo pedido puede estar vinculado a varias promociones.
        El solapamiento representa una duplicación contable, no una
        pérdida económica.
      </p>
    </div>
  );
}