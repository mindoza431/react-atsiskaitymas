import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/OrderSuccessPage.css';

export const OrderSuccessPage: React.FC = () => {
  return (
    <div className="order-success-page text-center">
      <div className="success-icon">
        <i className="bi bi-check-circle"></i>
      </div>
      <h1>Užsakymas sėkmingai pateiktas!</h1>
      <p className="lead">
        Dėkojame už jūsų užsakymą. Užsakymo informacija buvo išsiųsta jūsų el. paštu.
      </p>
      <div className="order-next-steps">
        <h4>Kas toliau?</h4>
        <p>
          Užsakymo būseną galite sekti savo paskyroje. Jūsų užsakymas bus apdorotas per 1-2 darbo dienas.
        </p>
        <div className="mt-4 action-buttons">
          <Link to="/orders" className="btn btn-primary me-3">
            <i className="bi bi-bag-check me-2"></i>
            Mano užsakymai
          </Link>
          <Link to="/" className="btn btn-outline-primary">
            <i className="bi bi-house me-2"></i>
            Grįžti į pagrindinį
          </Link>
        </div>
      </div>
      <div className="order-details-section mt-5">
        <h4>Kaip su mumis susisiekti?</h4>
        <p>
          Jei turite klausimų apie savo užsakymą, galite susisiekti su mumis el. paštu{' '}
          <a href="mailto:info@eparduotuve.lt">info@eparduotuve.lt</a> arba telefonu{' '}
          <a href="tel:+37060000000">+370 600 00000</a>.
        </p>
      </div>
    </div>
  );
}; 