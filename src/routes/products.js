const express = require('express');
const { connectMongoDB, Product } = require('../../data/mongo/mongodb');

const router = express.Router();

connectMongoDB();

router.post('/', async (req, res) => {
  try {
    const { name, description, category, price, sizes, colors, brand, material, stock, imageUrl } = req.body;
    
    if (!name || !description || !category || !price || !brand) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    const product = new Product({
      name,
      description,
      category,
      price,
      sizes: sizes || [],
      colors: colors || [],
      brand,
      material,
      stock: stock || 0,
      imageUrl
    });

    await product.save();
    res.status(201).json({ 
      message: 'Produto cadastrado com sucesso',
      product 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao cadastrar produto' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json({ 
      message: 'Produto atualizado com sucesso',
      product 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json({ message: 'Produto removido com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover produto' });
  }
});

router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

module.exports = router;