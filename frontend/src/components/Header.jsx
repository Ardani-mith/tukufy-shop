import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, Phone, Shield, Headphones } from 'lucide-react';

export default function Header({ cartCount, favoritesCount, onOpenCart, onOpenFavorites }) {
  const location = useLocation();

  return (
    <header className="site-header">
      <div className="container header-container">
        {/* Logo */}
        <Link to="/" className="logo-container">
          <div className="logo-icon-wrapper">
            <span className="logo-circle-black"></span>
            <span className="logo-circle-inner"></span>
          </div>
          <span className="logo-text">Tukufy.</span>
        </Link>

        {/* Navigation */}
        <nav className="nav-menu">
          <Link to="/products?category=Headphones" className={`nav-link ${location.search.includes('category=Headphones') ? 'active' : ''}`}>
            Headphones
          </Link>
          <Link to="/products?category=Earbuds" className={`nav-link ${location.search.includes('category=Earbuds') ? 'active' : ''}`}>
            Earbuds
          </Link>
          <Link to="/products?category=Speakers" className={`nav-link ${location.search.includes('category=Speakers') ? 'active' : ''}`}>
            Speakers
          </Link>
          <Link to="/products?category=Accessories" className={`nav-link ${location.search.includes('category=Accessories') ? 'active' : ''}`}>
            Accessories
          </Link>
        </nav>

        {/* Contact and Actions */}
        <div className="header-actions">
          {/* Phone contact */}
          <div className="contact-phone">
            <Phone size={16} />
            <span>+6256 4788 2215</span>
          </div>

          {/* Admin link */}
          <Link 
            to="/admin" 
            className={`admin-panel-link ${location.pathname === '/admin' ? 'active' : ''}`}
            title="Admin CRUD Panel"
          >
            <Shield size={16} />
            <span>Admin</span>
          </Link>

          {/* Favorites */}
          <button className="action-icon-btn" onClick={onOpenFavorites} title="Favorites">
            <Heart size={20} />
            {favoritesCount > 0 && <span className="action-badge bg-red">{favoritesCount}</span>}
          </button>

          {/* Cart */}
          <button className="action-icon-btn" onClick={onOpenCart} title="My Cart">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="action-badge">{cartCount}</span>}
          </button>

          {/* User Signin/Signup */}
          <button className="btn btn-secondary btn-header-login">Log In</button>
          <button className="btn btn-primary btn-header-signup">Sign Up</button>
        </div>
      </div>

      <style>{`
        .site-header {
          height: var(--header-height);
          background-color: var(--color-surface);
          border-bottom: 1px solid var(--color-border);
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        /* Logo styling */
        .logo-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-icon-wrapper {
          position: relative;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-circle-black {
          width: 20px;
          height: 20px;
          background-color: #000;
          border-radius: 50%;
          display: block;
        }

        .logo-circle-inner {
          position: absolute;
          width: 8px;
          height: 8px;
          background-color: #fff;
          border-radius: 50%;
          top: 5px;
          left: 5px;
        }

        .logo-text {
          font-family: var(--font-heading);
          font-size: 22px;
          font-weight: 800;
          color: var(--color-text-primary);
          letter-spacing: -0.03em;
        }

        /* Nav Menu */
        .nav-menu {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-link {
          font-size: 15px;
          font-weight: 500;
          color: var(--color-text-secondary);
          position: relative;
          padding: 8px 0;
        }

        .nav-link:hover, .nav-link.active {
          color: var(--color-text-primary);
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--color-text-primary);
        }

        /* Actions */
        .header-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .contact-phone {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-secondary);
        }

        .admin-panel-link {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-secondary);
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          transition: var(--transition-fast);
        }

        .admin-panel-link:hover, .admin-panel-link.active {
          color: var(--color-text-primary);
          background-color: #f0f0f0;
        }

        .action-icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-text-primary);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          transition: var(--transition-fast);
        }

        .action-icon-btn:hover {
          transform: scale(1.05);
        }

        .action-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background-color: var(--color-accent);
          color: white;
          font-size: 10px;
          font-weight: 700;
          min-width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
        }

        .action-badge.bg-red {
          background-color: var(--color-error);
        }

        .btn-header-login {
          font-size: 14px;
          padding: 8px 18px;
          border-radius: 8px;
          border: 1px solid var(--color-border);
        }

        .btn-header-signup {
          font-size: 14px;
          padding: 8px 18px;
          border-radius: 8px;
        }

        @media (max-width: 992px) {
          .contact-phone, .btn-header-login, .btn-header-signup {
            display: none;
          }
          .nav-menu {
            gap: 16px;
          }
        }

        @media (max-width: 768px) {
          .nav-menu {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
