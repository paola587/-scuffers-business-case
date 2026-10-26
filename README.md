# Scuffers | Business Case — Data & AI Analyst

## 1. Descripción del proyecto

Este proyecto analiza los datos comerciales de Scuffers con el objetivo de identificar oportunidades de mejora en ventas, adquisición de clientes, fidelización, productos, promociones y devoluciones.

El análisis se presenta mediante un dashboard interactivo desarrollado con Next.js y conectado a una base de datos Supabase. Las consultas SQL utilizadas se incluyen en la carpeta `sql/` para facilitar la revisión y reproducibilidad de los resultados.

Periodo analizado:
- Ventas, clientes, productos y promociones: enero–junio de 2026.
- Adquisición y eficiencia de canales: marzo–junio de 2026, debido a los cambios en la atribución de canales indicados en el enunciado.
- Devoluciones: pedidos creados entre enero y junio de 2026, considerando si tienen algún reembolso registrado.

Tecnologías utilizadas:
- SQL (PostgreSQL): extracción, transformación y análisis de datos.
- Supabase: base de datos.
- Next.js y TypeScript: desarrollo del dashboard.
- Recharts: visualización de datos.
- Tailwind CSS: diseño de la interfaz.
- Vercel: despliegue de la aplicación.

## 2. Objetivo del análisis

El dashboard está diseñado para responder a cinco preguntas de negocio:

1. ¿Cómo evolucionan las ventas y el ticket medio?
2. ¿Qué canales de adquisición presentan una mejor relación entre ingresos atribuidos e inversión?
3. ¿Qué productos y categorías generan más ventas?
4. ¿Qué patrones encontramos en las devoluciones y promociones?
5. ¿Qué diferencias existen entre mercados y en el comportamiento de compra de los clientes?

El objetivo no es únicamente describir los resultados, sino traducirlos en conclusiones cuantificadas y recomendaciones accionables, documentando las decisiones metodológicas y sus limitaciones.


## 3. Conclusiones

### 1. TikTok Ads alcanza un ROAS atribuido de 19,47 frente al 1,03 de Instagram Ads

Qué dice el dato: entre marzo y junio de 2026, TikTok Ads registró 36 pedidos entregados y 3.113,06 € de ingresos atribuidos, con una inversión de 159,93 €. Esto supone un ROAS de 19,47. En cambio, Instagram Ads registró 8 pedidos y 748,86 € de ingresos atribuidos, con una inversión de 724,80 €, lo que representa un ROAS de 1,03.

La diferencia es considerable: TikTok presenta un ROAS atribuido aproximadamente 18,9 veces superior al de Instagram Ads.

Por qué importa: Instagram Ads concentra una inversión 4,5 veces mayor que TikTok, pero genera menos ingresos atribuidos. Esto sugiere que merece la pena revisar su estrategia de inversión.

Propondría realizar una prueba controlada, reduciendo inicialmente un 20 % del presupuesto de Instagram Ads (aproximadamente 145 € sobre la inversión registrada en el periodo) y evaluando su reasignación a TikTok. El objetivo sería comprobar si TikTok mantiene su eficiencia al aumentar la inversión, sin asumir que su ROAS histórico se mantendrá constante.

Antes de tomar una decisión definitiva, también sería necesario revisar las diferencias de atribución, el tipo de audiencia y la calidad de los clientes adquiridos.

Cómo lo he calculado: he utilizado los pedidos con estado delivered, no eliminados, creados entre el 1 de marzo y el 30 de junio de 2026. He agrupado los pedidos por canal, normalizando los nombres mediante LOWER(TRIM(channel)).

La inversión procede de marketing_spend, utilizando el mismo periodo y convirtiendo a euros los registros expresados en céntimos. El ROAS atribuido se calcula como ingresos atribuidos divididos entre inversión registrada.

Esta métrica no representa rentabilidad neta ni demuestra causalidad. Además, el análisis se limita a marzo–junio porque el enunciado indica cambios en la atribución de canales.

Consulta SQL: 01_eficiencia_canales.sql


### 2. El 71,01 % de los clientes con pedidos entregados realizó al menos dos compras durante el semestre

