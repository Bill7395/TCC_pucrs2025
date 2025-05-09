import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', isSeller: false });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      alert('Cadastro realizado! Faça login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao registrar');
    }
  };

  return (
    <div>
      <h2>Registrar</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label><br />
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label><br />
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Senha:</label><br />
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <div>
          <label>
            <input type="checkbox" name="isSeller" checked={form.isSeller} onChange={handleChange} />
            Quero vender
          </label>
        </div>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default Register;
