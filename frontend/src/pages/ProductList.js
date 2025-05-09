import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/products') // Certifique-se que essa rota existe no backend
      .then(res => setProducts(res.data))
      .catch(err => console.error('Erro ao buscar produtos:', err));
  }, []);

  return (
    <div>
      <h2>Produtos Disponíveis</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {products.map(product => (
          <div key={product._id} style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
            <Link to={`/product/${product._id}`}>
              <img src={product.image} alt={product.title} style={{ width: '100%' }} />
              <h3>{product.title}</h3>
            </Link>
            <p>Preço: R$ {product.price.toFixed(2)}</p>
            <p>Estoque: {product.stock > 0 ? product.stock : 'Indisponível'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
