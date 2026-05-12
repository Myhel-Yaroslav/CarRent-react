import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from '../api/axios';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import CarImage from '../components/CarImage';

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const { user } = useAuth();

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setIsLoading(true);
    axios.get(`/api/cars/${id}`)
      .then(res => {
        setCar(res.data);
      })
      .catch(err => {
        console.error("Помилка завантаження авто:", err);
        setCar(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  if (!car) {
    return (
      <div className="container page-content">
        <h2 className="details-not-found">Автомобіль не знайдено...</h2>
        <Link to="/catalog" className="link-back">Повернутися до каталогу</Link>
      </div>
    );
  }

  const brand = car.details ? car.details.Brand : 'Невідомо';
  const model = car.details ? car.details.ModelName : '';
  const carClass = car.details ? car.details.Class : 'Інше';
  
  const rawStatus = (car.Status || '').toLowerCase();
  const isAvailable = rawStatus.includes('avail') || rawStatus.includes('доступ');
  const statusText = isAvailable ? 'Доступний' : 'В оренді';

  const calculateDays = () => {
    if (!dateFrom || !dateTo) return 0;
    const start = new Date(dateFrom);
    const end = new Date(dateTo);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const days = calculateDays();
  const price = parseFloat(car.PricePerDay);
  const total = price * days;

  // Кнопка активна тільки якщо є дати і кількість днів більше 0
  const isButtonActive = isAvailable && !isBooking && days > 0 && dateFrom && dateTo;

  const handleBook = async () => {
    if (!user) {
      alert("Будь ласка, увійдіть в акаунт для бронювання!");
      return;
    }
    if (new Date(dateFrom) < new Date(today)) {
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
      setCar(prev => ({ ...prev, Status: 'rented' }));
    } catch (error) {
      console.error("Помилка бронювання", error);
      alert(error.response?.data?.message || 'Помилка з\'єднання');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="page-content container">
      <div className="details-card details-wrapper">
        
        <div className="details-col-left">
          <div className="details-image-box">
            <CarImage 
              numberPlate={car.NumberPlate}
              alt={`${brand} ${model}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          
          {/* Booking Section */}
          <div className="booking-section">
            <h3 className="booking-title">Оформити оренду</h3>
            
            {isAvailable ? (
              <div className="booking-form">
                <div>
                  <label className="booking-label">З якої дати:</label>
                  <input type="date" className="form-input" min={today} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                </div>
                <div>
                  <label className="booking-label">По яку дату:</label>
                  <input type="date" className="form-input" min={dateFrom || today} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                </div>
                {total > 0 && (
                  <p className="booking-total-price">
                    Разом: <strong>{total.toFixed(2)} грн</strong>
                  </p>
                )}
                <button 
                  onClick={handleBook}
                  disabled={!isButtonActive}
                  className={`btn-submit ${isButtonActive ? 'btn-submit-active' : 'btn-submit-disabled'}`}
                >
                  {isBooking ? 'Бронювання...' : 'Орендувати'}
                </button>
              </div>
            ) : (
              <div className="unavailable-msg">
                <i className="car-unavailable-text">Автомобіль зараз недоступний</i>
              </div>
            )}
          </div>

        </div>

        <div className="details-col-right">
          <h2 className="specs-title">
            Специфікація {brand} {model}
          </h2>
          
          <div className="specs-list">
            <ul className="specs-ul">
              <li><strong>Номерний знак:</strong> {car.NumberPlate}</li>
              <li><strong>Бренд:</strong> {brand}</li>
              <li><strong>Модель:</strong> {model}</li>
              <li><strong>Рік випуску:</strong> {car.Year}</li>
              <li><strong>Клас:</strong> {carClass}</li>
              <li><strong>Стан:</strong> {car.Conditionn}</li>
              <li><strong>Ціна оренди:</strong> <strong className="specs-price">{car.PricePerDay} грн/день</strong></li>
              <li>
                <strong>Поточний статус:</strong> 
                <span className={`badge-status ${isAvailable ? 'badge-available' : 'badge-rented'}`}>
                  {statusText}
                </span>
              </li>
            </ul>
          </div>

          <Link to="/catalog" className="btn-back">
            Назад до списку
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default CarDetails;
