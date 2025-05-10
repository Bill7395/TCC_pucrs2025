import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [review, setReview] = useState({ rating: '', comment: '' });
  const [orderMsg, setOrderMsg] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    API.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => setError('Produto não encontrado'));
  }, [id]);

  const handleBuy = async () => {
    try {
      if (!user) return navigate('/login');
      await API.post('/orders', { productId: id });
      setOrderMsg('Compra realizada com sucesso!');
    } catch (err) {
      setOrderMsg(err.response?.data?.message || 'Erro ao comprar');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    try {
      await API.post(`/products/${id}/reviews`, review);
      setReview({ rating: '', comment: '' });
      alert('Avaliação enviada!');
      window.location.reload(); // simples recarregamento para atualizar
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao avaliar');
    }
  };

  if (error) return <p>{error}</p>;
  if (!product) return <p>Carregando...</p>;

  return (
    <div>
      <h2>{product.title}</h2>
      {product.image && <img src={product.image} alt={product.title} style={{ maxWidth: '300px' }} />}
      <p><strong>R$ {product.price.toFixed(2)}</strong></p>
      <p>{product.description}</p>
      <p><strong>Categoria:</strong> {product.category}</p>
      <p><strong>Vendedor:</strong> {product.seller?.name}</p>

      <button onClick={handleBuy}>Comprar</button>
      {orderMsg && <p>{orderMsg}</p>}

      <hr />
      <h3>Avaliações ({product.reviews?.length || 0})</h3>
      {product.reviews?.map((r, i) => (
        <div key={i} style={{ borderTop: '1px solid #ccc', padding: '5px 0' }}>
          <strong>Nota:</strong> {r.rating} ⭐<br />
          <strong>Comentário:</strong> {r.comment}
        </div>
      ))}

      <hr />
      <h3>Fazer avaliação</h3>
      <form onSubmit={handleReviewSubmit}>
        <div>
          <label>Nota (1 a 5):</label><br />
          <input
            type="number"
            min="1"
            max="5"
            name="rating"
            value={review.rating}
            onChange={(e) => setReview({ ...review, rating: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Comentário:</label><br />
          <textarea
            name="comment"
            value={review.comment}
            onChange={(e) => setReview({ ...review, comment: e.target.value })}
          />
        </div>
        <button type="submit">Enviar avaliação</button>
      </form>
    </div>
  );
};

export default ProductDetail;
