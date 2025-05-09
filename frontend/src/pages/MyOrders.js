import React, { useEffect, useState } from 'react';
import API from '../api/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/orders/my-orders')
      .then(res => setOrders(res.data))
      .catch(() => setError('Erro ao buscar pedidos'));
  }, []);

  return (
    <div>
      <h2>Meus Pedidos</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {orders.length === 0 ? (
        <p>Você ainda não fez nenhum pedido.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {orders.map(order => (
            <li key={order._id} style={{ border: '1px solid #ccc', borderRadius: '6px', marginBottom: '10px', padding: '10px' }}>
              <h3>{order.product?.title}</h3>
              {order.product?.image && (
                <img src={order.product.image} alt={order.product.title} style={{ maxWidth: '150px' }} />
              )}
              <p><strong>Preço:</strong> R$ {order.product?.price.toFixed(2)}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Vendedor:</strong> {order.seller?.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyOrders;
