import { Link } from 'react-router-dom';

const CarCard = ({ id, brand, model, price, image, status, days, onToggle, changeDays }) => {
  const total = price * days;

  return (
    <div className={`car-card ${status === 'rented' ? 'is-rented' : ''}`}>
      <div className="status-badge">{status === 'available' ? '● Доступна' : '○ В оренді'}</div>
      <img src={image} alt={brand} className="car-image" />
      
      {}
      <Link to={`/car/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h3>{brand} {model}</h3>
      </Link>
      
      <p>Ціна: {price} грн/день</p>
      
      {status === 'available' ? (
        <div className="counter">
          <button onClick={() => changeDays(-1)}>-</button>
          <span>{days} дн.</span>
          <button onClick={() => changeDays(1)}>+</button>
        </div>
      ) : (
        <div className="rent-info" style={{margin: '15px 0', color: '#888'}}><i>Зараз в оренді</i></div>
      )}

      <p className="total-price">Разом: <strong>{total} грн</strong></p>
      <button className={`buy-btn ${status === 'rented' ? 'btn-secondary' : 'btn-primary'}`} onClick={onToggle}>
        {status === 'available' ? 'Орендувати' : 'Повернути'}
      </button>
    </div>
  );
};

export default CarCard;