Qué dice el dato: entre enero y junio de 2026, 138 clientes realizaron al menos un pedido entregado y 98 de ellos realizaron dos o más. Esto supone que el 71,01 % de los clientes analizados compró varias veces durante el periodo. Los otros 40 clientes (28,99 %) realizaron un único pedido entregado.

Por qué importa: la repetición de compra representa una oportunidad para trabajar la fidelización y aumentar el valor de los clientes existentes. Sin embargo, también hay 40 clientes que solo realizaron una compra durante el semestre.

Propondría analizar a estos 40 clientes para identificar posibles oportunidades de segunda compra y probar una campaña de seguimiento personalizada, por ejemplo, con recomendaciones de productos complementarios a su primera compra.

El objetivo inicial sería conseguir una segunda compra en el 10 % de este grupo, es decir, en 4 clientes. Se trata de una meta experimental, no de una previsión de ventas. Para evaluar la campaña, compararía su tasa de segunda compra con la de un grupo de control.

Cómo lo he calculado: he considerado los pedidos con estado delivered, no eliminados y creados entre el 1 de enero y el 30 de junio de 2026. He agrupado los pedidos por customer_id y contado cuántos clientes realizaron al menos un pedido y cuántos realizaron dos o más.

La métrica representa la proporción de clientes con compras repetidas dentro del semestre, no una tasa de retención longitudinal. Además, algunos clientes que compraron por primera vez al final del periodo tuvieron menos tiempo para realizar una segunda compra.

Consulta SQL: 03_clientes_recompra.sql


### 3. Alemania genera un 2 % más de facturación que España con un 29 % menos de pedidos

Qué dice el dato: entre enero y junio de 2026, España registró 331 pedidos entregados y una facturación de 24.503,33 €, mientras que Alemania registró 236 pedidos y 24.989,33 €.

Aunque Alemania tuvo 95 pedidos menos que España, generó 486 € más de facturación.

La principal diferencia está en el ticket medio: 105,89 € en Alemania frente a 74,03 € en España, lo que supone un ticket aproximadamente un 43 % superior.

Por qué importa: los dos mercados presentan comportamientos de compra diferentes. España genera más pedidos, mientras que Alemania obtiene más ingresos por pedido.

Esto sugiere que las estrategias comerciales podrían adaptarse a cada país en lugar de aplicar las mismas acciones a ambos.

Propondría analizar qué productos y categorías explican el mayor ticket medio alemán y comprobar si existen oportunidades para aumentar el valor de los pedidos españoles mediante recomendaciones de productos complementarios o estrategias de venta cruzada.

Como prueba inicial, establecería el objetivo de aumentar un 5 % el ticket medio español, pasando de 74,03 € a aproximadamente 77,73 €. Si se mantuviera el volumen de 331 pedidos, esto supondría unos 1.225 € adicionales de facturación durante un periodo equivalente.

Esta cifra es un escenario ilustrativo, no una previsión: habría que validar que las acciones aumentan el importe de compra sin reducir el número de pedidos ni perjudicar el margen.

Cómo lo he calculado: he seleccionado los pedidos con estado delivered, no eliminados y creados entre el 1 de enero y el 30 de junio de 2026.

He agrupado los resultados por country y calculado el número de pedidos, la facturación total y el ticket medio a partir de total_amount_cents, convirtiendo los importes a euros.

El ticket medio incluye los componentes registrados en el importe total del pedido, como envío e impuestos. Por tanto, antes de atribuir la diferencia entre países al comportamiento de compra, sería necesario comprobar cuánto se explica por esos componentes y cuánto por el valor de los productos adquiridos.

Consulta SQL: 04_comparacion_paises.sql


### 4. La facturación cae un 29,7 % entre abril y junio, después de alcanzar su máximo en abril

Qué dice el dato: durante el primer semestre de 2026, abril fue el mes con mayor facturación, con 10.169,26 €, mientras que febrero registró el mínimo, con 6.262,67 €.

Después del máximo de abril, la facturación descendió a 8.430,88 € en mayo y 7.150,11 € en junio. Esto supone una caída acumulada del 29,7 % entre abril y junio, equivalente a 3.019,15 €.

