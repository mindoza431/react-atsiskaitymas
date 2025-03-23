import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts';
import '../styles/AuthPages.css';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Slaptažodžiai nesutampa.');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Slaptažodis turi būti bent 6 simbolių ilgio.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/login', { 
        state: { 
          message: 'Registracija sėkminga. Dabar galite prisijungti.', 
          type: 'success' 
        } 
      });
    } catch {
      setError('Klaida registruojantis. Toks el. paštas jau egzistuoja arba įvyko serverio klaida.');
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-container">
          <h1 className="text-center mb-4">Registracija</h1>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Vardas</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">El. paštas</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Slaptažodis</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
              <small className="form-text text-muted">
                Slaptažodis turi būti bent 6 simbolių ilgio.
              </small>
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label">Pakartoti slaptažodį</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Registruojama...
                  </>
                ) : (
                  'Registruotis'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-4 text-center auth-links">
            <p>
              Jau turite paskyrą?{' '}
              <Link to="/login" className="text-decoration-none">
                Prisijungti
              </Link>
            </p>
            <p>
              <Link to="/" className="text-decoration-none">
                <i className="bi bi-arrow-left me-1"></i> Grįžti į pagrindinį
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 