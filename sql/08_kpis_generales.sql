SELECT
    COUNT(*) AS pedidos_entregados,
    ROUND(
        SUM(total_amount_cents) / 100.0, 2
    ) AS facturacion_eur,
    ROUND(
        AVG(total_amount_cents) / 100.0, 2
    ) AS ticket_medio_eur
FROM orders
WHERE status = 'delivered'
  AND deleted_at IS NULL
  AND created_at >= '2026-01-01'
  AND created_at < '2026-07-01'