Por qué importa: la caída durante dos meses consecutivos merece investigarse para determinar si responde a una reducción del número de pedidos, a un descenso del ticket medio o a una combinación de ambos factores.

Propondría descomponer la evolución mensual en número de pedidos y ticket medio, y contrastarla con la inversión en marketing y el rendimiento de los distintos canales.

Como objetivo inicial, plantearía recuperar al menos el 50 % de la caída observada entre abril y junio. Esto supondría aproximadamente 1.510 € adicionales de facturación mensual respecto a junio, alcanzando unos 8.660 €.

Esta cifra es un objetivo de referencia, no una previsión. Antes de definir acciones comerciales concretas, sería necesario identificar qué factores explican la caída.

Cómo lo he calculado: he agrupado por mes los pedidos con estado delivered, no eliminados y creados entre el 1 de enero y el 30 de junio de 2026.

La facturación mensual se calcula sumando total_amount_cents y convirtiendo el resultado a euros. Incluye los conceptos de envío e impuestos registrados en el importe total de cada pedido.

La variación entre abril y junio se obtiene mediante:

(7.150,11 - 10.169,26) / 10.169,26 × 100 = -29,7 %

El análisis describe la evolución observada, pero no permite atribuir la caída a una causa específica ni establecer un patrón estacional a partir de un único semestre.

Consulta SQL: 14_evolucion_ventas.sql


### 5. Camiseta Oversize vende 87 unidades, pero tiene una valoración media de solo 3,37/5

Qué dice el dato: entre enero y junio de 2026, Camiseta Oversize generó 2.122 € de ingresos y vendió 87 unidades. Sin embargo, su valoración media es de 3,37/5, calculada a partir de 19 reseñas.

En comparación, Pantalón Cargo generó 2.787,52 € con 62 unidades vendidas y una valoración media de 5,00/5, basada en 17 reseñas.

Esto muestra que un producto con un volumen de ventas considerable puede presentar una satisfacción inferior a la de otros artículos del catálogo.

Por qué importa: Camiseta Oversize combina un volumen relevante de ventas con una valoración relativamente baja. Esto convierte al producto en un candidato prioritario para investigar posibles problemas de calidad, tallaje o expectativas del cliente.

Propondría analizar el contenido de sus 19 reseñas y clasificar los comentarios por motivo de insatisfacción: talla, calidad, diseño o diferencias respecto a la descripción del producto.

Si se identificara un problema recurrente, se podrían probar mejoras específicas, como una guía de tallas más precisa, fotografías adicionales o cambios en la descripción.

El objetivo sería elevar su valoración media en futuras reseñas y comprobar si las mejoras reducen las devoluciones. No podemos estimar todavía el impacto económico porque no hemos demostrado una relación entre las valoraciones y los reembolsos.

Cómo lo he calculado: he relacionado order_items con products mediante product_id y con orders mediante order_id.

He considerado exclusivamente las líneas correspondientes a pedidos entregados, no eliminados y creados entre el 1 de enero y el 30 de junio de 2026.

Los ingresos por producto se calculan multiplicando quantity por unit_price_cents y convirtiendo el resultado a euros. No incluyen necesariamente todos los componentes del importe final del pedido.

Las valoraciones proceden de product_reviews, agrupadas por producto. Las reseñas no están limitadas al primer semestre de 2026, por lo que los periodos de ventas y valoraciones no son equivalentes.

También he incluido los productos actualmente inactivos para no excluir sus ventas históricas.

Consulta SQL: 06_productos_valoraciones.sql


### 6. Casi una de cada cuatro devoluciones está relacionada con problemas de talla

Qué dice el dato: entre enero y junio de 2026 se registraron 53 devoluciones, por un importe total de 3.331,75 €.

De ellas, 13 estaban relacionadas con problemas de talla, lo que representa aproximadamente el 24,5 % de las devoluciones registradas.

Esto convierte el tallaje en un área concreta sobre la que investigar posibles mejoras.

