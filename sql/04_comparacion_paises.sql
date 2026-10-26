
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
