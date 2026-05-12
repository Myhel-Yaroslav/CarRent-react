import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/login', { email, password });
      if (res.data && res.data.access_token) {
        localStorage.setItem('token', res.data.access_token);
        login(res.data.user);
        navigate('/profile');
      }
    } catch (error) {
      console.error(error);
      alert('Невірні дані для входу');
    }
  };

  return (
    <div className="page-content container">
      <div className="contact-card">
        <h2 style={{ color: 'black' }}>Увійти</h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="example@mail.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Пароль:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Введіть пароль"
              required
            />
          </div>
          <button type="submit" className="btn-main btn-primary">Увійти</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
