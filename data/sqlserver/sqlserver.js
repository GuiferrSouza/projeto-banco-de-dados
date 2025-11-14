const sql = require('mssql');

const config = {
  server: 'localhost',
  database: 'myapp',
  user: 'sa',
  password: 'YourStrong!Passw0rd',
  port: parseInt('1433'),

  options: {
    encrypt: false,
    trustServerCertificate: true,
  },

  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool = null;

async function getConnection() {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log(`Conectado ao SQL Server em ${config.server}:${config.port}`);
    }
    return pool;
  } catch (err) {
    console.error('Erro ao conectar no SQL Server:', err);
    throw err;
  }
}

async function closeConnection() {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('SQL Server: Conexão fechada');
    }
  } catch (err) {
    console.error('Erro ao fechar conexão SQL Server:', err);
  }
}

module.exports = {
  getConnection,
  closeConnection,
  sql
};