Por qué importa: las devoluciones generan costes operativos y pueden afectar negativamente a la experiencia del cliente. Si una proporción relevante está relacionada con el tallaje, mejorar la información disponible antes de la compra podría ayudar a reducirlas.

Propondría revisar las fichas de los productos con devoluciones por talla, especialmente sus guías de medidas, fotografías y recomendaciones de ajuste.

Como prueba inicial, plantearía reducir un 20 % las devoluciones relacionadas con tallas. Sobre las 13 observadas, esto equivaldría aproximadamente a 3 devoluciones menos en un periodo comparable.

Para evaluar la iniciativa, compararía la tasa de devoluciones por talla antes y después de introducir las mejoras, teniendo en cuenta el volumen de pedidos de cada periodo.

Esta reducción es un objetivo experimental, no un ahorro económico demostrado.

Cómo lo he calculado: he utilizado los registros de refunds creados entre el 1 de enero y el 30 de junio de 2026.

He agrupado las devoluciones por reason, contando los registros y sumando amount_cents, convertido a euros.

El porcentaje de devoluciones relacionadas con tallas se obtiene dividiendo las 13 devoluciones identificadas entre las 53 registradas durante el semestre.

Es importante distinguir este análisis de la tasa general de reembolso del dashboard (9,48 %): aquella utiliza una cohorte de pedidos definida por su fecha de creación, mientras que aquí se consideran los reembolsos según su fecha de registro.

Consulta SQL: 15_motivos_devolucion.sql


### 7. El solapamiento de promociones sobreestima en 1.499 € los ingresos asociados a las campañas

Qué dice el dato: entre enero y junio de 2026, 167 pedidos entregados utilizaron al menos una promoción. De ellos, 19 pedidos (11,4 %) estuvieron asociados a más de una.

Los ingresos únicos de estos pedidos fueron 14.059,34 €. Sin embargo, al sumar los ingresos atribuidos individualmente a cada promoción, el resultado asciende a 15.558,59 €.

La diferencia es de 1.499,25 €, lo que supone una sobreestimación del 10,7 % respecto a los ingresos únicos.

Por qué importa: si evaluamos las promociones sumando los ingresos asociados a cada campaña, podemos atribuir varias veces la misma venta y sobrevalorar su contribución comercial.

Esto podría llevarnos a tomar decisiones equivocadas sobre qué promociones mantener o potenciar.

Propondría utilizar los 14.059,34 € de ingresos únicos como referencia para analizar el conjunto de pedidos promocionados y mantener los ingresos por promoción únicamente para estudiar cada campaña individualmente.

También revisaría los 19 pedidos con varias promociones para comprobar si los descuentos son acumulables y evaluar su efecto sobre el margen.

El siguiente paso sería comparar el rendimiento de las promociones considerando tanto los ingresos como el descuento aplicado, en lugar de valorar su éxito únicamente por la facturación asociada.

Cómo lo he calculado: he relacionado orders con order_promotions mediante order_id, considerando los pedidos con estado delivered, no eliminados y creados entre el 1 de enero y el 30 de junio de 2026.

He agrupado los resultados por pedido y contado el número de promociones distintas asociadas a cada uno mediante COUNT(DISTINCT op.promotion_id).

Los ingresos únicos se calculan sumando una sola vez el importe total de cada pedido promocionado. Para medir el solapamiento, comparo ese resultado con la suma que se obtendría si el importe del pedido se contabilizara una vez por cada promoción asociada.

La diferencia representa una duplicación en la atribución de ingresos, no una pérdida económica ni un coste adicional de descuentos.

Consulta SQL: 07_promociones.sql


### 8. La tasa de reembolso varía del 7,35 % al 9,48 % según cómo se defina el indicador

Qué dice el dato: entre enero y junio de 2026 se registraron 612 pedidos con estado delivered o refunded, excluyendo los pedidos eliminados.

Al calcular la tasa de reembolso utilizando dos criterios distintos, obtenemos resultados diferentes:

- 9,48 % (58 pedidos): pedidos que tienen al menos un registro asociado en la tabla refunds, independientemente de su estado actual.
- 7,35 % (45 pedidos): pedidos cuyo estado figura como refunded en la tabla orders.

