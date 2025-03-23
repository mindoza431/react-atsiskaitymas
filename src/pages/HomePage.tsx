import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components';
import { useProducts, useCategories } from '../contexts';
import '../styles/HomePage.css';
import { Container, Alert, Button } from 'react-bootstrap';

export const HomePage: React.FC = () => {
  const { state: productsState, fetchProducts, connectionError, retryFetch } = useProducts();
  const { state: categoriesState } = useCategories();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const featuredProducts = productsState.products
    .filter(product => product.discount > 0)
    .slice(0, 4);

  if (connectionError) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Tinklo klaida!</Alert.Heading>
          <p>
            Nepavyko prisijungti prie serverio. Patikrinkite, ar JSON serveris veikia adresu http://localhost:3003.
          </p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button 
              onClick={() => retryFetch()}
              variant="outline-danger"
            >
              Bandyti dar kartą
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content text-center">
          <h1>Sveiki atvykę į E-Shop</h1>
          <p className="lead">Didžiausias elektronikos prekių pasirinkimas internetu</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Peržiūrėti prekes
          </Link>
        </div>
      </section>

      <section className="categories-section my-5">
        <h2 className="section-title">Kategorijos</h2>
        <div className="row">
          {categoriesState.categories.map(category => (
            <div key={category.id} className="col-6 col-md-4 col-lg-2 mb-4">
              <Link 
                to={`/category/${category.id}`} 
                className="category-card text-decoration-none"
              >
                <div className="card h-100 text-center">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="card-img-top category-image" 
                  />
                  <div className="card-body">
                    <h5 className="card-title">{category.name}</h5>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="featured-section my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title">Akcinės prekės</h2>
          <Link to="/products" className="btn btn-outline-primary">
            Visos prekės
          </Link>
        </div>
        <div className="row">
          {featuredProducts.map(product => (
            <div key={product.id} className="col-md-6 col-lg-3 mb-4">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      <section className="info-section my-5">
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card info-card">
              <div className="card-body text-center">
                <i className="bi bi-truck info-icon"></i>
                <h5 className="card-title">Greitas pristatymas</h5>
                <p className="card-text">Pristatymas per 1-3 darbo dienas visoje Lietuvoje</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card info-card">
              <div className="card-body text-center">
                <i className="bi bi-shield-check info-icon"></i>
                <h5 className="card-title">Kokybės garantija</h5>
                <p className="card-text">Visos prekės turi 24 mėnesių garantiją</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card info-card">
              <div className="card-body text-center">
                <i className="bi bi-credit-card info-icon"></i>
                <h5 className="card-title">Saugus atsiskaitymas</h5>
                <p className="card-text">Patikimi ir saugūs mokėjimo būdai</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}; 