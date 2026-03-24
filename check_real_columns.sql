-- Ver qué columnas de visibilidad realmente existen en stores
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'stores' 
    AND table_schema = 'public'
    AND (
        column_name LIKE '%mostrar%' 
        OR column_name LIKE '%inicio%'
        OR column_name LIKE '%contacto%'
        OR column_name LIKE '%acerca%'
    )
ORDER BY column_name;

-- Ver una fila completa para entender los datos reales
SELECT * FROM stores LIMIT 1;
