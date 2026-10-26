WITH pedidos_por_cliente AS (
    SELECT
        customer_id,
        COUNT(*) AS numero_pedidos,
        SUM(total_amount_cents) / 100.0 AS gasto_total_eur
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
    ) AS tasa_recompra_pct,
    ROUND(
        SUM(gasto_total_eur) /
        NULLIF(SUM(numero_pedidos), 0),
        2
    ) AS ticket_medio_eur
FROM pedidos_por_cliente
