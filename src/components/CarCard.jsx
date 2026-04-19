const CarCard = ({ brand, model, price, image, status, days, onToggle, changeDays }) => {
  const total = price * days;

  return (
    <div className={`car-card ${status === 'rented' ? 'is-rented' : ''}`}>
      {/* Статус авто */}
      <div className="status-badge">
        {status === 'available' ? '● Доступна' : '○ В оренді'}
      </div>
      
      {}
      <img src={image} alt={brand} className="car-image" />
      <h3>{brand} {model}</h3>
      <p className="car-price">Ціна: {price} грн/день</p>
      
      {}
      {status === 'available' ? (
        <div className="counter">
          <button onClick={() => changeDays(-1)}>-</button>
          <span>{days} дн.</span>
          <button onClick={() => changeDays(1)}>+</button>
        </div>
      ) : (
        <div className="rented-placeholder">
          Період: {days} дн.
        </div>
      )}

      <p className="total-price">Разом: <strong>{total} грн</strong></p>

      {}
      <button 
        className={`buy-btn ${status === 'rented' ? 'btn-secondary' : 'btn-primary'}`} 
        onClick={onToggle}
      >
        {status === 'available' ? 'Орендувати' : 'Повернути'}
      </button>
    </div>
  );
};

export default CarCard;