-- Ver qué devuelve la API de stores para YANDEX
SELECT 
    id,
    name,
    mostrar_inicio,
    mostrar_contacto,
    mostrar_acerca_de,
    logo,
    navbar_color,
    color_primario
FROM stores 
WHERE link = 'yandex';

-- Ver qué hay en store_navigation_sections para YANDEX
SELECT 
    id,
    store_id,
    name,
    slug,
    is_visible,
    is_custom,
    created_at
FROM store_navigation_sections 
WHERE store_id = (
    SELECT id FROM stores WHERE link = 'yandex'
)
ORDER BY "order";
