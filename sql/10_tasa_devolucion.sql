SELECT
    COUNT(*) FILTER (
        WHERE EXISTS (
            SELECT 1
            FROM refunds r
            WHERE r.order_id = o.id
        )
    ) AS pedidos_con_reembolso,

    COUNT(*) AS pedidos_entregados_o_reembolsados,

    ROUND(
        100.0 * COUNT(*) FILTER (
            WHERE EXISTS (
                SELECT 1
                FROM refunds r
                WHERE r.order_id = o.id
            )
        ) / NULLIF(COUNT(*), 0),
        2
    ) AS tasa_reembolso_pct

FROM orders o
WHERE o.status IN ('delivered', 'refunded')
  AND o.deleted_at IS NULL
  AND o.created_at >= '2026-01-01'
  AND o.created_at < '2026-07-01';

-- Análisis de sensibilidad:
-- tasa basada solo en pedidos con estado 'refunded'

SELECT
    COUNT(*) FILTER (
        WHERE o.status = 'refunded'
    ) AS pedidos_estado_refunded,

    COUNT(*) AS pedidos_entregados_o_reembolsados,

    ROUND(
        100.0 * COUNT(*) FILTER (
            WHERE o.status = 'refunded'
        ) / NULLIF(COUNT(*), 0),
        2
    ) AS tasa_por_estado_pct

FROM orders o
WHERE o.status IN ('delivered', 'refunded')
  AND o.deleted_at IS NULL
  AND o.created_at >= '2026-01-01'
  AND o.created_at < '2026-07-01';