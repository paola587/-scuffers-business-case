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
