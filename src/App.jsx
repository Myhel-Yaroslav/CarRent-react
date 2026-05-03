import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import Main from './components/Main'; 
import CarDetails from './pages/CarDetails';
import ContactsPage from './pages/ContactsPage';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {}
        <Route path="/catalog" element={<Main />} /> 
        <Route path="/car/:id" element={<CarDetails />} />
        <Route path="/contacts" element={<ContactsPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;