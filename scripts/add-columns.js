const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'cambalache_db',
  user: 'postgres',
  password: '',
});

const columns = [
  'navbar_style text DEFAULT \'blanco\'',
  'estilo_bordes text DEFAULT \'suave\'',
  'estilo_fondo text DEFAULT \'blanco\'',
  'tipografia text DEFAULT \'system\'',
  'tamano_texto text DEFAULT \'normal\'',
  'estilo_tarjetas text DEFAULT \'borde\'',
  'estilo_fotos text DEFAULT \'cuadrado\'',
  'grid_density text DEFAULT \'auto\'',
  'menu_items text'
];

async function addColumns() {
  const client = await pool.connect();
  try {
    for (const column of columns) {
      const query = `ALTER TABLE stores ADD COLUMN IF NOT EXISTS ${column};`;
      console.log(`Ejecutando: ${query}`);
      await client.query(query);
    }
    console.log('Columnas agregadas exitosamente');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

addColumns();
