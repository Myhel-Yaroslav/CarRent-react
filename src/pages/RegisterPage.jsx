import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    FirstName: '',
    LastName: '',
    Phone: '',
    PassportNumber: ''
  });
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      alert("Паролі не співпадають!");
      return;
    }

    try {
      const res = await axios.post('/api/register', formData);
      if (res.data.data && res.data.data.access_token) {
        localStorage.setItem('token', res.data.data.access_token);
        login(res.data.data.user);
        navigate('/profile');
      }
    } catch (error) {
      console.error(error);
      alert('Помилка реєстрації. Перевірте введені дані.');
    }
  };

  return (
    <div className="page-content container">
      <div className="contact-card">
        <h2 className="register-title">Реєстрація</h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="register-grid">
            <div className="form-group">
              <label>Email:</label>
              <input 
                type="email" name="email" value={formData.email} onChange={handleChange} 
                placeholder="example@mail.com" required
              />
            </div>
            <div className="form-group">
              <label>Ім'я:</label>
              <input 
                type="text" name="FirstName" value={formData.FirstName} onChange={handleChange} 
                placeholder="Іван" required
              />
            </div>
            <div className="form-group">
              <label>Прізвище:</label>
              <input 
                type="text" name="LastName" value={formData.LastName} onChange={handleChange} 
                placeholder="Шевченко" required
              />
            </div>
            <div className="form-group">
              <label>Телефон:</label>
              <input 
                type="tel" name="Phone" value={formData.Phone} onChange={handleChange} 
                placeholder="+380..." required
              />
            </div>
            <div className="form-group">
              <label>Номер Паспорта:</label>
              <input 
                type="text" name="PassportNumber" value={formData.PassportNumber} onChange={handleChange} 
                placeholder="XX123456" required
              />
            </div>
            <div className="form-group">
              <label>Пароль:</label>
              <input 
                type="password" name="password" value={formData.password} onChange={handleChange} 
                placeholder="Створіть пароль" required
              />
            </div>
            <div className="form-group">
              <label>Підтвердження пароля:</label>
              <input 
                type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} 
                placeholder="Повторіть пароль" required
              />
            </div>
          </div>
          <button type="submit" className="btn-main btn-primary register-btn">Зареєструватися</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
