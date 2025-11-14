require('dotenv').config();
const { getConnection } = require('./src/config/sqlserver');

async function initDatabase() {
  try {
    console.log('Iniciando configuração do banco de dados...');
    const pool = await getConnection();
    
    const checkTable = await pool.request().query(`
      SELECT * FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME = 'Customers'
    `);

    if (checkTable.recordset.length === 0) {
      console.log('📋 Tabela Customers não encontrada. Criando...');
      
      await pool.request().query(`
        CREATE TABLE Customers (
          id INT PRIMARY KEY IDENTITY(1,1),
          name NVARCHAR(100) NOT NULL,
          email NVARCHAR(100) UNIQUE NOT NULL,
          password NVARCHAR(255) NOT NULL,
          phone NVARCHAR(20),
          created_at DATETIME DEFAULT GETDATE()
        );
      `);
      
      console.log('Tabela Customers criada.');
    } else {
      console.log('Tabela Customers já existe!');
    }

    const countResult = await pool.request().query('SELECT COUNT(*) as total FROM Customers');
    console.log(`Total de clientes cadastrados: ${countResult.recordset[0].total}`);

    console.log('Banco de dados SQL configurado.');
    process.exit(0);
  } catch (err) {
    console.error('Erro:', err.message);
    process.exit(1);
  }
}

initDatabase();