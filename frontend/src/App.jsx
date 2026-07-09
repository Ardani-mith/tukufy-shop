import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ShoppingCart, Heart, Trash2, X, Plus, Minus, CheckCircle, Info } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Admin from './pages/Admin';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

const AUTH_KEY = 'tukufy_user';

export default function App() {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [user, setUser] = useState(null);
  const [redirectTo, setRedirectTo] = useState(null);

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(AUTH_KEY);
      }
    }
  }, []);

  const isLoggedIn = user !== null;

  const handleLogin = (userData) => {
    setUser(userData);
    setRedirectTo(null);
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
    setCart([]);
    setFavorites([]);
    showToast('You have been logged out.', 'info');
  };

  // Toast System
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  // Add to Cart Logic
  const handleAddToCart = (product, quantity = 1) => {
    if (!isLoggedIn) {
      setRedirectTo('/login');
      showToast('Please log in to add items to your cart.', 'info');
      return;
    }
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product._id === product._id);
      if (existingItem) {
        const newQty = existingItem.quantity + quantity;
        if (newQty > product.stock) {
          showToast(`Cannot add more items. Only ${product.stock} units in stock!`, 'error');
          return prevCart;
        }
        showToast(`Updated "${product.name}" quantity to ${newQty}!`);
        return prevCart.map((item) =>
          item.product._id === product._id ? { ...item, quantity: newQty } : item
        );
      } else {
        if (quantity > product.stock) {
          showToast(`Cannot add. Only ${product.stock} units in stock!`, 'error');
          return prevCart;
        }
        showToast(`Added "${product.name}" to cart!`);
        return [...prevCart, { product, quantity }];
      }
    });
  };

  // Update Cart Item Quantity
  const handleUpdateCartQty = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product._id === productId) {
          if (newQty > item.product.stock) {
            showToast(`Only ${item.product.stock} units in stock!`, 'error');
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  // Remove from Cart
  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => {
      const removedItem = prevCart.find((item) => item.product._id === productId);
      if (removedItem) {
        showToast(`Removed "${removedItem.product.name}" from cart.`, 'info');
      }
      return prevCart.filter((item) => item.product._id !== productId);
    });
  };

  // Toggle Favorite
  const toggleFavorite = (product) => {
    setFavorites((prevFavs) => {
      const isFav = prevFavs.some((item) => item._id === product._id);
      if (isFav) {
        showToast(`Removed "${product.name}" from Saved.`, 'info');
        return prevFavs.filter((item) => item._id !== product._id);
      } else {
        showToast(`Saved "${product.name}" to Favorites!`);
        return [...prevFavs, product];
      }
    });
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const estimatedTax = cartSubtotal * 0.08;
  const cartTotal = cartSubtotal + estimatedTax;

  return (
    <BrowserRouter>
      {redirectTo && (
        <Navigate to={redirectTo} state={{ from: window.location.pathname }} replace />
      )}
      <div className="app-wrapper">
        <Header
          cartCount={cartItemCount}
          favoritesCount={favorites.length}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenFavorites={() => setIsFavoritesOpen(true)}
          isLoggedIn={isLoggedIn}
          user={user}
          onLogout={handleLogout}
          showToast={showToast}
        />

        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  onAddToCart={handleAddToCart} 
                  toggleFavorite={toggleFavorite} 
                  favorites={favorites} 
                />
              } 
            />
            <Route 
              path="/products" 
              element={
                <ProductList 
                  onAddToCart={handleAddToCart} 
                  toggleFavorite={toggleFavorite} 
                  favorites={favorites} 
                />
              } 
            />
            <Route 
              path="/products/:id" 
              element={
                <ProductDetail 
                  onAddToCart={handleAddToCart} 
                  toggleFavorite={toggleFavorite} 
                  favorites={favorites} 
                />
              } 
            />
            <Route
              path="/admin"
              element={<Admin showToast={showToast} />}
            />
            <Route
              path="/login"
              element={<Login onLogin={handleLogin} showToast={showToast} />}
            />
            <Route
              path="/signup"
              element={<SignUp onSignUp={handleLogin} showToast={showToast} />}
            />
          </Routes>
        </main>

        <Footer />

        {/* TOAST SYSTEM POPUPS */}
        <div className="toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`toast ${toast.type}`}>
              {toast.type === 'error' ? (
                <span className="toast-icon text-red">●</span>
              ) : toast.type === 'info' ? (
                <span className="toast-icon text-blue">ℹ</span>
              ) : (
                <span className="toast-icon text-green">✔</span>
              )}
              <span className="toast-text">{toast.message}</span>
            </div>
          ))}
        </div>

        {/* ================= CART DRAWER OVERLAY ================= */}
        {isCartOpen && (
          <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}>
            <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
              <div className="drawer-header">
                <h2>My Cart</h2>
                <button className="close-btn" onClick={() => setIsCartOpen(false)}>
                  <X size={22} />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="drawer-empty-state">
                  <ShoppingCart size={48} className="empty-cart-icon" />
                  <h3>Your cart is empty</h3>
                  <p>Browse our collection to add premium gear.</p>
                  <button className="btn btn-primary" onClick={() => { setIsCartOpen(false); }}>
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="drawer-body">
                  {/* Cart Line Items */}
                  <div className="cart-items-list">
                    {cart.map(({ product: item, quantity }) => (
                      <div key={item._id} className="cart-item-card">
                        <div className="cart-item-img-wrapper">
                          <img src={item.image} alt={item.name} className="cart-item-img" />
                        </div>
                        
                        <div className="cart-item-details">
                          <div className="cart-item-title-row">
                            <h3>{item.name}</h3>
                            <button 
                              className="cart-item-delete-btn" 
                              onClick={() => handleRemoveFromCart(item._id)}
                              title="Delete Item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="cart-item-category">{item.category}</p>
                          
                          {item.stock <= 3 && (
                            <div className="cart-badge-stock-warning">
                              Only {item.stock} left in stock
                            </div>
                          )}

                          <div className="cart-item-bottom-row">
                            <span className="cart-item-price">${item.price.toFixed(2)}</span>
                            
                            {/* Qty count selector */}
                            <div className="quantity-selector cart-qty-selector">
                              <button 
                                onClick={() => handleUpdateCartQty(item._id, quantity - 1)}
                                className="quantity-btn"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="quantity-value" style={{ fontSize: '13px' }}>{quantity}</span>
                              <button 
                                onClick={() => handleUpdateCartQty(item._id, quantity + 1)}
                                className="quantity-btn"
                                disabled={quantity >= item.stock}
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary Section - matches the mockup */}
                  <div className="order-summary-box">
                    <h3>Order Summary</h3>
                    
                    <div className="promo-wrapper">
                      <div className="promo-input-row">
                        <input type="text" placeholder="Have a promo code?" className="form-control promo-input" readOnly />
                        <span className="promo-arrow">▼</span>
                      </div>
                    </div>

                    <div className="summary-row">
                      <span>Subtotal ({cartItemCount} items)</span>
                      <span className="summary-val">${cartSubtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span className="summary-val text-green">Free</span>
                    </div>

                    <div className="summary-row">
                      <span>Estimated tax</span>
                      <span className="summary-val">${estimatedTax.toFixed(2)}</span>
                    </div>

                    <div className="summary-total-row">
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>

                    <button 
                      className="btn btn-primary checkout-btn" 
                      onClick={() => {
                        showToast("Checkout simulation completed! Order placed.");
                        setCart([]);
                        setIsCartOpen(false);
                      }}
                    >
                      Continue to checkout
                    </button>
                    <button className="btn btn-secondary continue-shopping-summary-btn" onClick={() => setIsCartOpen(false)}>
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= FAVORITES DRAWER OVERLAY ================= */}
        {isFavoritesOpen && (
          <div className="drawer-overlay" onClick={() => setIsFavoritesOpen(false)}>
            <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
              <div className="drawer-header">
                <h2>Saved Items</h2>
                <button className="close-btn" onClick={() => setIsFavoritesOpen(false)}>
                  <X size={22} />
                </button>
              </div>

              {favorites.length === 0 ? (
                <div className="drawer-empty-state">
                  <Heart size={48} className="empty-cart-icon" />
                  <h3>No saved items yet</h3>
                  <p>Click the heart icon on any gear to save it here.</p>
                  <button className="btn btn-primary" onClick={() => setIsFavoritesOpen(false)}>
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className="drawer-body">
                  <div className="favorites-list">
                    {favorites.map((item) => (
                      <div key={item._id} className="cart-item-card">
                        <div className="cart-item-img-wrapper">
                          <img src={item.image} alt={item.name} className="cart-item-img" />
                        </div>
                        
                        <div className="cart-item-details">
                          <div className="cart-item-title-row">
                            <Link to={`/products/${item._id}`} onClick={() => setIsFavoritesOpen(false)}>
                              <h3 className="fav-item-title">{item.name}</h3>
                            </Link>
                            <button 
                              className="cart-item-delete-btn" 
                              onClick={() => toggleFavorite(item)}
                              title="Remove"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <p className="cart-item-category">{item.category}</p>
                          
                          <div className="cart-item-bottom-row">
                            <span className="cart-item-price">${item.price.toFixed(2)}</span>
                            <button 
                              className="btn btn-primary btn-sm-add" 
                              onClick={() => {
                                handleAddToCart(item);
                                setIsFavoritesOpen(false);
                                setIsCartOpen(true);
                              }}
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .app-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .main-content {
          flex-grow: 1;
        }

        /* Drawer Overlay & Panel (Common) */
        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
        }

        .drawer-panel {
          background-color: var(--color-surface);
          width: 100%;
          max-width: 480px;
          height: 100%;
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          animation: slideDrawer 0.3s forwards cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideDrawer {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .drawer-header {
          padding: 24px;
          border-bottom: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .drawer-body {
          flex-grow: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .drawer-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 70%;
          text-align: center;
          padding: 24px;
          color: var(--color-text-secondary);
        }

        .empty-cart-icon {
          color: var(--color-text-muted);
          margin-bottom: 16px;
        }

        .drawer-empty-state h3 {
          font-size: 20px;
          margin-bottom: 8px;
        }

        .drawer-empty-state p {
          font-size: 14px;
          color: var(--color-text-muted);
          margin-bottom: 24px;
        }

        /* Cart & Favorites items layout */
        .cart-items-list, .favorites-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .cart-item-card {
          display: flex;
          gap: 16px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 16px;
          background: var(--color-surface);
        }

        .cart-item-img-wrapper {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background-color: #f7f7f7;
          border: 1px solid var(--color-border);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cart-item-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .cart-item-details {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .cart-item-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
        }

        .cart-item-details h3, .fav-item-title {
          font-family: var(--font-heading);
          font-size: 15px;
          font-weight: 600;
          line-height: 1.3;
          margin: 0;
        }

        .cart-item-category {
          font-size: 12px;
          color: var(--color-text-muted);
          margin-top: 2px;
          margin-bottom: 8px;
        }

        .cart-item-delete-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-text-muted);
          transition: var(--transition-fast);
          padding: 2px;
        }

        .cart-item-delete-btn:hover {
          color: var(--color-error);
        }

        .cart-item-bottom-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }

        .cart-item-price {
          font-family: var(--font-heading);
          font-size: 16px;
          font-weight: 700;
        }

        .cart-qty-selector {
          border-radius: var(--radius-sm);
        }

        .cart-qty-selector .quantity-btn {
          width: 28px;
          height: 28px;
        }

        .cart-qty-selector .quantity-value {
          width: 24px;
        }

        .cart-badge-stock-warning {
          background-color: var(--color-error-bg);
          color: var(--color-error);
          font-size: 11px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: var(--radius-sm);
          align-self: flex-start;
          margin-bottom: 8px;
        }

        .btn-sm-add {
          font-size: 12px;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
        }

        /* Order Summary Box */
        .order-summary-box {
          border-top: 1px solid var(--color-border);
          padding-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .order-summary-box h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .promo-wrapper {
          position: relative;
        }

        .promo-input-row {
          position: relative;
          display: flex;
          align-items: center;
        }

        .promo-input {
          cursor: pointer;
          padding: 10px 36px 10px 36px;
          font-size: 13px;
          border-color: var(--color-border);
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238e8e8e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z'%3E%3C/path%3E%3Cline x1='7' y1='7' x2='7.01' y2='7'%3E%3C/line%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: 12px center;
          color: var(--color-text-muted);
        }

        .promo-arrow {
          position: absolute;
          right: 14px;
          font-size: 8px;
          color: var(--color-text-muted);
          pointer-events: none;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: var(--color-text-secondary);
        }

        .summary-val {
          font-weight: 600;
          color: var(--color-text-primary);
        }

        .text-green {
          color: var(--color-success) !important;
          font-weight: 600;
        }

        .summary-total-row {
          display: flex;
          justify-content: space-between;
          font-size: 20px;
          font-family: var(--font-heading);
          font-weight: 700;
          border-top: 1px solid var(--color-border);
          padding-top: 16px;
        }

        .checkout-btn {
          height: 50px;
          border-radius: 8px;
          font-size: 16px;
          margin-top: 8px;
        }

        .continue-shopping-summary-btn {
          height: 50px;
          border-radius: 8px;
          font-size: 16px;
          border: 1px solid var(--color-border);
        }

        /* Toast Popup Colors */
        .toast.error {
          border-left: 4px solid var(--color-error);
        }
        .toast.info {
          border-left: 4px solid #0056b3;
        }
        .toast.success {
          border-left: 4px solid var(--color-success);
        }

        .toast-icon {
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .toast-text {
          font-size: 14px;
          font-weight: 500;
        }
      `}</style>
    </BrowserRouter>
  );
}
