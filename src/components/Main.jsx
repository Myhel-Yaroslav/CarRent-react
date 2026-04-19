import { useState, useEffect } from 'react';
import CarCard from './CarCard';
import Loader from './Loader';
import PromoBanner from './PromoBanner';

const Main = () => {
  const [isLoading, setIsLoading] = useState(true);

  const initialCars = [
    { id: 1, brand: 'Toyota', model: 'Camry', price: 1500, status: 'available', days: 1, image: 'https://via.placeholder.com/200x120?text=Toyota' },
    { id: 2, brand: 'BMW', model: 'X5', price: 3000, status: 'available', days: 1, image: 'https://via.placeholder.com/200x120?text=BMW' },
    { id: 3, brand: 'Tesla', model: 'Model 3', price: 2500, status: 'available', days: 1, image: 'https://via.placeholder.com/200x120?text=Tesla' },
    { id: 4, brand: 'Audi', model: 'A6', price: 2200, status: 'available', days: 1, image: 'https://via.placeholder.com/200x120?text=Audi' },
  ];

  const [cars, setCars] = useState(() => {
    const saved = localStorage.getItem('car_rent_data');
    return saved ? JSON.parse(saved) : initialCars;
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('car_rent_data', JSON.stringify(cars));
  }, [cars]);

  const toggleStatus = (id) => {
    setCars(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'available' ? 'rented' : 'available' } : c));
  };

  const updateDays = (id, delta) => {
    setCars(prev => prev.map(c => {
      if (c.id === id) {
        const nextDays = c.days + delta;
        return nextDays >= 1 ? { ...c, days: nextDays } : c;
      }
      return c;
    }));
  };

  const availableCount = cars.filter(c => c.status === 'available').length;
  const rentedCount = cars.filter(c => c.status === 'rented').length;

  if (isLoading) return <Loader />;

  return (
    <main className="main-content">
      <PromoBanner />
      <div className="container">
        
        
        <div className="stats-panel">
          <div className="stat-box available">
            Доступно: <span className="count">{availableCount}</span>
          </div>
          <div className="stat-box rented">
            В оренді: <span className="count">{rentedCount}</span>
          </div>
        </div>

        <div className="car-list">
          {cars.map(car => (
            <CarCard 
              key={car.id} 
              {...car} 
              onToggle={() => toggleStatus(car.id)} 
              changeDays={(d) => updateDays(car.id, d)}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Main;