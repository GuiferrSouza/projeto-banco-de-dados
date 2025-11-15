import { useState, useEffect } from 'react';
import axios from 'axios';

function Orders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.id) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      const response = await axios.get(`/api/orders/customer/${user.id}`);
      
      setOrders(response.data.orders || []);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar pedidos');
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    return `order-status status-${status}`;
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pendente',
      processing: 'Processando',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado'
    };
    return labels[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não disponível';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) {
    return <div className="page-title">Verificando autenticação...</div>;
  }

  if (loading) {
    return <div className="page-title">Carregando pedidos...</div>;
  }

  if (error) {
    return (
      <div>
        <h1 className="page-title">Meus Pedidos</h1>
        <div className="order-card">
          <p style={{ color: '#e53e3e', fontSize: '1.1rem', textAlign: 'center' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div>
        <h1 className="page-title">Meus Pedidos</h1>
        <div className="order-card">
          <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#718096' }}>
            Você ainda não fez nenhum pedido.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Meus Pedidos</h1>
      
      {orders.map(order => {
        console.log('7. Renderizando order:', order);
        
        const items = typeof order.items === 'string' 
          ? JSON.parse(order.items) 
          : order.items || [];

        return (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <strong style={{ fontSize: '1.2rem', color: '#2d3748' }}>
                  Pedido #{order.id ? order.id.substring(0, 8) : 'N/A'}
                </strong>
                <div style={{ fontSize: '0.95rem', color: '#718096', marginTop: '0.5rem' }}>
                  {formatDate(order.created_at)}
                </div>
              </div>
              <span className={getStatusClass(order.status)}>
                {getStatusLabel(order.status)}
              </span>
            </div>
            
            <div className="order-items">
              <h4>Itens do Pedido:</h4>
              {items.map((item, index) => (
                <div key={index} className="order-item">
                  <span style={{ fontWeight: 600, color: '#2d3748' }}>
                    {item.name || 'Produto'}
                  </span>
                  <span style={{ color: '#667eea', fontWeight: 600 }}>
                    {item.quantity || 0}x R$ {item.price ? item.price.toFixed(2) : '0.00'}
                  </span>
                </div>
              ))}
            </div>
            
            <div style={{ 
              marginTop: '1.5rem', 
              paddingTop: '1.5rem', 
              borderTop: '2px solid #e2e8f0',
              textAlign: 'right'
            }}>
              <span style={{ fontSize: '1.1rem', color: '#4a5568', marginRight: '1rem' }}>
                Total:
              </span>
              <span style={{ 
                fontSize: '1.75rem', 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                R$ {order.total_amount ? order.total_amount.toFixed(2) : '0.00'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Orders;