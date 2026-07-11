import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Star, Heart, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { getProducts } from '../services/api';

export default function ProductList({ onAddToCart, toggleFavorite, favorites }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search, category, sort states from URL params
  const categoryFilter = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort') || 'newest';

  useEffect(() => {
    setLoading(true);

    getProducts({ category: categoryFilter, search: searchQuery })
      .then((data) => {
        // Sort frontend-side for convenience
        let sorted = [...data];
        if (sortBy === 'price-low') {
          sorted.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
          sorted.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'rating') {
          sorted.sort((a, b) => b.rating - a.rating);
        }
        setProducts(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [categoryFilter, searchQuery, sortBy]);

  const handleCategoryChange = (category) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('search-input');
    const newParams = new URLSearchParams(searchParams);
    if (!query) {
      newParams.delete('search');
    } else {
      newParams.set('search', query);
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (e) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', e.target.value);
    setSearchParams(newParams);
  };

  const handleClearAll = () => {
    setSearchParams({});
  };

  return (
    <div className="container section-padding catalog-container">
      {/* Title */}
      <div className="catalog-header-section">
        <h1>Explore Products</h1>
        <p className="catalog-subtitle">{products.length} items available</p>
      </div>

      <div className="catalog-layout">
        {/* Filters Sidebar */}
        <aside className="catalog-sidebar">
          <div className="sidebar-widget">
            <h3>Search</h3>
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input 
                type="text" 
                name="search-input"
                defaultValue={searchQuery}
                placeholder="Search products..." 
                className="form-control search-input-box"
              />
              <button type="submit" className="search-submit-btn">
                <Search size={16} />
              </button>
            </form>
          </div>

          <div className="sidebar-widget">
            <h3>Categories</h3>
            <div className="category-list-filters">
              {['All', 'Headphones', 'Earbuds', 'Speakers', 'Accessories'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`category-filter-btn ${categoryFilter === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {(categoryFilter !== 'All' || searchQuery) && (
            <button className="btn btn-secondary clear-filters-btn" onClick={handleClearAll}>
              Clear All Filters
            </button>
          )}
        </aside>

        {/* Catalog Content */}
        <main className="catalog-content-area">
          {/* Top Bar (Sorting / Count) */}
          <div className="catalog-topbar">
            <div className="catalog-count-badge">
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </div>
            
            <div className="sort-wrapper">
              <ArrowUpDown size={16} className="sort-icon-select" />
              <select className="sort-select" value={sortBy} onChange={handleSortChange}>
                <option value="newest">Sort by: Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Sort by: Rating</option>
              </select>
            </div>
          </div>

          {/* Grid Products */}
          {loading && (
            <div className="catalog-loading-state">
              <div className="spinner"></div>
              <p>Loading products list...</p>
            </div>
          )}

          {error && (
            <div className="catalog-error-state">
              <p>Failed to retrieve products. Error: {error}</p>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="catalog-empty-state">
              <h3>No products found</h3>
              <p>Try resetting the search filters or check again later.</p>
              <button className="btn btn-primary" onClick={handleClearAll}>
                Reset Filters
              </button>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
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
        </main>
      </div>

      <style>{`
        .catalog-container {
          min-height: 70vh;
        }

        .catalog-header-section {
          margin-bottom: 40px;
        }

        .catalog-subtitle {
          color: var(--color-text-secondary);
          margin-top: 4px;
        }

        .catalog-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 40px;
          align-items: start;
        }

        @media (max-width: 992px) {
          .catalog-layout {
            grid-template-columns: 1fr;
          }
          .catalog-sidebar {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
        }

        @media (max-width: 576px) {
          .catalog-sidebar {
            grid-template-columns: 1fr;
          }
        }

        /* Sidebar Filters */
        .catalog-sidebar {
          position: sticky;
          top: 100px;
        }

        .sidebar-widget {
          margin-bottom: 30px;
        }

        .sidebar-widget h3 {
          font-size: 16px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 16px;
          color: var(--color-text-primary);
        }

        .search-form {
          position: relative;
        }

        .search-input-box {
          padding-right: 46px;
          border-radius: var(--radius-full);
        }

        .search-submit-btn {
          position: absolute;
          right: 6px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
          transition: var(--transition-fast);
        }

        .search-submit-btn:hover {
          color: var(--color-text-primary);
          background-color: #f0f0f0;
        }

        .category-list-filters {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        @media (max-width: 992px) {
          .category-list-filters {
            flex-direction: row;
            flex-wrap: wrap;
          }
        }

        .category-filter-btn {
          background: none;
          border: none;
          text-align: left;
          padding: 8px 12px;
          font-size: 15px;
          font-weight: 500;
          color: var(--color-text-secondary);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .category-filter-btn:hover {
          color: var(--color-text-primary);
          background-color: #f5f5f5;
        }

        .category-filter-btn.active {
          color: var(--color-text-primary);
          background-color: #f0f0f0;
          font-weight: 600;
        }

        .clear-filters-btn {
          width: 100%;
          border-radius: var(--radius-md);
        }

        /* Top Bar */
        .catalog-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 16px;
          margin-bottom: 30px;
        }

        .catalog-count-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--color-text-secondary);
        }

        .sort-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .sort-icon-select {
          position: absolute;
          left: 12px;
          pointer-events: none;
          color: var(--color-text-secondary);
        }

        .sort-select {
          appearance: none;
          padding: 8px 16px 8px 36px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          background: var(--color-surface);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .sort-select:hover {
          border-color: var(--color-text-primary);
        }

        /* Empty / Loading States */
        .catalog-empty-state {
          text-align: center;
          padding: 80px 20px;
          border: 1px dashed var(--color-border);
          border-radius: var(--radius-lg);
          background: var(--color-surface);
        }

        .catalog-empty-state h3 {
          font-size: 20px;
          margin-bottom: 8px;
        }

        .catalog-empty-state p {
          color: var(--color-text-secondary);
          margin-bottom: 24px;
        }

        .catalog-loading-state, .catalog-error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 100px 0;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          color: var(--color-text-secondary);
        }

        .rating-count {
          color: var(--color-text-muted);
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}
