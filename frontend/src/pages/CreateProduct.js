import React, { useState } from 'react';
import API from '../api/api';

const CreateProduct = () => {
  const [productData, setProductData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    image: '',
  });

  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const res = await API.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload OK, URL:', res.data.imageUrl);
      setProductData({ ...productData, image: res.data.imageUrl });
    } catch (err) {
      console.error('Erro no upload:', err.response?.data || err.message);
      setError('Erro ao carregar imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productData.image) {
      return setError('Envie uma imagem do produto antes de continuar.');
    }

    try {
      await API.post('/products', productData);
      alert('Produto criado com sucesso!');
      setProductData({
        title: '',
        price: '',
        description: '',
        category: '',
        image: '',
      });
      setError('');
    } catch (err) {
      console.error('Erro ao criar produto:', err.response?.data || err.message);
      setError('Erro ao criar produto');
    }
  };

  return (
    <div>
      <h2>Cadastrar Produto</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Nome do Produto</label>
        <input
          type="text"
          name="title"
          value={productData.title}
          onChange={handleChange}
          required
        />

        <label>Preço</label>
        <input
          type="number"
          name="price"
          value={productData.price}
          onChange={handleChange}
          required
        />

        <label>Descrição</label>
        <textarea
          name="description"
          value={productData.description}
          onChange={handleChange}
          required
        />

        <label>Categoria</label>
        <input
          type="text"
          name="category"
          value={productData.category}
          onChange={handleChange}
        />

        <label>Imagem do Produto</label>
        <input type="file" name="image" onChange={handleImageUpload} />
        {uploading && <p>Carregando imagem...</p>}
        {productData.image && (
          <img
            src={productData.image}
            alt="Preview"
            style={{ width: '150px', marginTop: '10px' }}
          />
        )}

        <br />
        <button type="submit">Criar Produto</button>
      </form>
    </div>
  );
};

export default CreateProduct;
