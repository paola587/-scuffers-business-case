SELECT
    reason AS motivo,
    COUNT(*) AS numero_devoluciones,
    ROUND(SUM(amount_cents) / 100.0, 2) AS importe_devuelto_eur
FROM refunds
WHERE created_at >= '2026-01-01'
  AND created_at < '2026-07-01'
GROUP BY reason
ORDER BY numero_devoluciones DESC;