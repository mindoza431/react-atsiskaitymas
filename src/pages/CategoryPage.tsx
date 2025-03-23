import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductCard } from '../components';
import { useProducts, useCategories } from '../contexts';
import '../styles/CategoryPage.css';
import { Category } from '../types';
import { Container, Alert, Button } from 'react-bootstrap';

export const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state: productsState, fetchProductsByCategory, connectionError: productsConnectionError, retryFetch: retryProductsFetch } = useProducts();
  const { state: categoriesState, fetchCategoryById, connectionError: categoriesConnectionError, retryFetch: retryCategoriesFetch } = useCategories();
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategory = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const categoryId = parseInt(id);
        let foundCategory = categoriesState.categories.find(c => c.id === categoryId);

        if (!foundCategory) {
          foundCategory = await fetchCategoryById(categoryId);
        }

        if (foundCategory) {
          setCategory(foundCategory);
          fetchProductsByCategory(categoryId);
        } else {
          setError('Kategorija nerasta');
        }
      } catch (err) {
        setError('Klaida gaunant kategoriją');
        console.error('Error loading category:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategory();
  }, [id, fetchCategoryById, fetchProductsByCategory, categoriesState.categories]);

  if (isLoading || productsState.isLoading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Kraunama...</span>
        </div>
      </div>
    );
  }

  if (categoriesConnectionError || productsConnectionError) {
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
              onClick={() => categoriesConnectionError ? retryCategoriesFetch() : retryProductsFetch()}
              variant="outline-danger"
            >
              Bandyti dar kartą
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (error || !category) {
    return (
      <div className="alert alert-danger">
        {error || 'Kategorija nerasta'}. <Link to="/products">Grįžti į produktų sąrašą</Link>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Pagrindinis</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/products">Produktai</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {category.name}
            </li>
          </ol>
        </nav>
        <h1 className="category-title">{category.name}</h1>
      </div>

      {productsState.filteredProducts.length === 0 ? (
        <div className="alert alert-info">
          Šioje kategorijoje nėra produktų.
        </div>
      ) : (
        <div className="row">
          {productsState.filteredProducts.map(product => (
            <div key={product.id} className="col-md-6 col-lg-4 col-xl-3 mb-4">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 