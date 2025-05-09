import React, { useEffect, useState } from 'react';
import API from '../api/api'; // ou axios configurado com baseURL

const MySales = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders/received');
        setOrders(res.data);
      } catch (err) {
        console.error('Erro ao carregar pedidos', err);
        setError('Erro ao carregar pedidos recebidos');
      }
    };

    fetchOrders();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Pedidos Recebidos</h2>
      {orders.length === 0 ? (
        <p>Você ainda não tem pedidos recebidos.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id} style={{ marginBottom: '15px' }}>
              <h3>Pedido de {order.user.name} - {order.user.email}</h3>
              <p><strong>Status:</strong> {order.status}</p>

              <ul>
                {order.products.map((item) => (
                  <li key={item.product._id}>
                    <p><strong>Produto:</strong> {item.product.title}</p>
                    <p><strong>Preço:</strong> R$ {item.product.price.toFixed(2)}</p>
                    <p><strong>Quantidade:</strong> {item.quantity}</p>
                  </li>
                ))}
              </ul>

              <p><strong>Total:</strong> R$ {order.totalPrice.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MySales;
