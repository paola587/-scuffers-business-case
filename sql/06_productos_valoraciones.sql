WITH ventas_producto AS (
    SELECT
        p.id AS product_id,
        p.name AS producto,
        p.category AS categoria,
        SUM(oi.quantity) AS unidades_vendidas,
        SUM(oi.quantity * oi.unit_price_cents) / 100.0
            AS ingresos_eur
    FROM order_items oi
    JOIN products p
        ON oi.product_id = p.id
    JOIN orders o
        ON oi.order_id = o.id
    WHERE o.status = 'delivered'
      AND o.deleted_at IS NULL
      AND o.created_at >= '2026-01-01'
      AND o.created_at < '2026-07-01'
    GROUP BY p.id, p.name, p.category
),
valoraciones AS (
    SELECT
        product_id,
        COUNT(*) AS numero_resenas,
        ROUND(AVG(rating)::numeric, 2) AS valoracion_media
    FROM product_reviews
    GROUP BY product_id
)
SELECT
    v.producto,
    v.categoria,
    ROUND(v.ingresos_eur, 2) AS ingresos_eur,
    v.unidades_vendidas,
    COALESCE(r.numero_resenas, 0) AS numero_resenas,
    r.valoracion_media
FROM ventas_producto v
LEFT JOIN valoraciones r
    ON v.product_id = r.product_id
ORDER BY ingresos_eur DESC
