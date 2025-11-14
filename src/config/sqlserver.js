const sql = require('mssql');

const config = {
  server: 'EPLNTB-3K86324',
  database: 'FEI_DB',
  user: 'sa',
  password: 'admin',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    instanceName: 'SQLEXPRESS',
    port: 1433
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
      console.log('Conectado ao SQL Server');
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