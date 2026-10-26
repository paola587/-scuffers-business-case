import { ejecutarSQL } from "@/lib/supabase";
import GraficoMarketing from "@/components/GraficoMarketing";
import EvolucionMarketing from "@/components/EvolucionMarketing";
import GraficoCategorias from "@/components/GraficoCategorias"
import GraficoProductos from "@/components/GraficoProductos";
import GraficoDevoluciones from "@/components/GraficoDevoluciones";
import ResumenPromociones from "@/components/ResumenPromociones";
import GraficoPromociones from "@/components/GraficoPromociones";
import ComparacionPaises from "@/components/ComparacionPaises";
import EvolucionVentas from "@/components/EvolucionVentas";

export const instant = false;

export default async function Home() {
  const resultados = await ejecutarSQL(`
    SELECT
      COUNT(*) AS pedidos,
      ROUND(SUM(total_amount_cents) / 100.0, 2) AS facturacion,
      ROUND(AVG(total_amount_cents) / 100.0, 2) AS ticket_medio
    FROM orders
    WHERE status = 'delivered'
      AND deleted_at IS NULL
      AND created_at >= '2026-01-01'
      AND created_at < '2026-07-01'
  `);

const reembolsos = await ejecutarSQL(`
  SELECT
    ROUND(
      100.0 * COUNT(*) FILTER (
        WHERE EXISTS (
          SELECT 1
          FROM refunds r
          WHERE r.order_id = o.id
        )
      ) / NULLIF(COUNT(*), 0),
      2
    ) AS tasa_reembolso
  FROM orders o
  WHERE o.status IN ('delivered', 'refunded')
    AND o.deleted_at IS NULL
    AND o.created_at >= '2026-01-01'
    AND o.created_at < '2026-07-01'
`);

  const datos = resultados[0];
  const tasa = reembolsos[0];

  const formatoEuro = (valor: number) =>
    Number(valor).toLocaleString("es-ES", {
      style: "currency",
      currency: "EUR",
    });

  const indicadores = [
    { nombre: "Facturación", valor: formatoEuro(datos.facturacion) },
    { nombre: "Pedidos entregados", valor: datos.pedidos.toString() },
    { nombre: "Ticket medio", valor: formatoEuro(datos.ticket_medio) },
    {
      nombre: "Tasa de reembolso",
      valor: `${Number(tasa.tasa_reembolso).toFixed(2).replace(".", ",")} %`,
    },
  ];

const resultadosCanales = await ejecutarSQL(`
  WITH ventas AS (
    SELECT
      LOWER(TRIM(channel)) AS canal,
      COUNT(*) AS pedidos,
      SUM(total_amount_cents) / 100.0 AS ingresos_eur
    FROM orders
    WHERE status = 'delivered'
      AND deleted_at IS NULL
      AND created_at >= '2026-03-01'
      AND created_at < '2026-07-01'
    GROUP BY LOWER(TRIM(channel))
  ),
  inversion AS (
    SELECT
      LOWER(TRIM(channel)) AS canal,
      SUM(
        CASE
          WHEN currency_unit = 'EUR_CENTS'
          THEN spend_raw / 100.0
          ELSE spend_raw
        END
      ) AS inversion_eur
    FROM marketing_spend
    WHERE date >= '2026-03-01'
      AND date < '2026-07-01'
    GROUP BY LOWER(TRIM(channel))
  )
SELECT
  v.canal,
  v.pedidos,
  ROUND(v.ingresos_eur, 2) AS ingresos_eur,
  ROUND(i.inversion_eur, 2) AS inversion_eur,
  ROUND(
    v.ingresos_eur / NULLIF(v.pedidos, 0),
    2
  ) AS ticket_medio_eur,
  ROUND(
    v.ingresos_eur / NULLIF(i.inversion_eur, 0),
    2
  ) AS roas
  FROM ventas v
  JOIN inversion i ON v.canal = i.canal
  ORDER BY roas DESC
`);

const canales = resultadosCanales.map(
  (canal: {
    canal: string;
    pedidos: number;
    ingresos_eur: number;
    inversion_eur: number;
    ticket_medio_eur: number;
    roas: number;
  }) => ({
    nombre: canal.canal
      .split(" ")
      .map((palabra: string) =>
        palabra.charAt(0).toUpperCase() + palabra.slice(1)
      )
      .join(" "),
    pedidos: Number(canal.pedidos),
    ingresos_eur: Number(canal.ingresos_eur),
    inversion_eur: Number(canal.inversion_eur),
    ticket_medio_eur: Number(canal.ticket_medio_eur),
    roas: Number(canal.roas),
  })
);

const resultadosEvolucion = await ejecutarSQL(`
  WITH ventas AS (
    SELECT
      TO_CHAR(created_at, 'YYYY-MM') AS mes,
      LOWER(TRIM(channel)) AS canal,
      SUM(total_amount_cents) / 100.0 AS ingresos_eur
    FROM orders
    WHERE status = 'delivered'
      AND deleted_at IS NULL
      AND created_at >= '2026-03-01'
      AND created_at < '2026-07-01'
    GROUP BY 1, 2
  ),
  inversion AS (
    SELECT
      TO_CHAR(date, 'YYYY-MM') AS mes,
      LOWER(TRIM(channel)) AS canal,
      SUM(
        CASE
          WHEN currency_unit = 'EUR_CENTS'
          THEN spend_raw / 100.0
          ELSE spend_raw
        END
      ) AS inversion_eur
    FROM marketing_spend
    WHERE date >= '2026-03-01'
      AND date < '2026-07-01'
    GROUP BY 1, 2
  )
  SELECT
    i.mes,
    i.canal,
    ROUND(
      COALESCE(v.ingresos_eur, 0)
      / NULLIF(i.inversion_eur, 0),
      2
    ) AS roas
  FROM inversion i
  LEFT JOIN ventas v
    ON i.mes = v.mes
    AND i.canal = v.canal
  ORDER BY i.mes, i.canal
`);

const evolucion = resultadosEvolucion.map(
  (fila: { mes: string; canal: string; roas: number }) => ({
    mes: fila.mes,
    canal: fila.canal,
    roas: Number(fila.roas),
  })
);


const resultadosClientes = await ejecutarSQL(`
  WITH pedidos_cliente AS (
    SELECT
      customer_id,
      COUNT(*) AS numero_pedidos,
      SUM(total_amount_cents) / 100.0 AS gasto_total
    FROM orders
    WHERE status = 'delivered'
      AND deleted_at IS NULL
      AND created_at >= '2026-01-01'
      AND created_at < '2026-07-01'
    GROUP BY customer_id
  )
  SELECT
    COUNT(*) AS clientes_activos,
    COUNT(*) FILTER (
      WHERE numero_pedidos > 1
    ) AS clientes_recurrentes,
    ROUND(
      100.0 * COUNT(*) FILTER (
        WHERE numero_pedidos > 1
      ) / NULLIF(COUNT(*), 0),
      2
    ) AS tasa_recompra_pct
  FROM pedidos_cliente
`);

const clientes = resultadosClientes[0];
const resultadosCategorias = await ejecutarSQL(`
  SELECT
    p.category AS categoria,
    SUM(oi.quantity) AS unidades_vendidas,
    COUNT(DISTINCT p.id) AS productos_vendidos,
    ROUND(
      SUM(oi.quantity * oi.unit_price_cents) / 100.0,
      2
    ) AS ingresos_eur
  FROM order_items oi
  JOIN orders o ON oi.order_id = o.id
  JOIN products p ON oi.product_id = p.id
  WHERE o.status = 'delivered'
    AND o.deleted_at IS NULL
    AND o.created_at >= '2026-01-01'
    AND o.created_at < '2026-07-01'
  GROUP BY p.category
  ORDER BY ingresos_eur DESC
`);

const categorias = resultadosCategorias.map(
  (fila: {
    categoria: string;
    unidades_vendidas: number;
    productos_vendidos: number;
    ingresos_eur: number;
  }) => ({
    categoria: fila.categoria,
    unidades_vendidas: Number(fila.unidades_vendidas),
    productos_vendidos: Number(fila.productos_vendidos),
    ingresos_eur: Number(fila.ingresos_eur),
  })
);

const resultadosProductos = await ejecutarSQL(`
  WITH ventas_producto AS (
    SELECT
      p.id AS product_id,
      p.name AS producto,
      p.category AS categoria,
      SUM(oi.quantity) AS unidades_vendidas,
      SUM(oi.quantity * oi.unit_price_cents) / 100.0 AS ingresos_eur
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.status = 'delivered'
      AND o.deleted_at IS NULL
      AND o.created_at >= '2026-01-01'
      AND o.created_at < '2026-07-01'
    GROUP BY p.id, p.name, p.category
  ),
  valoraciones AS (
    SELECT
      product_id,
      COUNT(*) AS numero_resenas,
      ROUND(AVG(rating)::numeric, 2) AS valoracion_media
    FROM product_reviews
    GROUP BY product_id
  )
  SELECT
    v.producto,
    v.categoria,
    ROUND(v.ingresos_eur, 2) AS ingresos_eur,
    v.unidades_vendidas,
    COALESCE(r.numero_resenas, 0) AS numero_resenas,
    r.valoracion_media
  FROM ventas_producto v
  LEFT JOIN valoraciones r ON v.product_id = r.product_id
  ORDER BY ingresos_eur DESC
`);

const productos = resultadosProductos.map(
  (fila: {
    producto: string;
    categoria: string;
    ingresos_eur: number;
    unidades_vendidas: number;
    numero_resenas: number;
    valoracion_media: number | null;
  }) => ({
    producto: fila.producto,
    categoria: fila.categoria,
    ingresos_eur: Number(fila.ingresos_eur),
    unidades_vendidas: Number(fila.unidades_vendidas),
    numero_resenas: Number(fila.numero_resenas),
    valoracion_media:
      fila.valoracion_media === null
        ? null
        : Number(fila.valoracion_media),
  })
);




const resultadosDevoluciones = await ejecutarSQL(`
  SELECT
    reason AS motivo,
    COUNT(*) AS numero_devoluciones,
    ROUND(SUM(amount_cents) / 100.0, 2) AS importe_devuelto_eur
  FROM refunds
  WHERE created_at >= '2026-01-01'
    AND created_at < '2026-07-01'
  GROUP BY reason
  ORDER BY numero_devoluciones DESC
`);

const devoluciones = resultadosDevoluciones.map(
  (fila: {
    motivo: string;
    numero_devoluciones: number;
    importe_devuelto_eur: number;
  }) => ({
    motivo: fila.motivo,
    numero_devoluciones: Number(fila.numero_devoluciones),
    importe_devuelto_eur: Number(fila.importe_devuelto_eur),
  })
);

const resultadosPromociones = await ejecutarSQL(`
  WITH promociones_por_pedido AS (
    SELECT
      o.id AS pedido_id,
      o.total_amount_cents,
      COUNT(DISTINCT op.promotion_id) AS numero_promociones
    FROM orders o
    JOIN order_promotions op
      ON o.id = op.order_id
    WHERE o.status = 'delivered'
      AND o.deleted_at IS NULL
      AND o.created_at >= '2026-01-01'
      AND o.created_at < '2026-07-01'
    GROUP BY o.id, o.total_amount_cents
  )
  SELECT
    COUNT(*) AS pedidos_unicos_promocionados,
    COUNT(*) FILTER (
      WHERE numero_promociones > 1
    ) AS pedidos_con_varias_promociones,
    ROUND(
      SUM(total_amount_cents) / 100.0, 2
    ) AS ingresos_unicos_eur,
    ROUND(
      SUM(total_amount_cents * numero_promociones) / 100.0, 2
    ) AS ingresos_asociados_eur,
    ROUND(
      SUM(total_amount_cents * (numero_promociones - 1)) / 100.0, 2
    ) AS solapamiento_eur
  FROM promociones_por_pedido
`);

const promocionesResumen = resultadosPromociones.map(
  (fila: {
    pedidos_unicos_promocionados: number;
    pedidos_con_varias_promociones: number;
    ingresos_unicos_eur: number;
    ingresos_asociados_eur: number;
    solapamiento_eur: number;
  }) => ({
    pedidos_unicos_promocionados: Number(fila.pedidos_unicos_promocionados),
    pedidos_con_varias_promociones: Number(fila.pedidos_con_varias_promociones),
    ingresos_unicos_eur: Number(fila.ingresos_unicos_eur),
    ingresos_asociados_eur: Number(fila.ingresos_asociados_eur),
    solapamiento_eur: Number(fila.solapamiento_eur),
  })
);

const resultadosPromocionesDetalle = await ejecutarSQL(`
  SELECT
    p.name AS promocion,
    p.discount_pct AS descuento_pct,
    COUNT(DISTINCT o.id) AS pedidos,
    ROUND(
      SUM(o.total_amount_cents) / 100.0,
      2
    ) AS ingresos_asociados_eur
  FROM promotions p
  JOIN order_promotions op
    ON p.id = op.promotion_id
  JOIN orders o
    ON op.order_id = o.id
  WHERE o.status = 'delivered'
    AND o.deleted_at IS NULL
    AND o.created_at >= '2026-01-01'
    AND o.created_at < '2026-07-01'
  GROUP BY p.id, p.name, p.discount_pct
  ORDER BY ingresos_asociados_eur DESC
`);

const promocionesDetalle = resultadosPromocionesDetalle.map(
  (fila: {
    promocion: string;
    descuento_pct: number;
    pedidos: number;
    ingresos_asociados_eur: number;
  }) => ({
    promocion: fila.promocion,
    descuento_pct: Number(fila.descuento_pct),
    pedidos: Number(fila.pedidos),
    ingresos_asociados_eur: Number(fila.ingresos_asociados_eur),
  })
);

const resultadosPaises = await ejecutarSQL(`
  SELECT
    country AS pais,
    COUNT(*) AS pedidos,
    ROUND(SUM(total_amount_cents) / 100.0, 2) AS ventas_eur,
    ROUND(AVG(total_amount_cents) / 100.0, 2) AS ticket_medio_eur,
    ROUND(AVG(subtotal_cents) / 100.0, 2) AS subtotal_medio_eur,
    ROUND(AVG(shipping_cents) / 100.0, 2) AS envio_medio_eur,
    ROUND(AVG(tax_cents) / 100.0, 2) AS impuestos_medios_eur
  FROM orders
  WHERE status = 'delivered'
    AND deleted_at IS NULL
    AND created_at >= '2026-01-01'
    AND created_at < '2026-07-01'
  GROUP BY country
  ORDER BY ventas_eur DESC
`);

const paises = resultadosPaises.map(
  (fila: {
    pais: string;
    pedidos: number;
    ventas_eur: number;
    ticket_medio_eur: number;
    subtotal_medio_eur: number;
    envio_medio_eur: number;
    impuestos_medios_eur: number;
  }) => ({
    pais: fila.pais,
    pedidos: Number(fila.pedidos),
    ventas_eur: Number(fila.ventas_eur),
    ticket_medio_eur: Number(fila.ticket_medio_eur),
    subtotal_medio_eur: Number(fila.subtotal_medio_eur),
    envio_medio_eur: Number(fila.envio_medio_eur),
    impuestos_medios_eur: Number(fila.impuestos_medios_eur),
  })
);

const resultadosEvolucionVentas = await ejecutarSQL(`
  SELECT
    TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') AS mes,
    COUNT(*) AS pedidos,
    ROUND(
      SUM(total_amount_cents) / 100.0,
      2
    ) AS ventas_eur
  FROM orders
  WHERE status = 'delivered'
    AND deleted_at IS NULL
    AND created_at >= '2026-01-01'
    AND created_at < '2026-07-01'
  GROUP BY DATE_TRUNC('month', created_at)
  ORDER BY DATE_TRUNC('month', created_at)
`);

const evolucionVentas = resultadosEvolucionVentas.map(
  (fila: {
    mes: string;
    pedidos: number;
    ventas_eur: number;
  }) => ({
    mes: fila.mes,
    pedidos: Number(fila.pedidos),
    ventas_eur: Number(fila.ventas_eur),
  })
);

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="mx-auto max-w-6xl">

        <header className="mb-10 border-b border-gray-200 pb-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-500">
            Business Intelligence
          </p>

          <h1 className="text-4xl font-bold">
            SCUFFERS
          </h1>

          <p className="mt-3 text-gray-600">
            Dashboard de rendimiento comercial | Primer semestre de 2026
          </p>
        </header>

        <section className="mb-12">
          <h2 className="mb-5 text-2xl font-semibold">
            Resumen general
          </h2>

          <div className="grid gap-4 md:grid-cols-4">
            {indicadores.map((indicador) => (
              <div
                key={indicador.nombre}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <p className="text-sm text-gray-500">
                  {indicador.nombre}
                </p>

                <p className="mt-3 text-3xl font-bold">
                  {indicador.valor}
                </p>
              </div>
            ))}
          </div>
<p className="mt-4 text-xs leading-relaxed text-gray-500">
  <strong>Criterios de cálculo:</strong> La facturación corresponde al
  importe total de los pedidos entregados, incluidos impuestos y gastos
  de envío. El ticket medio se calcula dividiendo la facturación entre
  los pedidos entregados. La tasa de reembolso representa el porcentaje de pedidos
entregados o reembolsados que tienen al menos un reembolso
registrado, independientemente de su fecha.
  Se excluyen los pedidos eliminados. Periodo: enero-junio de 2026.
</p>
        </section>

<section className="mb-12">
  <EvolucionVentas datos={evolucionVentas} />
</section>

        <section className="mb-12">
          <h2 className="mb-2 text-2xl font-semibold">
            Eficiencia de marketing
          </h2>

          <p className="mb-5 text-sm text-gray-500">
            ROAS atribuido = Ingresos atribuidos / Inversión.
	    Periodo comparable: marzo-junio de 2026.
          </p>

	  <div className="mb-6">
  	    <GraficoMarketing canales={canales} />
	  </div>

	  <div className="mb-6">
  	    <EvolucionMarketing datos={evolucion} />
	  </div>

<div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
  <table className="w-full text-left text-sm">
    <thead className="bg-gray-100">
      <tr>
        <th className="p-4">Canal</th>
        <th className="p-4 text-right">Pedidos</th>
        <th className="p-4 text-right">Ingresos</th>
        <th className="p-4 text-right">Inversión</th>
        <th className="p-4 text-right">Ticket medio</th>
        <th className="p-4 text-right">ROAS</th>
      </tr>
    </thead>

    <tbody>
      {canales.map((canal: (typeof canales)[number]) => (
        <tr
          key={canal.nombre}
          className="border-t border-gray-100"
        >
          <td className="p-4 font-medium">{canal.nombre}</td>

          <td className="p-4 text-right">
            {canal.pedidos.toLocaleString("es-ES")}
          </td>

          <td className="p-4 text-right">
            {canal.ingresos_eur.toLocaleString("es-ES", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} €
          </td>

          <td className="p-4 text-right">
            {canal.inversion_eur.toLocaleString("es-ES", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} €
          </td>

          <td className="p-4 text-right font-semibold">
            {canal.ticket_medio_eur.toLocaleString("es-ES", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} €
          </td>

          <td className="p-4 text-right font-semibold">
            {canal.roas.toFixed(2)}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
        </section>

        <section className="mb-12">
          <h2 className="mb-5 text-2xl font-semibold">
            Clientes
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
{[
  {
    nombre: "Clientes activos",
    valor: String(clientes.clientes_activos),
  },
  {
    nombre: "Clientes recurrentes",
    valor: String(clientes.clientes_recurrentes),
  },
  {
    nombre: "Tasa de recompra",
    valor: `${Number(clientes.tasa_recompra_pct)
      .toFixed(2)
      .replace(".", ",")} %`,
  },
].map((dato) => (


              <div
                key={dato.nombre}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <p className="text-sm text-gray-500">{dato.nombre}</p>
                <p className="mt-3 text-3xl font-bold">{dato.valor}</p>
              </div>
            ))}
          </div>
        </section>
<section className="mb-12">
  <h2 className="mb-5 text-2xl font-semibold">
    Productos
  </h2>

  <div className="mb-6">
    <GraficoCategorias datos={categorias} />
  </div>

<div className="mb-6">
  <GraficoProductos datos={productos} />
</div>

<div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
  <h3 className="p-6 text-lg font-semibold">
    Ranking de productos y valoraciones
  </h3>

  <table className="w-full text-left text-sm">
    <thead className="bg-gray-100">
      <tr>
        <th className="p-4">Producto</th>
        <th className="p-4">Categoría</th>
        <th className="p-4 text-right">Ingresos</th>
        <th className="p-4 text-right">Unidades</th>
        <th className="p-4 text-right">Valoración</th>
        <th className="p-4 text-right">Reseñas</th>
      </tr>
    </thead>

    <tbody>
      {productos.map((producto: (typeof productos)[number]) => (
        <tr key={producto.producto} className="border-t border-gray-100">
          <td className="p-4">{producto.producto}</td>
          <td className="p-4">{producto.categoria}</td>
          <td className="p-4 text-right">
            {Number(producto.ingresos_eur).toLocaleString("es-ES", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} €
          </td>
          <td className="p-4 text-right">{producto.unidades_vendidas}</td>
          <td className="p-4 text-right">
            {producto.valoracion_media === null
              ? "Sin valoraciones"
              : Number(producto.valoracion_media).toFixed(2)}
          </td>
          <td className="p-4 text-right">{producto.numero_resenas}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>



</section>
<section className="mb-12">
  <h2 className="mb-5 text-2xl font-semibold">
    Devoluciones
  </h2>

  <GraficoDevoluciones datos={devoluciones} />
</section>

<section className="mb-12">
  <h2 className="mb-5 text-2xl font-semibold">
    Promociones
  </h2>

  <div className="mb-6">
    <ResumenPromociones datos={promocionesResumen} />
  </div>

  <GraficoPromociones datos={promocionesDetalle} />
</section>

<section className="mb-12">
  <h2 className="mb-5 text-2xl font-semibold">
    Análisis de ventas por país
  </h2>

  <ComparacionPaises datos={paises} />
</section>


<footer className="border-t border-gray-200 pt-6 text-sm text-gray-500">
  <p>Análisis de datos comerciales y marketing · Caso práctico Scuffers</p>
  <p className="mt-1">Periodo analizado: enero-junio 2026</p>
</footer>

      </div>
    </main>
  );
}