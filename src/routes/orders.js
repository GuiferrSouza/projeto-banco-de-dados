const express = require('express');
const { ordersDB, requestLogsDB, dbInsert, dbFind, dbFindOne, dbUpdate } = require('../config/firebase');

const router = express.Router();

router.use((req, res, next) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    body: req.body,
    query: req.query
  };

  dbInsert(requestLogsDB, logEntry)
    .then(() => next())
    .catch(err => {
      console.error('Erro ao logar requisição:', err);
      next();
    });
});

router.post('/', async (req, res) => {
  try {
    const { customerId, customerName, items, totalAmount } = req.body;

    if (!customerId || !items || items.length === 0) {
      return res.status(400).json({ error: 'Dados do pedido incompletos' });
    }

    const order = {
      customerId,
      customerName,
      items,
      totalAmount,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const newOrder = await dbInsert(ordersDB, order);
    res.status(201).json({
      message: 'Pedido criado com sucesso',
      order: newOrder
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
});

router.get('/', async (req, res) => {
  try {
    const orders = await dbFind(ordersDB);
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

router.get('/customer/:customerId', async (req, res) => {
  try {
    const orders = await dbFind(ordersDB, { customerId: parseInt(req.params.customerId) });
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar pedidos do cliente' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await dbFindOne(ordersDB, { _id: req.params.id });

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

    const numUpdated = await dbUpdate(
      ordersDB,
      { _id: req.params.id },
      { $set: { status, updatedAt: new Date().toISOString() } }
    );

    if (numUpdated === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    res.json({ message: 'Status atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
});

router.get('/logs/requests', async (req, res) => {
  try {
    const logs = await dbFind(requestLogsDB);
    res.json({ logs: logs.slice(-100) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar logs' });
  }
});

module.exports = router;