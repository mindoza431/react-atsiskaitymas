import React from 'react';
import '../styles/Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer mt-auto py-5 bg-dark text-white">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <h5>Apie mus</h5>
            <p>
              E-Shop yra moderniausias elektronikos prekių internetinė parduotuvė Lietuvoje. 
              Mes siūlome platų asortimentą ir konkurencingas kainas.
            </p>
          </div>
          <div className="col-md-4 mb-4 mb-md-0">
            <h5>Kontaktai</h5>
            <address>
              <p>
                <i className="bi bi-geo-alt me-2"></i>
                Vilniaus g. 123, Vilnius
              </p>
              <p>
                <i className="bi bi-telephone me-2"></i>
                +370 600 00000
              </p>
              <p>
                <i className="bi bi-envelope me-2"></i>
                info@eshop.lt
              </p>
            </address>
          </div>
          <div className="col-md-4">
            <h5>Mūsų lokacija</h5>
            <div className="map-container">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2306.2995081927384!2d25.279138700000003!3d54.687155999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dd9417621fb72d%3A0x9f881e6eb7ad7bd9!2sVilniaus%20g.%2C%20Vilnius%2001402!5e0!3m2!1sen!2slt!4v1648132442183!5m2!1sen!2slt" 
                width="100%" 
                height="200" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
                title="E-Shop Lokacija"
              ></iframe>
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12">
            <hr className="bg-light" />
            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-0">© 2025 E-Shop. Visos teisės saugomos.</p>
              <div className="social-links">
                <a href="#" className="social-link">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="bi bi-twitter"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}; 