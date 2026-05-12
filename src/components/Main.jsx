import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CarCard from './CarCard';
import Loader from './Loader';
import PromoBanner from './PromoBanner';

const Main = () => {
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsRes, catRes] = await Promise.all([
          axios.get('/api/cars'),
          axios.get('/api/categories')
        ]);
        
        const fetchedCars = carsRes.data.data || carsRes.data || [];
        const mappedCars = fetchedCars.map(item => {
          const rawStatus = (item.Status || '').toLowerCase();
          const isAvailable = rawStatus.includes('avail') || rawStatus.includes('доступ');
          return {
            id: item.NumberPlate,
            brand: item.details ? item.details.Brand : 'Невідомо',
            model: item.details ? item.details.ModelName : 'Невідома модель',
            price: item.PricePerDay,
            status: isAvailable ? 'available' : 'rented',
            category: item.details ? item.details.Class : 'Інше',
            image: item.image
          };
        });
        
        setCars(mappedCars);
        setCategories(catRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCars = selectedCategory === 'all' 
    ? cars 
    : cars.filter(car => car.category === selectedCategory);

  const toggleStatus = (id) => {
    // В реальності після бронювання статус оновлюється з сервера, тому ми можемо просто оновити стейт або зробити refetch.
    // Зробимо локальне оновлення для миттєвого фідбеку.
    setCars(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'available' ? 'rented' : 'available' } : c));
  };

  if (isLoading) return <Loader />;

  return (
    <main className="main-content">
      <PromoBanner />
      <div className="container">
        
        <div className="filter-panel">
          <label className="filter-label">Клас автомобіля:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">Усі класи</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="stats-panel">
          <div className="stat-box available">
            Доступно: <span className="count">{filteredCars.filter(c => c.status === 'available').length}</span>
          </div>
          <div className="stat-box rented">
            В оренді: <span className="count">{filteredCars.filter(c => c.status === 'rented').length}</span>
          </div>
        </div>

        <div className="car-list">
          {filteredCars.length > 0 ? (
            filteredCars.map(car => (
              <CarCard 
                key={car.id} 
                {...car} 
                onToggle={toggleStatus} 
              />
            ))
          ) : (
            <p className="msg-empty">Автомобілів цієї категорії не знайдено.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Main;
