import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import CreateProduct from './pages/CreateProduct';
import MyOrders from './pages/MyOrders';
import SellerOrders from './pages/SellerOrders';
import Dashboard from './pages/Dashboard';
import CartPage from './pages/CartPage'; // <--- Importa a página do carrinho
import { CartProvider } from './context/CartContext'; // <--- Importa o provider do contexto

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Header />
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/create" element={<CreateProduct />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/my-sales" element={<SellerOrders />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cart" element={<CartPage />} /> {/* Rota do carrinho */}
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
