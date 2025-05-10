import React, { useState } from 'react';
import axios from 'axios';

const CreateProduct = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage('Por favor, envie apenas arquivos de imagem.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'tcc2025'); // Seu preset
    setUploading(true);

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/doojyevce/image/upload', // Seu cloud name
        formData
      );
      setImage(res.data.secure_url);
      setUploading(false);
      setMessage('Imagem enviada com sucesso!');
    } catch (err) {
      console.error('Erro detalhado:', err.response?.data || err.message);
      setMessage('Falha no upload da imagem.');
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/products', {
        title,
        description,
        price,
        image,
        category,
        stock,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Produto criado com sucesso!');
      // Opcional: resetar o formulário
      setTitle('');
      setDescription('');
      setPrice('');
      setImage('');
      setCategory('');
      setStock('');
    } catch (err) {
      console.error('Erro ao criar produto:', err.response?.data || err.message);
      setMessage('Erro ao criar produto.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input type="text" placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="number" placeholder="Preço" value={price} onChange={(e) => setPrice(e.target.value)} required />

      {/* Upload de Imagem */}
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {uploading && <p>Enviando imagem...</p>}
      {image && <p>Imagem enviada com sucesso!</p>}

      <input type="text" placeholder="Categoria" value={category} onChange={(e) => setCategory(e.target.value)} />
      <input type="number" placeholder="Estoque" value={stock} onChange={(e) => setStock(e.target.value)} required />

      <button type="submit" disabled={uploading}>Criar Produto</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default CreateProduct;
