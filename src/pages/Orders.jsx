import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Orders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await axios.get(`/api/orders/customer/${user.id}`);
      setOrders(response.data.orders);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
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
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
  };

  if (loading) {
    return <div className="page-title">Carregando pedidos...</div>;
  }

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="page-title">Meus Pedidos</h1>
        <div className="order-card">
          <p>Você ainda não fez nenhum pedido.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Meus Pedidos</h1>
      
      {orders.map(order => (
        <div key={order._id} className="order-card">
          <div className="order-header">
            <div>
              <strong>Pedido #{order._id.substring(0, 8)}</strong>
              <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                {formatDate(order.createdAt)}
              </div>
            </div>
            <span className={getStatusClass(order.status)}>
              {getStatusLabel(order.status)}
            </span>
          </div>
          
          <div className="order-items">
            <h4 style={{ marginBottom: '0.5rem' }}>Itens:</h4>
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <span>{item.name}</span>
                <span>
                  {item.quantity}x R$ {item.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          
          <div style={{ 
            marginTop: '1rem', 
            paddingTop: '1rem', 
            borderTop: '1px solid #eee',
            textAlign: 'right',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}>
            Total: R$ {order.totalAmount.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Orders;