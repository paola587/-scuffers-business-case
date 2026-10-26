SELECT
    p.category AS categoria,
    SUM(oi.quantity) AS unidades_vendidas,
    COUNT(DISTINCT p.id) AS productos_vendidos,
    ROUND(
        SUM(oi.quantity * oi.unit_price_cents) / 100.0, 2
    ) AS ingresos_productos_eur
FROM order_items oi
JOIN products p
    ON oi.product_id = p.id
JOIN orders o
    ON oi.order_id = o.id
WHERE o.status = 'delivered'
  AND o.deleted_at IS NULL
  AND o.created_at >= '2026-01-01'
  AND o.created_at < '2026-07-01'
GROUP BY p.category
ORDER BY ingresos_productos_eur DESC
