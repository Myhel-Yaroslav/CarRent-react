import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CarImage from './CarImage';

const CarCard = ({ id, brand, model, price, status, onToggle }) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const { user } = useAuth();

  const calculateDays = () => {
    if (!dateFrom || !dateTo) return 0;
    const start = new Date(dateFrom);
    const end = new Date(dateTo);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const days = calculateDays();
  const total = price * days;

  const handleBook = async () => {
    if (!user) {
      alert("Будь ласка, увійдіть в акаунт для бронювання!");
      return;
    }
    if (new Date(dateFrom) < new Date(new Date().toISOString().split('T')[0])) {
      alert("Неможливо забронювати на минулу дату.");
      return;
    }
    if (days <= 0) {
      alert("Будь ласка, оберіть коректні дати оренди (мінімально 1 день).");
      return;
    }

    setIsBooking(true);
    try {
      await axios.post('/api/booking', {
        NumberPlate: id,
        DateFrom: dateFrom,
        DateTo: dateTo
      });
      alert('Автомобіль успішно заброньовано!');
      if (onToggle) onToggle(id);
    } catch (error) {
      console.error("Помилка бронювання", error);
      alert(error.response?.data?.message || 'Помилка з\'єднання');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className={`car-card ${status !== 'available' ? 'is-rented' : ''}`}>
      <div className={`status-badge ${status === 'available' ? 'status-green' : 'status-red'}`}>
        {status === 'available' ? '● ДОСТУПНА' : '○ ОРЕНДОВАНО'}
      </div>
      
      <div className="car-image-wrapper">
        <CarImage 
          numberPlate={id}
          alt={`${brand} ${model}`}
          className="car-image"
        />
      </div>
      
      <Link to={`/car/${id}`} className="car-title-link">
        <h3 className="car-title">{brand} {model}</h3>
      </Link>
      
      <p className="car-price">Ціна: <strong>{price} грн/день</strong></p>
      
      {status === 'available' ? (
        <div className="booking-inputs">
          <div className="booking-row">
            <div className="booking-col">
              <label className="booking-label">З якої дати:</label>
              <input type="date" className="form-input" min={new Date().toISOString().split('T')[0]} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="booking-col">
              <label className="booking-label">По яку дату:</label>
              <input type="date" className="form-input" min={dateFrom || new Date().toISOString().split('T')[0]} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>
          <span className="booking-duration">Термін оренди: <strong>{days} дн.</strong></span>
        </div>
      ) : (
        <div className="car-unavailable-box">
          <i className="car-unavailable-text">Автомобіль зараз недоступний</i>
        </div>
      )}

      {status === 'available' && total > 0 && (
        <p className="car-total">
          Разом: <strong className="car-total-value">{total} грн</strong>
        </p>
      )}
      
      <button 
        className={`btn-booking ${status !== 'available' ? 'btn-secondary' : 'btn-primary'}`} 
        onClick={status === 'available' ? handleBook : undefined}
        disabled={status !== 'available' || isBooking}
      >
        {status === 'available' ? (isBooking ? 'Бронювання...' : 'Орендувати') : 'Орендовано'}
      </button>
    </div>
  );
};

export default CarCard;
