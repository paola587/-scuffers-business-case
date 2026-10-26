WITH pedidos AS (
    SELECT
        id,
        subtotal_cents,
        shipping_cents,
        tax_cents,
        total_amount_cents
    FROM orders
    WHERE status = 'delivered'
      AND deleted_at IS NULL
      AND created_at >= '2026-01-01'
      AND created_at < '2026-07-01'
),
lineas AS (
    SELECT
        oi.order_id,
        SUM(
            oi.quantity * oi.unit_price_cents
        ) AS total_lineas_cents,
        SUM(
            CASE
                WHEN p.active = true
                THEN oi.quantity * oi.unit_price_cents
                ELSE 0
            END
        ) AS lineas_activas_cents
    FROM order_items oi
    JOIN products p
        ON oi.product_id = p.id
    JOIN pedidos pe
        ON oi.order_id = pe.id
    GROUP BY oi.order_id
)
SELECT
    ROUND(SUM(pe.total_amount_cents) / 100.0, 2)
        AS facturacion_total_eur,

    ROUND(SUM(pe.subtotal_cents) / 100.0, 2)
        AS subtotal_eur,

    ROUND(SUM(pe.shipping_cents) / 100.0, 2)
        AS envio_eur,

    ROUND(SUM(pe.tax_cents) / 100.0, 2)
        AS impuestos_eur,

    ROUND(SUM(COALESCE(l.total_lineas_cents, 0)) / 100.0, 2)
        AS total_lineas_eur,

    ROUND(SUM(COALESCE(l.lineas_activas_cents, 0)) / 100.0, 2)
        AS lineas_activas_eur,

    ROUND(
        SUM(
            COALESCE(l.total_lineas_cents, 0)
            - COALESCE(l.lineas_activas_cents, 0)
        ) / 100.0,
        2
    ) AS lineas_inactivas_eur

FROM pedidos pe
LEFT JOIN lineas l
    ON pe.id = l.order_id