La diferencia es de 2,13 puntos porcentuales. Por tanto, utilizar únicamente el estado del pedido puede dejar fuera operaciones que sí tienen un reembolso registrado.

Por qué importa: la definición de un KPI condiciona su interpretación y las decisiones que se toman a partir de él.

Si utilizamos exclusivamente el estado refunded, podríamos infravalorar la frecuencia de los reembolsos. Esto afectaría al seguimiento de la experiencia del cliente y a la evaluación de iniciativas para reducir devoluciones.

Recomendaría establecer como indicador principal el porcentaje de pedidos con al menos un reembolso registrado, manteniendo la tasa basada en el estado del pedido como métrica de control.

También propondría revisar periódicamente los pedidos que tienen registros en refunds, pero siguen figurando como delivered, para comprobar si existe una diferencia legítima entre ambos conceptos o un problema de actualización de estados.

Cómo lo he calculado: he seleccionado los pedidos de orders creados entre el 1 de enero y el 30 de junio de 2026, con estado delivered o refunded y sin fecha de eliminación.

Sobre esta misma población de 612 pedidos, he calculado dos porcentajes:

1. Pedidos para los que existe al menos un registro en refunds, utilizando EXISTS para evitar contar varias veces un mismo pedido.
2. Pedidos cuyo estado actual es refunded.

Ambos indicadores utilizan el mismo denominador, por lo que la comparación refleja exclusivamente el efecto de cambiar la definición del numerador.

Los reembolsos pueden haberse registrado después del semestre analizado, ya que el filtro temporal se aplica a la fecha de creación del pedido.

Consulta SQL: 10_tasa_devolucion.sql



## 4. Metodología y criterios de análisis

El análisis se ha realizado mediante consultas SQL sobre la base de datos de Supabase. Los resultados se presentan en un dashboard desarrollado con Next.js.


### 4.1. Periodos analizados

El análisis general de ventas, clientes, productos y promociones comprende del 1 de enero al 30 de junio de 2026.

Para evaluar la eficiencia de los canales de marketing se utiliza únicamente el periodo de marzo a junio de 2026, con el objetivo de mantener un criterio de atribución comparable.


### 4.2. Filtros y criterios utilizados

Para mantener la coherencia entre los distintos indicadores, se han aplicado los siguientes criterios:

- Ventas: se consideran los pedidos con estado delivered, excluyendo aquellos que tienen una fecha de eliminación (deleted_at IS NOT NULL).
- Clientes: la recompra se calcula a partir de los pedidos entregados durante el semestre. Por tanto, mide qué porcentaje de clientes realizó al menos dos compras en ese periodo, no la retención histórica.
- Productos: se incluyen las ventas de productos que actualmente puedan estar inactivos, ya que también forman parte de las ventas históricas.
- Marketing: los ingresos atribuidos y la inversión publicitaria se agrupan por canal antes de calcular el ROAS. Este indicador refleja la relación entre ingresos atribuidos e inversión, pero no demuestra que las campañas hayan generado esas ventas de forma incremental.
- Reembolsos: se distingue entre los pedidos que tienen algún reembolso registrado y aquellos cuyo estado figura como refunded. Ambas definiciones se comparan para evaluar cómo cambia la tasa de reembolso.
- Promociones: cuando un pedido está asociado a varias promociones, su importe se cuenta una sola vez al calcular la facturación total de los pedidos promocionados.


### 4.3. Supuestos y limitaciones

Los resultados deben interpretarse teniendo en cuenta algunas limitaciones:

- Los ingresos totales de los pedidos pueden incluir conceptos como gastos de envío, impuestos o descuentos, por lo que no tienen por qué coincidir con la suma de los importes de sus productos.
- Las valoraciones de los productos se consultan sin restringirlas al primer semestre de 2026, por lo que pueden corresponder a otros periodos.
- Las devoluciones agrupadas por motivo se seleccionan según la fecha del reembolso, mientras que la tasa general de reembolso se calcula sobre pedidos creados durante el semestre.
- Las asociaciones observadas entre marketing, promociones y ventas no permiten establecer relaciones causales.
- Las mejoras económicas planteadas en las recomendaciones son objetivos o escenarios orientativos, no previsiones de resultados garantizados.

