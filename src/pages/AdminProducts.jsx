import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    sizes: '',
    colors: '',
    brand: '',
    material: '',
    stock: '',
    imageUrl: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data.products);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s),
        colors: formData.colors.split(',').map(c => c.trim()).filter(c => c)
      };

      await axios.post('/api/products', productData);
      setMessage('Produto cadastrado com sucesso!');
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        sizes: '',
        colors: '',
        brand: '',
        material: '',
        stock: '',
        imageUrl: ''
      });
      loadProducts();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Erro ao cadastrar produto');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir este produto?')) return;

    try {
      await axios.delete(`/api/products/${id}`);
      setMessage('Produto removido com sucesso!');
      loadProducts();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Erro ao remover produto');
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="page-title">Administração de Produtos</h1>
      {message && <div className="success-message">{message}</div>}

      <div className="admin-form">
        <h2 style={{ marginBottom: '1.5rem' }}>Cadastrar Novo Produto</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nome do Produto</label>
              <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Marca</label>
              <input type="text" name="brand" className="form-input" value={formData.brand} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descrição</label>
            <textarea name="description" className="form-input" value={formData.description} onChange={handleChange} rows="3" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Categoria</label>
              <input type="text" name="category" className="form-input" value={formData.category} onChange={handleChange} placeholder="Ex: Camiseta, Calça, Vestido" required />
            </div>
            <div className="form-group">
              <label className="form-label">Preço (R$)</label>
              <input type="number" step="0.01" name="price" className="form-input" value={formData.price} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tamanhos (separados por vírgula)</label>
              <input type="text" name="sizes" className="form-input" value={formData.sizes} onChange={handleChange} placeholder="P, M, G, GG" />
            </div>
            <div className="form-group">
              <label className="form-label">Cores (separadas por vírgula)</label>
              <input type="text" name="colors" className="form-input" value={formData.colors} onChange={handleChange} placeholder="Preto, Branco, Azul" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Material</label>
              <input type="text" name="material" className="form-input" value={formData.material} onChange={handleChange} placeholder="Ex: Algodão, Poliéster" />
            </div>
            <div className="form-group">
              <label className="form-label">Estoque</label>
              <input type="number" name="stock" className="form-input" value={formData.stock} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">URL da Imagem</label>
            <input type="url" name="imageUrl" className="form-input" value={formData.imageUrl} onChange={handleChange} placeholder="https://exemplo.com/imagem.jpg" />
          </div>

          <button type="submit" className="form-button">Cadastrar Produto</button>
        </form>
      </div>

      <h2 style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>Produtos Cadastrados</h2>

      <div className="products-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <div className="product-image" style={{ backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span>Sem imagem</span>
              )}
            </div>
            <div className="product-info">
              <div className="product-brand">{product.brand}</div>
              <h3 className="product-name">{product.name}</h3>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>{product.category}</p>
              <div className="product-price">R$ {product.price.toFixed(2)}</div>
              <p style={{ fontSize: '0.85rem', color: '#888' }}>Estoque: {product.stock}</p>
              <button className="product-button" onClick={() => handleDelete(product._id)} style={{ backgroundColor: '#d32f2f' }}>
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProducts;