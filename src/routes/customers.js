const express = require('express');
const bcrypt = require('bcrypt');
const { getConnection, sql } = require('../config/sqlserver');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const pool = await getConnection();
    
    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, hashedPassword)
      .input('phone', sql.NVarChar, phone || null)
      .query(`
        INSERT INTO Customers (name, email, password, phone)
        VALUES (@name, @email, @password, @phone);
        SELECT * FROM Customers WHERE id = SCOPE_IDENTITY();
      `);

    const customer = result.recordset[0];
    delete customer.password;

    res.status(201).json({ 
      message: 'Cliente cadastrado com sucesso',
      customer 
    });
  } catch (err) {
    console.error(err);
    if (err.number === 2627) {
      res.status(409).json({ error: 'Email já cadastrado' });
    } else {
      res.status(500).json({ error: 'Erro ao cadastrar cliente' });
    }
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const pool = await getConnection();
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM Customers WHERE email = @email');

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const customer = result.recordset[0];
    const validPassword = await bcrypt.compare(password, customer.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    delete customer.password;
    res.json({ 
      message: 'Login realizado com sucesso',
      customer 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

router.get('/', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .query('SELECT id, name, email, phone, created_at FROM Customers');

    res.json({ customers: result.recordset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT id, name, email, phone, created_at FROM Customers WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json({ customer: result.recordset[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, phone } = req.body;
    const pool = await getConnection();
    
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('name', sql.NVarChar, name)
      .input('phone', sql.NVarChar, phone)
      .query(`
        UPDATE Customers 
        SET name = @name, phone = @phone
        WHERE id = @id
      `);

    res.json({ message: 'Cliente atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const pool = await getConnection();
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Customers WHERE id = @id');

    res.json({ message: 'Cliente removido com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover cliente' });
  }
});

module.exports = router;