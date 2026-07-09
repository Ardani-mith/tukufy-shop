import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Heart } from 'lucide-react';

export default function Home({ onAddToCart, toggleFavorite, favorites }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5001/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data) => {
        // Just take the first 4 products as featured
        setProducts(data.slice(0, 4));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <span className="hero-tagline">NEW ARRIVALS</span>
            <h1>Apex Pro Wireless Headphones</h1>
            <p>
              Experience sound like never before. With 30 hours of battery life, adaptive active noise cancellation, and handcrafted ergonomic design.
            </p>
            <div className="hero-actions-row">
              <Link to="/products" className="btn btn-primary">
                Shop Collection <ArrowRight size={16} />
              </Link>
              <span className="hero-price-tag">$299.00</span>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80" 
              alt="Apex Pro Wireless Headphones" 
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="categories-section section-padding">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="category-grid">
            <Link to="/products?category=Headphones" className="category-card c-headphones">
              <div className="category-card-overlay"></div>
              <h3>Headphones</h3>
            </Link>
            <Link to="/products?category=Earbuds" className="category-card c-earbuds">
              <div className="category-card-overlay"></div>
              <h3>Earbuds</h3>
            </Link>
            <Link to="/products?category=Speakers" className="category-card c-speakers">
              <div className="category-card-overlay"></div>
              <h3>Speakers</h3>
            </Link>
            <Link to="/products?category=Accessories" className="category-card c-accessories">
              <div className="category-card-overlay"></div>
              <h3>Accessories</h3>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section section-padding">
        <div className="container">
          <div className="section-header-flex">
            <h2 className="section-title">Featured Gear</h2>
            <Link to="/products" className="view-all-link">
              View All Products <ArrowRight size={14} />
            </Link>
          </div>

          {loading && (
            <div className="featured-loading">
              <div className="spinner"></div>
              <p>Loading featured gear...</p>
            </div>
          )}

          {error && (
            <div className="featured-error">
              <p>Failed to connect to backend server. Make sure the Node backend is running!</p>
            </div>
          )}

          {!loading && !error && (
            <div className="grid-products">
              {products.map((product) => {
                const isFavorite = favorites.some((fav) => fav._id === product._id);
                return (
                  <div key={product._id} className="product-card">
                    {/* Favorite Button */}
                    <button 
                      className="btn-icon product-card-save" 
                      onClick={() => toggleFavorite(product)}
                      title={isFavorite ? "Remove from Saved" : "Save Product"}
                    >
                      <Heart 
                        size={18} 
                        fill={isFavorite ? "#000" : "none"} 
                        stroke={isFavorite ? "#000" : "currentColor"} 
                      />
                    </button>

                    <Link to={`/products/${product._id}`} className="product-card-image-wrapper">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="product-card-image" 
                      />
                    </Link>

                    <div className="product-card-content">
                      <span className="product-card-category">{product.category}</span>
                      <Link to={`/products/${product._id}`}>
                        <h3 className="product-card-title">{product.name}</h3>
                      </Link>
                      
                      <div className="product-card-rating">
                        <Star size={14} fill="#000" stroke="#000" />
                        <span>{product.rating.toFixed(1)}</span>
                        <span className="rating-count">({product.reviewsCount} reviews)</span>
                      </div>

                      {product.stock <= 3 && (
                        <div className="badge-stock-warning">
                          <span>Only {product.stock} left in stock</span>
                        </div>
                      )}

                      <div className="product-card-bottom">
                        <span className="product-card-price">${product.price.toFixed(2)}</span>
                        <button 
                          className="btn btn-primary"
                          onClick={() => onAddToCart(product)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .section-title {
          font-size: 32px;
          margin-bottom: 30px;
          letter-spacing: -0.02em;
        }

        .section-header-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .view-all-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          color: var(--color-text-primary);
          border-bottom: 2px solid transparent;
        }

        .view-all-link:hover {
          border-color: var(--color-text-primary);
        }

        .hero-tagline {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--color-text-muted);
          display: block;
          margin-bottom: 12px;
        }

        .hero-actions-row {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .hero-price-tag {
          font-family: var(--font-heading);
          font-size: 24px;
          font-weight: 700;
        }

        /* Categories Section */
        .category-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        @media (max-width: 992px) {
          .category-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 576px) {
          .category-grid {
            grid-template-columns: 1fr;
          }
        }

        .category-card {
          position: relative;
          height: 180px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: flex-end;
          padding: 24px;
          transition: var(--transition-slow);
          border: 1px solid var(--color-border);
        }

        .c-headphones { background-image: url('https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop&q=80'); }
        .c-earbuds { background-image: url('https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80'); }
        .c-speakers { background-image: url('https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&auto=format&fit=crop&q=80'); }
        .c-accessories { background-image: url('https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&auto=format&fit=crop&q=80'); }

        .category-card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%);
          z-index: 1;
          transition: var(--transition-normal);
        }

        .category-card h3 {
          color: white;
          z-index: 2;
          font-size: 20px;
          font-weight: 600;
          transition: var(--transition-normal);
        }

        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .category-card:hover .category-card-overlay {
          background: linear-gradient(180deg, rgba(0,0,0,0) 20%, rgba(0,0,0,0.8) 100%);
        }

        /* Loading / Error */
        .featured-loading, .featured-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 0;
          border: 1px dashed var(--color-border);
          border-radius: var(--radius-lg);
          background: var(--color-surface);
          color: var(--color-text-secondary);
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e0e0e0;
          border-top: 3px solid #000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 12px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .rating-count {
          color: var(--color-text-muted);
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}
