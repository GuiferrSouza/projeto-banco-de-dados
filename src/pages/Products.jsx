import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Products({ user }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data.products);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    setMessage(`${product.name} adicionado ao carrinho!`);
    setTimeout(() => setMessage(''), 3000);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setMessage('Carrinho vazio!');
      return;
    }

    try {
      const orderData = {
        customerId: user.id,
        customerName: user.name,
        items: cart.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: getTotalAmount()
      };

      await axios.post('/api/orders', orderData);
      setMessage('Pedido realizado com sucesso!');
      setCart([]);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Erro ao finalizar pedido');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="page-title">Carregando produtos...</div>;
  }

  return (
    <div>
      <h1 className="page-title">Catálogo de Produtos</h1>
      
      {message && <div className="success-message">{message}</div>}
      
      {cart.length > 0 && (
        <div className="order-card" style={{ marginBottom: '2rem' }}>
          <h3>Carrinho ({cart.length} itens)</h3>
          {cart.map(item => (
            <div key={item._id} className="order-item">
              <span>{item.name} - R$ {item.price.toFixed(2)}</span>
              <div>
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                <span style={{ margin: '0 1rem' }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                <button onClick={() => removeFromCart(item._id)} style={{ marginLeft: '1rem' }}>Remover</button>
              </div>
            </div>
          ))}
          <div style={{ marginTop: '1rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
            Total: R$ {getTotalAmount().toFixed(2)}
          </div>
          <button className="form-button" onClick={handleCheckout} style={{ marginTop: '1rem' }}>
            Finalizar Pedido
          </button>
        </div>
      )}

      <div className="products-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <div className="product-image" style={{ 
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999'
            }}>
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span>Sem imagem</span>
              )}
            </div>
            <div className="product-info">
              <div className="product-brand">{product.brand}</div>
              <h3 className="product-name">{product.name}</h3>
              <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.5rem 0' }}>
                {product.description.substring(0, 80)}...
              </p>
              <div className="product-price">R$ {product.price.toFixed(2)}</div>
              {product.sizes && product.sizes.length > 0 && (
                <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.5rem' }}>
                  Tamanhos: {product.sizes.join(', ')}
                </div>
              )}
              <button className="product-button" onClick={() => addToCart(product)}>
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;