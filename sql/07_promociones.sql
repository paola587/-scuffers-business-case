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
