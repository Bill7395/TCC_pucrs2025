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
        {products.map(p => (
          <div key={p._id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}>
            <h3>{p.title}</h3>
            <p><strong>R$ {p.price.toFixed(2)}</strong></p>
            <Link to={`/product/${p._id}`}>Ver detalhes</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
