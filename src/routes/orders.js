const express = require('express');
const crypto = require('crypto');

const { 
  dbInsert,
  dbFind,
  dbFindOne,
  dbUpdate,
  dbUpdateByCustomer,
  ordersTable,
  ordersByCustomerTable,
  logsTable
} = require('../../data/scylla/scylladb');

const router = express.Router();

router.use(async (req, res, next) => {
  try {
    const logEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      method: req.method,
      path: req.path,
      body: JSON.stringify(req.body || {}),
      query: JSON.stringify(req.query || {})
    };

    await dbInsert(logsTable, logEntry);
  } catch (err) {
    console.error('Erro ao logar requisição:', err);
  }

  next();
});

router.post('/', async (req, res) => {
  try {
    const { customerId, customerName, items, totalAmount } = req.body;

    if (!customerId || !items || items.length === 0) {
      return res.status(400).json({ error: 'Dados do pedido incompletos' });
    }

    const id = crypto.randomUUID();
    const now = new Date();

    const order = {
      id,
      customer_id: parseInt(customerId),
      customer_name: customerName || null,
      items,
      total_amount: totalAmount,
      status: 'pending',
      created_at: now,
      updated_at: now
    };

    await dbInsert(ordersTable, order);
    await dbInsert(ordersByCustomerTable, order);

    res.status(201).json({
      message: 'Pedido criado com sucesso',
      order
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
});

router.get('/customer/:customerId', async (req, res) => {
  try {
    const customerId = parseInt(req.params.customerId);
    const orders = await dbFind(ordersByCustomerTable, { customer_id: customerId });
    orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json({ orders });
  } catch (err) {
    console.error('Erro ao buscar pedidos por cliente:', err);
    res.status(500).json({ error: 'Erro ao buscar pedidos do cliente' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await dbFindOne(ordersTable, { id: req.params.id });

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar pedido' });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    const order = await dbFindOne(ordersTable, { id: req.params.id });
    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    const now = new Date();

    await dbUpdate(
      ordersTable,
      { id: req.params.id },
      { status, updated_at: now }
    );

    await dbUpdateByCustomer(
      ordersByCustomerTable,
      order.customer_id,
      order.id,
      { status, updated_at: now }
    );

    res.json({ message: 'Status atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
});

router.get('/logs/requests', async (req, res) => {
  try {
    const logs = await dbFind(logsTable, { id: '' });
    res.json({ logs: logs.slice(-100) });
  } catch (err) {
    console.error('Erro ao buscar logs:', err);
    res.status(500).json({ error: 'Erro ao buscar logs' });
  }
});

module.exports = router;