import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Alert, Button } from 'react-bootstrap';
import { useProducts } from '../contexts/ProductsContext';
import { useCategories } from '../contexts/CategoriesContext';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/ProductsPage.css';

export const ProductsPage: React.FC = () => {
  const { state: productsState, filterBySearch, filterByCategory, sortProducts, connectionError, retryFetch } = useProducts();
  const { state: categoriesState } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    filterBySearch(searchTerm);
  }, [searchTerm, filterBySearch]);
  
  useEffect(() => {
    if (sortOption) {
      sortProducts(sortOption as 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc');
    }
  }, [sortOption, sortProducts]);

  const handleCategoryClick = (categoryId: number) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null);
      filterByCategory(0); 
    } else {
      setActiveCategory(categoryId);
      filterByCategory(categoryId);
    }
  };

  const handleProductView = (productId: number) => {
    navigate(`/product/${productId}`);
  };
  
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
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1>Visi produktai</h1>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Ieškoti produktų..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Rūšiuoti pagal...</option>
              <option value="price_asc">Kaina: nuo žemiausios</option>
              <option value="price_desc">Kaina: nuo aukščiausios</option>
              <option value="name_asc">Pavadinimas: A-Z</option>
              <option value="name_desc">Pavadinimas: Z-A</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          {categoriesState.categories && (
            <div className="card mb-4">
              <div className="card-header">Kategorijos</div>
              <div className="list-group list-group-flush">
                <button
                  className={`list-group-item list-group-item-action ${activeCategory === null ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(0)}
                >
                  Visos kategorijos
                </button>
                {categoriesState.categories.map(category => (
                  <button
                    key={category.id}
                    className={`list-group-item list-group-item-action ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Col>
        <Col md={9}>
          <div className="row">
            {productsState.filteredProducts && productsState.filteredProducts.map(product => (
              <div key={product.id} className="col-md-4 mb-4">
                <div className="card h-100">
                  <img 
                    src={product.image} 
                    className="card-img-top" 
                    alt={product.name}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleProductView(product.id)}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.price.toFixed(2)} €</p>
                    <Link to={`/product/${product.id}`} className="btn btn-primary">Peržiūrėti</Link>
                  </div>
                </div>
              </div>
            ))}
            {productsState.isLoading && (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Kraunama...</span>
                </div>
              </div>
            )}
            {!productsState.isLoading && productsState.filteredProducts.length === 0 && (
              <div className="alert alert-info">
                Produktų pagal pasirinktus filtrus nerasta.
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}; 