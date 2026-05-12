import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, isLoadingAuth, logout } = useAuth();

  return (
    <header className="header">
      <Link to="/" className="logo">CarRent</Link>
      <nav>
        <ul className="nav-menu">
          <li><Link to="/">Головна</Link></li>
          <li><Link to="/catalog">Каталог</Link></li>
          <li><Link to="/contacts">Контакти</Link></li>
          {!isLoadingAuth && (
            user ? (
              <>
                {(user.is_admin === 1 || user.is_admin === true) && (
                  <li>
                    <a 
                      href="http://localhost:8000/admin" 
                      className="nav-link-admin"
                    >
                      <span></span> Адмін-панель
                    </a>
                  </li>
                )}
                {user.reservations?.some(r => r.status === 'active') && (
                  <li className="nav-item-active-rent" title="У вас є активна оренда">
                    <span className="icon-key">🔑</span>
                  </li>
                )}
                <li><Link to="/profile" className="nav-link-profile">{user.FirstName} {user.LastName}</Link></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>Вийти</a></li>
              </>
            ) : (
              <>
                <li><Link to="/login">Увійти</Link></li>
                <li><Link to="/register">Реєстрація</Link></li>
              </>
            )
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
