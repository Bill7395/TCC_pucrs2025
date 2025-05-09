import React from 'react';
import { useCart } from '../context/CartContext';
import API from '../api/api';

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart, getTotal } = useCart();

  const handleCheckout = async () => {
    try {
      const orderData = {
        items: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity
        })),
        total: getTotal(),
      };

      await API.post('/orders', orderData);
      alert('Pedido finalizado com sucesso!');
      clearCart();
    } catch (err) {
      console.error('Erro ao finalizar pedido:', err.response?.data || err.message);
      alert('Erro ao finalizar pedido.');
    }
  };

  if (cartItems.length === 0) {
    return <h2>Seu carrinho está vazio</h2>;
  }

  return (
    <div>
      <h2>Seu Carrinho</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item._id}>
            {item.title} - R$ {item.price} x {item.quantity}
            <button onClick={() => removeFromCart(item._id)}>Remover</button>
          </li>
        ))}
      </ul>
      <p>Total: R$ {getTotal().toFixed(2)}</p>
      <button onClick={handleCheckout}>Finalizar Pedido</button>
    </div>
  );
};

export default CartPage;
