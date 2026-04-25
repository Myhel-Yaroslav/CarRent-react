import { useParams, Link } from 'react-router-dom';

const CarDetails = () => {
  const { id } = useParams();

  return (
    <div className="page-content details-page">
      <h2>Детальна інформація про автомобіль</h2>
      <div className="details-box">
        <p>Ви переглядаєте автомобіль з **ID: {id}**</p>
        <p>Тут буде повний опис характеристик, двигуна та умов страхування.</p>
        <Link to="/catalog" className="btn-main btn-grey">Назад до каталогу</Link>
      </div>
    </div>
  );
};
export default CarDetails;