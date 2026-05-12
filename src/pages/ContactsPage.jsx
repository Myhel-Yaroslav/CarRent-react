import { useState } from 'react';
import axios from '../api/axios';

const ContactsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email.includes('@')) {
      newErrors.email = 'Email має обов’язково містити символ "@"';
    }
    if (formData.message.length < 10) {
      newErrors.message = 'Повідомлення не може бути коротшим за 10 символів';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await axios.post('/api/contacts', formData);
        setSuccessMsg(`Дякуємо, ${formData.name}! Ваше повідомлення успішно відправлено.`);
        setFormData({ name: '', email: '', message: '' });
      } catch (error) {
        console.error('Помилка при відправці:', error);
        alert('Виникла помилка. Спробуйте пізніше.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="page-content container">
      <div className="contact-card">
        <h2 style={{ color: 'black' }}>Зворотний зв'язок</h2>
        {successMsg && (
          <div style={{ padding: '12px', background: '#dcfce3', color: '#166534', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
            {successMsg}
          </div>
        )}
        <form onSubmit={handleSubmit} className="contact-form">
          
          <div className="form-group">
            <label>Ваше ім'я:</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Введіть ім'я"
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input 
              type="text" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="example@mail.com"
              required
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Повідомлення:</label>
            <textarea 
              name="message" 
              value={formData.message} 
              onChange={handleChange} 
              placeholder="Ваше повідомлення..."
              required
            />
            {errors.message && <span className="error-text">{errors.message}</span>}
          </div>

          <button 
            type="submit" 
            className="btn-main btn-primary" 
            style={{ padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#fff' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Відправка...' : 'Відправити'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactsPage;
