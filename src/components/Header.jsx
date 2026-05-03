import { Link } from 'react-router-dom';

const Header = () => (
  <header className="header">
    <Link to="/" className="logo">CarRent</Link>
    <nav>
      <ul className="nav-menu">
        <li><Link to="/">Головна</Link></li>
        <li><Link to="/catalog">Каталог</Link></li>
        <li><Link to="/contacts">Контакти</Link></li>
        <li><Link to="#">Про нас</Link></li>
      </ul>
    </nav>
  </header>
);

export default Header;