import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error('Erro ao carregar produto:', err));
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingItem = cart.find(item => item.productId === product._id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ productId: product._id, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    navigate('/');
  };

  if (!product) return <p>Carregando...</p>;

  const isOutOfStock = product.stock === 0;

  return (
    <div>
      <h2>{product.title}</h2>
      <img src={product.image} alt={product.title} style={{ width: '300px' }} />
      <p><strong>Preço:</strong> R$ {product.price.toFixed(2)}</p>
      <p><strong>Descrição:</strong> {product.description}</p>
      <p><strong>Estoque:</strong> {isOutOfStock ? 'Indisponível' : product.stock}</p>

      {!isOutOfStock && (
        <>
          <label>Quantidade:</label>
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
          />
          <br />
          <button onClick={addToCart} style={{ marginTop: '10px' }}>
            Adicionar ao Carrinho
          </button>
        </>
      )}

      {isOutOfStock && <p style={{ color: 'red' }}>Produto esgotado. Não disponível para compra.</p>}
    </div>
  );
};

export default ProductDetail;
