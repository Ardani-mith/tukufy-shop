import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, AlertTriangle, Search, Info } from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';

export default function Admin({ showToast }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selected product states
  const [currentProduct, setCurrentProduct] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    category: 'Accessories',
    price: '',
    stock: '',
    image: '',
    description: '',
    specifications: []
  });

  const fetchProducts = () => {
    setLoading(true);
    getProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Specification handlers
  const handleSpecChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.specifications];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, specifications: updated };
    });
  };

  const addSpecRow = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const removeSpecRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  // Open Add Modal
  const openAddModal = () => {
    setFormData({
      name: '',
      category: 'Accessories',
      price: '',
      stock: '',
      image: '',
      description: '',
      specifications: []
    });
    setIsAddModalOpen(true);
  };

  // Handle Add Product Submit
  const handleAddProduct = (e) => {
    e.preventDefault();

    // Quick validation
    if (!formData.name || !formData.price || !formData.image || !formData.description) {
      showToast('Please fill out all required fields!', 'error');
      return;
    }

    createProduct(formData)
      .then((data) => {
        showToast(`Product "${data.name}" added successfully!`);
        setIsAddModalOpen(false);
        fetchProducts();
      })
      .catch((err) => {
        console.error(err);
        showToast('Failed to add product: ' + err.message, 'error');
      });
  };

  // Open Edit Modal
  const openEditModal = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: product.image,
      description: product.description,
      specifications: product.specifications || []
    });
    setIsEditModalOpen(true);
  };

  // Handle Edit Product Submit
  const handleEditProduct = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.image || !formData.description) {
      showToast('Please fill out all required fields!', 'error');
      return;
    }

    updateProduct(currentProduct._id, formData)
      .then((data) => {
        showToast(`Product "${data.name}" updated successfully!`);
        setIsEditModalOpen(false);
        fetchProducts();
      })
      .catch((err) => {
        console.error(err);
        showToast('Failed to update product: ' + err.message, 'error');
      });
  };

  // Open Delete Modal
  const openDeleteModal = (product) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Handle Delete Product
  const handleDeleteProduct = () => {
    deleteProduct(currentProduct._id)
      .then(() => {
        showToast(`Product deleted successfully!`);
        setIsDeleteModalOpen(false);
        fetchProducts();
      })
      .catch((err) => {
        console.error(err);
        showToast('Failed to delete product: ' + err.message, 'error');
      });
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container section-padding admin-container">
      {/* Header section */}
      <div className="admin-header-flex">
        <div>
          <h1>Admin Control Center</h1>
          <p className="admin-subtitle">Add, edit, or delete store catalog items</p>
        </div>
        <button className="btn btn-primary add-new-btn-icon" onClick={openAddModal}>
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Info Warning */}
      {/* <div className="admin-info-banner">
        <Info size={16} />
        <span>CRUD modifications made here will directly sync with the backend MongoDB database.</span>
      </div> */}

      {/* Utilities bar */}
      <div className="admin-toolbar">
        <div className="admin-search-wrapper">
          <Search size={16} className="admin-search-icon" />
          <input
            type="text"
            placeholder="Search items by name or category..."
            className="form-control admin-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table content */}
      {loading ? (
        <div className="admin-loading-card">
          <div className="spinner"></div>
          <p>Fetching inventory...</p>
        </div>
      ) : error ? (
        <div className="admin-error-card">
          <p>Error connecting to REST API: {error}</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="admin-empty-card">
          <p>No products match your search or inventory is empty.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="table-img-wrapper">
                      <img src={product.image} alt={product.name} className="table-thumbnail" />
                    </div>
                  </td>
                  <td>
                    <div className="table-product-name">{product.name}</div>
                  </td>
                  <td>
                    <span className="table-category-badge">{product.category}</span>
                  </td>
                  <td>
                    <span className="table-price">${product.price.toFixed(2)}</span>
                  </td>
                  <td>
                    <span className={`table-stock-number ${product.stock <= 3 ? 'text-red' : ''}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="table-actions-row">
                      <button
                        className="btn-icon btn-table-edit"
                        onClick={() => openEditModal(product)}
                        title="Edit Item"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        className="btn-icon btn-table-delete"
                        onClick={() => openDeleteModal(product)}
                        title="Delete Item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= ADD MODAL ================= */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Product</h2>
              <button className="close-btn" onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddProduct}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="e.g. Apex Pro Wireless Headphones"
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="form-control"
                    >
                      <option value="Headphones">Headphones</option>
                      <option value="Earbuds">Earbuds</option>
                      <option value="Speakers">Speakers</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price ($) *</label>
                    <input
                      type="number"
                      name="price"
                      required
                      min="0.01"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="299.00"
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Stock Units *</label>
                    <input
                      type="number"
                      name="stock"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="10"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Image URL *</label>
                    <input
                      type="url"
                      name="image"
                      required
                      value={formData.image}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-control"
                    rows="4"
                    placeholder="Enter detailed description of features and build..."
                  ></textarea>
                </div>

                {/* Specifications (Optional) */}
                <div className="form-group">
                  <label className="form-label">
                    Specifications <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(Optional)</span>
                  </label>
                  {formData.specifications.length === 0 ? (
                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                      No specifications added yet.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                      {formData.specifications.map((spec, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            type="text"
                            placeholder="e.g. Weight"
                            value={spec.key}
                            onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                            className="form-control"
                            style={{ flex: 1 }}
                          />
                          <input
                            type="text"
                            placeholder="e.g. 250g"
                            value={spec.value}
                            onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                            className="form-control"
                            style={{ flex: 1 }}
                          />
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => removeSpecRow(idx)}
                            title="Remove specification"
                            style={{ color: 'var(--color-error)', flexShrink: 0 }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={addSpecRow}
                    style={{ fontSize: '13px', padding: '6px 14px' }}
                  >
                    <Plus size={14} /> Add Spec
                  </button>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Product</h2>
              <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditProduct}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="form-control"
                    >
                      <option value="Headphones">Headphones</option>
                      <option value="Earbuds">Earbuds</option>
                      <option value="Speakers">Speakers</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price ($) *</label>
                    <input
                      type="number"
                      name="price"
                      required
                      min="0.01"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Stock Units *</label>
                    <input
                      type="number"
                      name="stock"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Image URL *</label>
                    <input
                      type="url"
                      name="image"
                      required
                      value={formData.image}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-control"
                    rows="4"
                  ></textarea>
                </div>

                {/* Specifications (Optional) */}
                <div className="form-group">
                  <label className="form-label">
                    Specifications <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(Optional)</span>
                  </label>
                  {formData.specifications.length === 0 ? (
                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                      No specifications added yet.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                      {formData.specifications.map((spec, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            type="text"
                            placeholder="e.g. Weight"
                            value={spec.key}
                            onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                            className="form-control"
                            style={{ flex: 1 }}
                          />
                          <input
                            type="text"
                            placeholder="e.g. 250g"
                            value={spec.value}
                            onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                            className="form-control"
                            style={{ flex: 1 }}
                          />
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => removeSpecRow(idx)}
                            title="Remove specification"
                            style={{ color: 'var(--color-error)', flexShrink: 0 }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={addSpecRow}
                    style={{ fontSize: '13px', padding: '6px 14px' }}
                  >
                    <Plus size={14} /> Add Spec
                  </button>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRM MODAL ================= */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <h2>Confirm Deletion</h2>
              <button className="close-btn" onClick={() => setIsDeleteModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '30px 24px' }}>
              <div className="flex-center" style={{ color: 'var(--color-error)', marginBottom: '16px' }}>
                <AlertTriangle size={48} />
              </div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Are you absolutely sure?</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: '1.4' }}>
                You are about to delete <strong>"{currentProduct?.name}"</strong>. This action cannot be undone and will permanently remove this item from the catalog.
              </p>
            </div>
            <div className="modal-footer" style={{ borderTop: 'none', paddingBottom: '24px' }}>
              <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" style={{ backgroundColor: 'var(--color-error)' }} onClick={handleDeleteProduct}>
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-container {
          min-height: 70vh;
        }

        .admin-header-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .admin-subtitle {
          color: var(--color-text-secondary);
        }

        .admin-info-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #f0f7ff;
          border: 1px solid #cce3ff;
          color: #0056b3;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 30px;
        }

        .admin-toolbar {
          margin-bottom: 20px;
        }

        .admin-search-wrapper {
          position: relative;
          max-width: 450px;
        }

        .admin-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
        }

        .admin-search-input {
          padding-left: 42px;
          border-radius: var(--radius-full);
          font-size: 14px;
        }

        /* Loading / Error / Empty Cards */
        .admin-loading-card, .admin-error-card, .admin-empty-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          color: var(--color-text-secondary);
        }

        /* Table Design */
        .table-responsive {
          width: 100%;
          overflow-x: auto;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 14px;
        }

        .admin-table th, .admin-table td {
          padding: 16px 20px;
          border-bottom: 1px solid var(--color-border);
          vertical-align: middle;
        }

        .admin-table th {
          background-color: #fafafa;
          font-family: var(--font-heading);
          font-weight: 600;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.05em;
        }

        .admin-table tr:last-child td {
          border-bottom: none;
        }

        .table-img-wrapper {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 1px solid var(--color-border);
          background-color: #f9f9f9;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .table-thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .table-product-name {
          font-weight: 600;
          color: var(--color-text-primary);
        }

        .table-category-badge {
          background-color: #f0f0f0;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 12px;
          font-weight: 500;
          color: var(--color-text-secondary);
        }

        .table-price {
          font-weight: 600;
          color: var(--color-text-primary);
        }

        .table-stock-number {
          font-weight: 500;
        }

        .text-red {
          color: var(--color-error);
          font-weight: 600;
        }

        .text-right {
          text-align: right;
        }

        .table-actions-row {
          display: inline-flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .btn-table-edit:hover {
          color: var(--color-text-primary);
          background-color: #f5f5f5;
        }

        .btn-table-delete:hover {
          color: var(--color-error);
          background-color: var(--color-error-bg);
          border-color: var(--color-error-border);
        }

        /* Form Grid in Modals */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 576px) {
          .form-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }
      `}</style>
    </div>
  );
}
