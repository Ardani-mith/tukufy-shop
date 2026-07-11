import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, ArrowLeft, ShieldCheck, Truck, RefreshCw, ShoppingBag, Plus, Minus, AlertCircle } from 'lucide-react';
import { getProduct, getProducts } from '../services/api';

export default function ProductDetail({ onAddToCart, toggleFavorite, favorites }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setActiveTab('description');

    // Fetch product details
    getProduct(id)
      .then((data) => {
        setProduct(data);
        setQuantity(1);

        // Fetch related products in the same category
        return getProducts({ category: data.category });
      })
      .then((data) => {
        // Exclude current product and take up to 4 items
        const filtered = data.filter((item) => item._id !== id).slice(0, 4);
        setRelatedProducts(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleIncrement = () => {
    if (product && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="container detail-loading-container">
        <div className="spinner"></div>
        <p>Fetching product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container detail-error-container">
        <h2>Failed to load product</h2>
        <p>{error || 'The requested product could not be found.'}</p>
        <Link to="/products" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>
    );
  }

  const isFavorite = favorites.some((fav) => fav._id === product._id);

  return (
    <div className="container detail-page section-padding">
      {/* Breadcrumbs / Back button */}
      <div className="detail-breadcrumb">
        <Link to="/products" className="back-link">
          <ArrowLeft size={16} /> Back to Products
        </Link>
        <div className="breadcrumb-paths">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`}>{product.category}</Link>
          <span>/</span>
          <span className="breadcrumb-active">{product.name}</span>
        </div>
      </div>

      {/* Main product display */}
      <div className="detail-grid">
        {/* Image side */}
        <div className="detail-image-section">
          <div className="detail-image-card">
            <button 
              className="btn-icon detail-favorite-btn"
              onClick={() => toggleFavorite(product)}
              title={isFavorite ? "Remove from Saved" : "Save Product"}
            >
              <Heart 
                size={20} 
                fill={isFavorite ? "#000" : "none"} 
                stroke={isFavorite ? "#000" : "currentColor"} 
              />
            </button>
            <img src={product.image} alt={product.name} className="detail-image" />
          </div>
        </div>

        {/* Info side */}
        <div className="detail-info-section">
          <span className="detail-category">{product.category}</span>
          <h1 className="detail-title">{product.name}</h1>
          
          {/* Rating */}
          <div className="detail-rating-row">
            <div className="stars-row">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  fill={i < Math.floor(product.rating) ? "#000" : "none"} 
                  stroke="#000" 
                />
              ))}
            </div>
            <span className="rating-value-bold">{product.rating.toFixed(1)}</span>
            <span className="detail-review-count">({product.reviewsCount} reviews)</span>
          </div>

          <div className="detail-price-tag">${product.price.toFixed(2)}</div>

          {/* Delivery & Stock indicators */}
          <div className="detail-delivery-indicators">
            {product.stock > 3 ? (
              <div className="badge-arrives-green">
                <Truck size={16} />
                <span>Arrives tomorrow (Free Shipping)</span>
              </div>
            ) : (
              <div className="badge-arrives-green">
                <Truck size={16} />
                <span>Arrives in 2-3 days</span>
              </div>
            )}
            <div className="detail-return-badge">
              <RefreshCw size={14} />
              <span>Free 30-day returns</span>
            </div>
          </div>

          {/* Low stock badge */}
          {product.stock <= 3 ? (
            <div className="badge-stock-warning detail-stock-banner">
              <AlertCircle size={16} />
              <span>Only {product.stock} left in stock - order soon.</span>
            </div>
          ) : (
            <div className="detail-in-stock-label">
              <span className="stock-dot"></span> In Stock ({product.stock} units available)
            </div>
          )}

          {/* Quantity and Add to Cart Section */}
          <div className="detail-action-card">
            <div className="quantity-control-wrapper">
              <span className="control-label">Quantity</span>
              <div className="quantity-selector">
                <button 
                  onClick={handleDecrement} 
                  className="quantity-btn"
                  disabled={quantity <= 1}
                >
                  <Minus size={14} />
                </button>
                <span className="quantity-value">{quantity}</span>
                <button 
                  onClick={handleIncrement} 
                  className="quantity-btn"
                  disabled={quantity >= product.stock}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <button 
              className="btn btn-primary add-to-cart-action-btn"
              onClick={() => onAddToCart(product, quantity)}
              disabled={product.stock === 0}
            >
              <ShoppingBag size={18} />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          {/* Tabs for details */}
          <div className="detail-tabs-section">
            <div className="tabs-header">
              <button
                className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Overview
              </button>
              {product.specifications && product.specifications.length > 0 && (
                <button
                  className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('specs')}
                >
                  Specifications
                </button>
              )}
            </div>

            <div className="tab-body">
              {activeTab === 'description' ? (
                <p className="tab-description-text">{product.description}</p>
              ) : (
                <table className="specs-table">
                  <tbody>
                    {product.specifications && product.specifications.length > 0 ? (
                      product.specifications.map((spec, index) => (
                        <tr key={index}>
                          <td>{spec.key}</td>
                          <td>{spec.value}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                          No specifications available for this product.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Secure transaction */}
          <div className="secure-badge">
            <ShieldCheck size={16} />
            <span>Secure Transaction & Encrypted Payment</span>
          </div>
        </div>
      </div>

      {/* You May Also Like / Related Products */}
      {relatedProducts.length > 0 && (
        <section className="detail-related-section section-padding">
          <h2 className="related-title">You may also like</h2>
          <div className="grid-products">
            {relatedProducts.map((item) => {
              const isItemFav = favorites.some((fav) => fav._id === item._id);
              return (
                <div key={item._id} className="product-card">
                  <button 
                    className="btn-icon product-card-save" 
                    onClick={() => toggleFavorite(item)}
                    title={isItemFav ? "Remove from Saved" : "Save Product"}
                  >
                    <Heart 
                      size={18} 
                      fill={isItemFav ? "#000" : "none"} 
                      stroke={isItemFav ? "#000" : "currentColor"} 
                    />
                  </button>

                  <Link to={`/products/${item._id}`} className="product-card-image-wrapper">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="product-card-image" 
                    />
                  </Link>

                  <div className="product-card-content">
                    <span className="product-card-category">{item.category}</span>
                    <Link to={`/products/${item._id}`}>
                      <h3 className="product-card-title">{item.name}</h3>
                    </Link>
                    
                    <div className="product-card-rating">
                      <Star size={14} fill="#000" stroke="#000" />
                      <span>{item.rating.toFixed(1)}</span>
                    </div>

                    <div className="product-card-bottom">
                      <span className="product-card-price">${item.price.toFixed(2)}</span>
                      <button 
                        className="btn btn-primary"
                        onClick={() => onAddToCart(item)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <style>{`
        .detail-loading-container, .detail-error-container {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
        }

        .detail-error-container h2 {
          margin-bottom: 12px;
        }
        .detail-error-container p {
          margin-bottom: 24px;
        }

        .detail-breadcrumb {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          font-size: 14px;
        }

        .breadcrumb-paths {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--color-text-muted);
        }

        .breadcrumb-paths a:hover {
          color: var(--color-text-primary);
        }

        .breadcrumb-active {
          color: var(--color-text-primary);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 60px;
          align-items: start;
          margin-bottom: 60px;
        }

        @media (max-width: 992px) {
          .detail-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        /* Image Display */
        .detail-image-card {
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          background-color: var(--color-surface);
          position: relative;
          padding: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 500px;
        }

        @media (max-width: 576px) {
          .detail-image-card {
            height: 320px;
            padding: 20px;
          }
        }

        .detail-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          mix-blend-mode: multiply;
        }

        .detail-favorite-btn {
          position: absolute;
          top: 24px;
          right: 24px;
          z-index: 10;
        }

        /* Info Section */
        .detail-category {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--color-text-muted);
          letter-spacing: 0.1em;
          display: block;
          margin-bottom: 8px;
        }

        .detail-title {
          font-size: 40px;
          line-height: 1.1;
          margin-bottom: 16px;
        }

        @media (max-width: 576px) {
          .detail-title {
            font-size: 28px;
          }
        }

        .detail-rating-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .stars-row {
          display: flex;
          gap: 2px;
        }

        .rating-value-bold {
          font-weight: 600;
          font-size: 14px;
        }

        .detail-review-count {
          color: var(--color-text-secondary);
          font-size: 14px;
        }

        .detail-price-tag {
          font-family: var(--font-heading);
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 24px;
        }

        .detail-delivery-indicators {
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
          padding: 20px 0;
          margin-bottom: 20px;
        }

        .detail-return-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--color-text-secondary);
          font-weight: 500;
        }

        .detail-stock-banner {
          width: 100%;
          justify-content: flex-start;
          border-radius: var(--radius-md);
        }

        .detail-in-stock-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: var(--color-success);
          margin-bottom: 20px;
        }

        .stock-dot {
          width: 8px;
          height: 8px;
          background-color: var(--color-success);
          border-radius: 50%;
        }

        /* Action Console */
        .detail-action-card {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .quantity-control-wrapper {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .control-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--color-text-muted);
        }

        .add-to-cart-action-btn {
          height: 50px;
          flex-grow: 1;
          border-radius: var(--radius-md);
          font-size: 16px;
          margin-top: 22px;
        }

        /* Tabs Details */
        .detail-tabs-section {
          margin-bottom: 30px;
          border-bottom: 1px solid var(--color-border);
        }

        .tabs-header {
          display: flex;
          gap: 24px;
          border-bottom: 1px solid var(--color-border);
        }

        .tab-btn {
          background: none;
          border: none;
          padding: 12px 4px;
          font-size: 15px;
          font-weight: 500;
          color: var(--color-text-secondary);
          cursor: pointer;
          position: relative;
          transition: var(--transition-fast);
        }

        .tab-btn:hover {
          color: var(--color-text-primary);
        }

        .tab-btn.active {
          color: var(--color-text-primary);
          font-weight: 600;
        }

        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--color-text-primary);
        }

        .tab-body {
          padding: 20px 4px;
        }

        .tab-description-text {
          color: var(--color-text-secondary);
          font-size: 15px;
          line-height: 1.6;
        }

        .specs-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .specs-table td {
          padding: 8px 12px;
          border-bottom: 1px solid #f5f5f5;
        }

        .specs-table tr td:first-child {
          font-weight: 600;
          color: var(--color-text-secondary);
          width: 160px;
        }

        .specs-table tr td:last-child {
          color: var(--color-text-primary);
        }

        .secure-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--color-text-muted);
          justify-content: center;
          border-top: 1px dashed var(--color-border);
          padding-top: 20px;
        }

        /* Related title */
        .related-title {
          font-size: 28px;
          margin-bottom: 30px;
        }
      `}</style>
    </div>
  );
}
