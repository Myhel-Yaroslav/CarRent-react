import loadingGif from '../assets/loading.gif';

const Loader = () => (
  <div className="loader-container">
    <img src={loadingGif} alt="Завантаження..." className="loader-gif" />
    <p>Обробляємо дані автопарку...</p>
  </div>
);

export default Loader;