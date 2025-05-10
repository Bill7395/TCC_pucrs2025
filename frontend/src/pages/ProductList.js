import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>Produtos disponíveis</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {products.map(product => (
          <div key={product._id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}>
            <h3>{product.title}</h3>
            <p><strong>R$ {product.price ? product.price.toFixed(2) : 'N/A'}</strong></p>
            {product.stock === 0 ? (
              <span style={{ color: 'red' }}>Indisponível</span>
            ) : (
              <span>Estoque: {product.stock}</span>
            )}
            <br /> {/* Adiciona uma quebra de linha para separar o estoque do link */}
            <Link to={`/product/${product._id}`}>Ver detalhes</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;