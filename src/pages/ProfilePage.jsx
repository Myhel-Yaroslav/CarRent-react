import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import CarImage from '../components/CarImage';

const ProfilePage = () => {
  const { user, isLoadingAuth, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeReservations, setActiveReservations] = useState([]);
  const [completedReservations, setCompletedReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      axios.get('/api/user/reservations')
        .then(res => {
          if (res.data) {
            setActiveReservations(res.data.active || []);
            setCompletedReservations(res.data.history || []);
          }
        })
        .catch(err => {
          console.error("Error fetching reservations", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user]);

  if (isLoadingAuth) {
    return (
      <div className="page-content container auth-check">
        <h2>Перевірка авторизації...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-content container">
        <h2 className="not-auth-msg">Ви не авторизовані</h2>
        <button className="btn-main btn-primary btn-login" onClick={() => navigate('/login')}>Перейти до входу</button>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="page-content container profile-wrapper">
      <div className="details-card profile-card">
        <h2 className="profile-title">Особистий кабінет</h2>
        <div>
          <p className="profile-info-row"><strong>Ім'я:</strong> <span className="profile-info-val">{user.FirstName} {user.LastName}</span></p>
          <p className="profile-info-row"><strong>Email:</strong> <span className="profile-info-val">{user.email}</span></p>
          <p className="profile-info-row"><strong>Телефон:</strong> <span className="profile-info-val">{user.Phone || 'Не вказано'}</span></p>
          <p className="profile-info-row"><strong>Паспорт:</strong> <span className="profile-info-val">{user.PassportNumber || 'Не вказано'}</span></p>
          <p className="profile-info-row-last"><strong>Роль:</strong> <span className={(user.is_admin === 1 || user.is_admin === true) ? 'profile-role-admin' : 'profile-role-client'}>{(user.is_admin === 1 || user.is_admin === true) ? 'Адміністратор' : 'Клієнт'}</span></p>
          <button className="btn-main btn-secondary btn-logout" onClick={handleLogout}>Вийти з акаунту</button>
        </div>
      </div>

      {isLoading ? (
         <div className="loading-msg">Завантаження даних...</div>
      ) : (
        <>
          <div className="details-card profile-card">
            <h3 className="section-title">Активна оренда</h3>
            {activeReservations.length > 0 ? (
              <div className="active-rent-list">
                {activeReservations.map(order => (
                  <div key={order.ReservationID || order.NumberPlate || order.id} className="active-rent-item">
                    <div className="rent-details-row">
                        <div className="rent-image-box">
                          <CarImage 
                            numberPlate={order.NumberPlate} 
                              alt={order.NumberPlate} />
                                </div>
                      <div className="rent-info-col">
                        <div>
                          <h4 className="rent-car-name">
                            {order.brand || (order.car && order.car.details ? `${order.car.details.Brand} ${order.car.details.ModelName}` : 'Авто')} 
                            <span className="rent-car-plate">{order.NumberPlate}</span>
                          </h4>
                          <p className="rent-dates">Початок: <strong>{order.DateFrom}</strong> - Закінчення оренди: <strong>{order.DateTo}</strong></p>
                          <p className="rent-sum">Сума (до сплати / сплачена): <strong className="rent-sum-val">{order.total_sum || order.PricePerDay || (order.car ? order.car.PricePerDay : '---')} грн</strong></p>
                        </div>
                      </div>
                    </div>
                    <div className="rent-notice">
                      <span>ℹ️</span> 
                      <span>Машина знаходиться в оренді. Для повернення та закриття контракту зверніться до найближчого офісу CarRent для технічного огляду.</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-rent-msg">У вас немає активних оренд на даний момент.</p>
            )}
          </div>

          <div className="details-card profile-card">
            <h3 className="section-title">Історія поїздок</h3>
            {completedReservations.length > 0 ? (
              <div className="history-table-wrapper">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Автомобіль</th>
                      <th>Термін оренди</th>
                      <th>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedReservations.map((order, index) => (
                      <tr key={order.ReservationID || order.NumberPlate || order.id}>
                        <td>
                          <strong className="history-car">
                            {order.brand || (order.car && order.car.details ? `${order.car.details.Brand} ${order.car.details.ModelName}` : 'Авто')}
                          </strong>
                          <span className="history-plate">{order.NumberPlate}</span>
                        </td>
                        <td>{order.DateFrom} — {order.DateTo}</td>
                        <td>
                          <span className={`history-status ${order.Status === 'Completed' || order.status === 'completed' ? 'history-status-completed' : 'history-status-other'}`}>
                            {order.Status || order.status || 'Завершено'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="empty-rent-msg">Історія поїздок порожня.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
