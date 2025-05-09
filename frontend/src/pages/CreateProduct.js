import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState(1);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      await axios.post('/api/products', {
        title,
        price,
        image,
        description,
        stock, // enviar a quantidade
        seller: user.userId,
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      navigate('/');
    } catch (err) {
      console.error('Erro ao criar produto:', err);
      alert('Erro ao criar produto');
    }
  };

  return (
    <div>
      <h2>Cadastrar Produto</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        /><br />
        <input
          type="number"
          placeholder="Preço"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        /><br />
        <input
          type="text"
          placeholder="Imagem (URL)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        /><br />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        /><br />
        <input
          type="number"
          placeholder="Quantidade em estoque"
          value={stock}
          min="1"
          onChange={(e) => setStock(Number(e.target.value))}
          required
        /><br />
        <button type="submit">Criar</button>
      </form>
    </div>
  );
};

export default CreateProduct;
