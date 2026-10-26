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
ORDER BY DATE_TRUNC('month', created_at);