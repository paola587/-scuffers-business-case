WITH ventas AS (
    SELECT
        CASE
            WHEN LOWER(TRIM(channel)) IN ('email', 'newsletter')
                THEN 'Email + Newsletter'
            WHEN LOWER(TRIM(channel)) IN ('meta ads', 'instagram ads')
                THEN 'Meta + Instagram'
            ELSE LOWER(TRIM(channel))
        END AS canal,
        COUNT(*) AS pedidos,
        SUM(total_amount_cents) / 100.0 AS ingresos_eur
    FROM orders
    WHERE status = 'delivered'
      AND deleted_at IS NULL
      AND created_at >= '2026-03-01'
      AND created_at < '2026-07-01'
    GROUP BY 1
),
inversion AS (
    SELECT
        CASE
            WHEN LOWER(TRIM(channel)) IN ('email', 'newsletter')
                THEN 'Email + Newsletter'
            WHEN LOWER(TRIM(channel)) IN ('meta ads', 'instagram ads')
                THEN 'Meta + Instagram'
            ELSE LOWER(TRIM(channel))
        END AS canal,
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
    GROUP BY 1
)
SELECT
    v.canal,
    v.pedidos,
    ROUND(v.ingresos_eur, 2) AS ingresos_eur,
    ROUND(i.inversion_eur, 2) AS inversion_eur,
    ROUND(
        v.ingresos_eur / NULLIF(i.inversion_eur, 0),
        2
    ) AS roas
FROM ventas v
LEFT JOIN inversion i
    ON v.canal = i.canal
ORDER BY roas DESC NULLS LAST
