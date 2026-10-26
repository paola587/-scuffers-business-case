WITH ventas AS (
    SELECT
        TO_CHAR(created_at, 'YYYY-MM') AS mes,
        LOWER(TRIM(channel)) AS canal,
        SUM(total_amount_cents) / 100.0 AS ingresos_eur
    FROM orders
    WHERE status = 'delivered'
      AND deleted_at IS NULL
      AND created_at >= '2026-03-01'
      AND created_at < '2026-07-01'
    GROUP BY 1, 2
),
inversion AS (
    SELECT
        TO_CHAR(date, 'YYYY-MM') AS mes,
        LOWER(TRIM(channel)) AS canal,
        SUM(
            CASE
                WHEN currency_unit = 'EUR_CENTS'
                THEN spend_raw / 100.0
                ELSE spend_raw
            END
        ) AS inversion_eur
    FROM marketing_spend
    WHERE date >= '2026-03-01'
      AND date < '2026-07-01'
    GROUP BY 1, 2
)
SELECT
    i.mes,
    i.canal,
    ROUND(COALESCE(v.ingresos_eur, 0), 2) AS ingresos_eur,
    ROUND(i.inversion_eur, 2) AS inversion_eur,
    ROUND(
        COALESCE(v.ingresos_eur, 0) /
        NULLIF(i.inversion_eur, 0), 2
    ) AS roas
FROM inversion i
LEFT JOIN ventas v
    ON i.mes = v.mes
   AND i.canal = v.canal
ORDER BY i.canal, i.mes
