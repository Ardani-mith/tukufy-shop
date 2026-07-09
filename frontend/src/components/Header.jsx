import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Shield, Plus, LogOut, Package, ChevronDown } from 'lucide-react';

export default function Header({
  cartCount,
  favoritesCount,
  onOpenCart,
  onOpenFavorites,
  isLoggedIn,
  user,
  onLogout,
  showToast
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hide header on auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  if (isAuthPage) return null;

  const handleCartClick = () => {
    onOpenCart();
  };

  const handleFavoritesClick = () => {
    onOpenFavorites();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

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

        {/* Navigation — General */}
        <nav className="nav-menu">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/products"
            className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}
          >
            Explore Products
          </Link>
        </nav>

        {/* Contact and Actions */}
        <div className="header-actions">
          {/* Favorites */}
          <button className="action-icon-btn" onClick={handleFavoritesClick} title="Favorites">
            <Heart size={20} />
            {favoritesCount > 0 && <span className="action-badge bg-red">{favoritesCount}</span>}
          </button>

          {/* Cart */}
          <button className="action-icon-btn" onClick={handleCartClick} title="My Cart">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="action-badge">{cartCount}</span>}
          </button>

          {/* Auth: Dropdown for Logged In or Login/Signup Buttons */}
          {isLoggedIn ? (
            <div className="user-dropdown-container" ref={dropdownRef}>
              <button className="user-trigger-btn" onClick={toggleDropdown}>
                <span className="user-avatar">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
                <span className="user-name">{user?.name}</span>
                <ChevronDown size={14} className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="user-dropdown-menu">
                  <div className="dropdown-info">
                    <p className="dropdown-user-name">{user?.name}</p>
                    <p className="dropdown-user-role">{user?.role || 'Customer'}</p>
                  </div>
                  <hr className="dropdown-divider" />
                  
                  <Link to="/admin" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                    <Plus size={16} />
                    <span>Add Product</span>
                  </Link>
                  
                  <hr className="dropdown-divider" />
                  <button 
                    className="dropdown-item text-danger" 
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onLogout();
                    }}
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-header-login">
                Log In
              </Link>
              <Link to="/signup" className="btn btn-primary btn-header-signup">
                Sign Up
              </Link>
            </>
          )}
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

        /* New Dropdown Menu Styling */
        .user-dropdown-container {
          position: relative;
        }

        .user-trigger-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: var(--radius-md);
          transition: var(--transition-fast);
        }

        .user-trigger-btn:hover {
          background-color: #f5f5f5;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #000;
          color: white;
          font-size: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-primary);
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dropdown-arrow {
          color: var(--color-text-secondary);
          transition: transform 0.2s ease;
        }

        .dropdown-arrow.open {
          transform: rotate(180deg);
        }

        .user-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background-color: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          min-width: 180px;
          padding: 6px 0;
          animation: fadeIn 0.15s ease;
        }

        .dropdown-info {
          padding: 10px 16px 6px 16px;
        }

        .dropdown-user-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text-primary);
          margin: 0;
        }

        .dropdown-user-role {
          font-size: 12px;
          color: var(--color-text-secondary);
          margin: 2px 0 0 0;
          text-transform: capitalize;
        }

        .dropdown-divider {
          border: 0;
          border-top: 1px solid var(--color-border);
          margin: 6px 0;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-primary);
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: background-color 0.15s ease;
        }

        .dropdown-item:hover {
          background-color: #f5f5f5;
        }

        .dropdown-item.text-danger {
          color: var(--color-error, #dc2626);
        }
        
        .dropdown-item.text-danger:hover {
          background-color: #fef2f2;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
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
          .btn-header-login, .btn-header-signup {
            display: none;
          }
          .user-name, .dropdown-arrow {
            display: none;
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