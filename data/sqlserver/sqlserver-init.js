const sql = require("mssql");

const config = {
    user: "sa",
    password: "YourStrong!Passw0rd",
    server: "sqlserver",
    database: "master",
    options: {
        trustServerCertificate: true
    }
};

async function init() {
    console.log("Conectando ao SQL Server...");

    let pool = await sql.connect(config);

    console.log("Criando banco se não existir...");
    await pool.request().query(`
        IF DB_ID('myapp') IS NULL
        BEGIN
            CREATE DATABASE myapp;
        END
    `);

    console.log("Criando tabela se não existir...");
    await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM myapp.INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Customers')
        BEGIN
            CREATE TABLE myapp.dbo.Customers (
                id INT PRIMARY KEY IDENTITY(1,1),
                name NVARCHAR(100) NOT NULL,
                email NVARCHAR(100) UNIQUE NOT NULL,
                password NVARCHAR(255) NOT NULL,
                phone NVARCHAR(20),
                created_at DATETIME DEFAULT GETDATE()
            );
        END
    `);

    console.log("Banco e tabelas criados com sucesso!");
    process.exit(0);
}

init().catch(err => {
    console.error("Erro:", err);
    process.exit(1);
});