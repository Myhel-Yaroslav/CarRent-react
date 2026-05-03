import { useState } from 'react';

const ContactsPage = () => {
  // Стан для полів форми
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });


  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Логіка валідації
    if (!formData.email.includes('@')) {
      newErrors.email = 'Email має обов’язково містити символ "@"';
    }
    if (formData.message.length < 10) {
      newErrors.message = 'Повідомлення не може бути коротшим за 10 символів';
    }

    setErrors(newErrors);


    if (Object.keys(newErrors).length === 0) {
      alert(`Дякуємо, ${formData.name}! Ваше повідомлення відправлено.`);
      setFormData({ name: '', email: '', message: '' });
    }
  };

  return (
    <div className="page-content container">
      <div className="contact-card">
        <h2 style={{ color: 'black' }}>Зворотний зв'язок</h2>
        <form onSubmit={handleSubmit} className="contact-form">
          
          <div className="form-group">
            <label>Ваше ім'я:</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Введіть ім'я"
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
            />
            {errors.message && <span className="error-text">{errors.message}</span>}
          </div>

          <button type="submit" className="btn-main btn-primary">Відправити</button>
        </form>
      </div>
    </div>
  );
};

export default ContactsPage;