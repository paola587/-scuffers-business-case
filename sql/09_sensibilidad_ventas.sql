SELECT
    '1. Entregados, no eliminados' AS escenario,
    COUNT(*) AS pedidos,
    ROUND(SUM(total_amount_cents) / 100.0, 2) AS ventas_eur
FROM orders
WHERE status = 'delivered'
  AND deleted_at IS NULL
  AND created_at >= '2026-01-01'
  AND created_at < '2026-07-01'

UNION ALL

SELECT
    '2. Entregados, incluidos eliminados' AS escenario,
    COUNT(*) AS pedidos,
    ROUND(SUM(total_amount_cents) / 100.0, 2) AS ventas_eur
FROM orders
WHERE status = 'delivered'
  AND created_at >= '2026-01-01'
  AND created_at < '2026-07-01'

UNION ALL

SELECT
    '3. Entregados y reembolsados' AS escenario,
    COUNT(*) AS pedidos,
    ROUND(SUM(total_amount_cents) / 100.0, 2) AS ventas_eur
FROM orders
WHERE status IN ('delivered', 'refunded')
  AND deleted_at IS NULL
  AND created_at >= '2026-01-01'
  AND created_at < '2026-07-01'

ORDER BY escenario