Las consultas SQL utilizadas se incluyen en la carpeta sql/, de manera que los cálculos puedan revisarse y reproducirse.



## 5. Modelo de datos

El análisis parte de un modelo relacional en el que orders es la tabla principal para estudiar las ventas. A partir de ella se relacionan los clientes, los productos, las promociones y los reembolsos.


### 5.1. Tablas utilizadas y relaciones

| Tabla | Información utilizada | Relación principal |
|---|---|---|
| orders | Pedidos, importes, fechas, estados y países | Tabla principal |
| customers | Información de los clientes | orders.customer_id = customers.id |
| order_items | Productos y cantidades de cada pedido | order_items.order_id = orders.id |
| products | Información y categorías de los productos | order_items.product_id = products.id |
| order_promotions | Promociones asociadas a cada pedido | order_promotions.order_id = orders.id |
| promotions | Información de las promociones | order_promotions.promotion_id = promotions.id |
| refunds | Importes y motivos de los reembolsos | refunds.order_id = orders.id |
| product_reviews | Valoraciones de los productos | product_reviews.product_id = products.id |
| marketing_spend | Inversión publicitaria por canal y fecha | Se agrupa por canal y periodo para compararla con los ingresos atribuidos |


### 5.2. Nivel de detalle de los datos y prevención de duplicados

Cada tabla recoge información con un nivel de detalle diferente.

Por ejemplo, orders contiene un registro por pedido, mientras que order_items puede contener varias líneas para un mismo pedido. Del mismo modo, un pedido puede estar asociado a varias promociones o tener más de un registro de reembolso.

Esto es importante porque, si unimos directamente estas tablas y después sumamos los importes, podríamos contar varias veces una misma venta.

Para evitarlo, se han seguido estos criterios:

- Ventas generales: se calculan directamente desde orders, sin añadir relaciones que puedan duplicar los pedidos.
- Ventas por producto: se calculan desde order_items, multiplicando la cantidad vendida por el precio unitario.
- Promociones: se agrupan los resultados por pedido antes de calcular los ingresos totales, evitando contar varias veces las ventas asociadas a distintas promociones.
- Reembolsos: se utiliza EXISTS para comprobar si un pedido tiene algún reembolso, sin duplicarlo cuando existen varios registros.
- Marketing: se calculan por separado los ingresos atribuidos y la inversión publicitaria de cada canal antes de obtener el ROAS.

### 5.3. Tratamiento y preparación de los datos

Antes de calcular los indicadores, se han aplicado algunas transformaciones:

Conversión de importes a euros. Los valores almacenados en céntimos se dividen entre 100. En el caso de marketing_spend, se tiene en cuenta la unidad monetaria indicada en cada registro.

Normalización de canales. Se utiliza LOWER(TRIM(channel)) para evitar que diferencias de mayúsculas o espacios generen categorías distintas para un mismo canal.

Filtrado de pedidos. Se excluyen los pedidos eliminados y se seleccionan los estados correspondientes a cada análisis.

Agrupación de registros. Cuando una tabla contiene varias filas asociadas a un mismo pedido, los datos se agrupan antes de calcular los indicadores que requieren contar cada pedido una sola vez.

Estas decisiones permiten mantener la coherencia entre las consultas y evitar errores de interpretación al comparar los resultados.



## 6. Decisiones de diseño del dashboard

El dashboard está pensado para los equipos de dirección, marketing, ventas y producto, con información relevante para cada área.
He situado primero los KPI generales y la evolución de ventas para ofrecer una visión global del negocio antes de entrar en análisis más específicos.
Las vistas de marketing permiten comparar canales; las de clientes, analizar la recompra; y las de productos y devoluciones, identificar oportunidades de mejora.
He dejado fuera las recomendaciones detalladas para mantener el dashboard claro y visual, desarrollándolas por separado en el README.
Para comparar las ventas por país, probé inicialmente un gráfico circular, pero lo descarté porque las barras permiten comparar mejor los importes y apreciar las diferencias entre países.

