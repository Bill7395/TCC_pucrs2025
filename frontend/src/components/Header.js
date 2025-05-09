import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <header style={{
      backgroundColor: '#191970',
      color: 'white',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <h1>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>MarketTCC</Link>
      </h1>
      <nav>
        {user ? (
          <>
            <span style={{ marginRight: '10px' }}>Olá, {user.name}</span>
            <Link to="/my-orders" style={{ marginRight: '10px' }}>Meus Pedidos</Link>
            <Link to="/dashboard" style={{ marginRight: '10px' }}>Painel</Link>
            
            {user.isSeller && (
              <>
                <Link to="/create" style={{ marginRight: '10px' }}>Vender</Link>
                <Link to="/my-sales" style={{ marginRight: '10px' }}>Pedidos Recebidos</Link>
              </>
            )}

            <Link to="/cart" style={{ marginRight: '10px' }}>Carrinho</Link>

            <button
              onClick={logout}
              style={{
                backgroundColor: '#FF1493',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer'
              }}
            >
              Sair
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
            <Link to="/register">Registrar</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
