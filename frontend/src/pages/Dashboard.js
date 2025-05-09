import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const res = await API.get('/products/mine');
        setProducts(res.data);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        setError('Erro ao carregar seus produtos.');
      }
    };

    if (user?.isSeller) {
      fetchMyProducts();
    }
  }, [user]);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Painel do Usuário</h2>
      <p><strong>Nome:</strong> {user?.name}</p>
      <p><strong>Tipo:</strong> {user?.isSeller ? 'Vendedor' : 'Comprador'}</p>

      {user?.isSeller ? (
        <>
          <h3>Meus Produtos</h3>
          <Link to="/create" style={{ marginRight: '10px' }}>Cadastrar Produto</Link>
          <Link to="/my-sales" style={{ marginRight: '10px' }}>Pedidos Recebidos</Link>

          {products.length === 0 ? (
            <p>Você ainda não cadastrou produtos.</p>
          ) : (
            <ul>
              {products.map((prod) => (
                <li key={prod._id} style={{ marginBottom: '15px' }}>
                  <strong>{prod.title}</strong> - R$ {prod.price.toFixed(2)}
                  {prod.image && (
                    <div>
                      <img src={prod.image} alt={prod.title} width="100" />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          <p><strong>Seus pedidos:</strong></p>
          <Link to="/my-orders">Ver Meus Pedidos</Link>
        </>
      )}
    </div>
  );
};

export default Dashboard;
