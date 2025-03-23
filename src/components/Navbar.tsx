import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth, useCart, useCategories } from '../contexts';

import '../styles/Navbar.css';

export const Navbar: React.FC = () => {
  const { state: authState, logout } = useAuth();
  const { state: categoryState } = useCategories();
  const { getTotalItems } = useCart();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark custom-navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <span className="brand-text">E-Shop</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Pagrindinis
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Kategorijos
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                {categoryState.categories.map(category => (
                  <li key={category.id}>
                    <Link 
                      className="dropdown-item" 
                      to={`/category/${category.id}`}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/products">
                Visos prekės
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav">
            {authState.isAuthenticated ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile">
                    {authState.user?.username}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/orders">
                    Mano užsakymai
                  </NavLink>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={logout}>
                    Atsijungti
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Prisijungti
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    Registruotis
                  </NavLink>
                </li>
              </>
            )}
            <li className="nav-item">
              <NavLink className="nav-link cart-link" to="/cart">
                <i className="bi bi-cart"></i>
                {getTotalItems() > 0 && (
                  <span className="cart-badge">{getTotalItems()}</span>
                )}
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}; 