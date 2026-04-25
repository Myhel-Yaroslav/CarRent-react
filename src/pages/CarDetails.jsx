import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem('car_rent_data');
    if (savedData) {
      const cars = JSON.parse(savedData);
      const foundCar = cars.find(c => c.id === parseInt(id));
      setCar(foundCar);
    }
  }, [id]);

  if (!car) {
    return (
      <div className="container page-content">
        <h2 style={{ color: 'black' }}>Автомобіль не знайдено...</h2>
        <Link to="/catalog" style={{ color: 'black' }}>Повернутися до каталогу</Link>
      </div>
    );
  }

  return (
    <div className="page-content container">
      <div className="details-card">
        {}
        <h2 style={{ color: 'black' }}>
          Специфікація автомобіля {car.brand} {car.model}
        </h2>
        
        <div className="details-info">
          <ul style={{ textAlign: 'left', display: 'inline-block', marginTop: '20px', color: 'black' }}>
            <li><strong>Бренд:</strong> {car.brand}</li>
            <li><strong>Модель:</strong> {car.model}</li>
            <li><strong>Ціна оренди:</strong> {car.price} грн/день</li>
            <li><strong>Поточний статус:</strong> {car.status === 'available' ? 'Доступний' : 'В оренді'}</li>
            <li><strong>Обраний період:</strong> {car.days} дн.</li>
          </ul>
        </div>

        <Link to="/catalog" className="btn-main btn-secondary" style={{ textDecoration: 'none' }}>
          Назад до списку
        </Link>
      </div>
    </div>
  );
};

export default CarDetails;