import React, { useEffect, useState } from 'react';
import API from '../api/api';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/orders/my-sales')
      .then(res => setOrders(res.data))
      .catch(() => setError('Erro ao carregar pedidos'));
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      alert('Status atualizado!');
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    } catch (err) {
      alert('Erro ao atualizar status');
    }
  };

  return (
    <div>
      <h2>Pedidos Recebidos</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {orders.length === 0 ? (
        <p>Você ainda não recebeu pedidos.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {orders.map(order => (
            <li key={order._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <h3>{order.product?.title}</h3>
              <p><strong>Comprador:</strong> {order.buyer?.name}</p>
              <p><strong>Preço:</strong> R$ {order.product?.price.toFixed(2)}</p>
              <p><strong>Status atual:</strong> {order.status}</p>

              <label>Atualizar status:</label><br />
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
              >
                <option value="pendente">Pendente</option>
                <option value="enviado">Enviado</option>
                <option value="entregue">Entregue</option>
              </select>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SellerOrders;
