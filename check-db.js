require('dotenv').config();
const { Client } = require('pg');

async function checkDatabaseConnection() {
  console.log('Intentando conectar a la base de datos...');
  console.log('URL de Conexión (sin contraseña):', process.env.DATABASE_URL.replace(/:[^:]+@/, ':<password>@'));

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('\x1b[32m%s\x1b[0m', '¡ÉXITO! La conexión a la base de datos se ha establecido correctamente.');
    const res = await client.query('SELECT NOW()');
    console.log('Respuesta del servidor de la base de datos:', res.rows[0]);
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', '¡ERROR! No se pudo conectar a la base de datos.');
    console.error(err);
  } finally {
    await client.end();
    console.log('Conexión cerrada.');
  }
}

checkDatabaseConnection();
