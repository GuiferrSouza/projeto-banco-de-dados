require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const customersRoutes = require('./src/routes/customers');
const productsRoutes = require('./src/routes/products');
const ordersRoutes = require('./src/routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, _, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use('/api/customers', customersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);

const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'API route not found' });
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => { console.log(`Servidor rodando na porta ${PORT}`) });

module.exports = app;