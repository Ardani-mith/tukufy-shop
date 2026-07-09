import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();

  // Hide footer on auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  if (isAuthPage) return null;

  return (
    <footer className="site-footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-circle-black-small"></span>
            <span className="logo-text-small">Tukufy</span>
          </div>
          <p className="footer-desc">Premium audio devices & digital products for lifestyle excellence.</p>
        </div>
        
        <div className="footer-links-group">
          {/* <div className="footer-links-col">
            <h4>Products</h4>
            <Link to="/products?category=Headphones">Headphones</Link>
            <Link to="/products?category=Earbuds">Earbuds</Link>
            <Link to="/products?category=Speakers">Speakers</Link>
            <Link to="/products?category=Accessories">Accessories</Link>
          </div> */}
          
          <div className="footer-links-col">
            <h4>Support</h4>
            <a href="#help">Help Center</a>
            <a href="#shipping">Shipping & Returns</a>
            <a href="#track">Track Order</a>
            <a href="#contact">Contact Us</a>
          </div>

          <div className="footer-links-col">
            <h4>Company</h4>
            <a href="#about">About Us</a>
            <a href="#careers">Careers</a>
            <a href="#press">Press</a>
            <a href="#stores">Store Locations</a>
          </div>
        </div>
      </div>
      
      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} Tukufy. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </div>
      </div>

      <style>{`
        .site-footer {
          background-color: #f7f7f7;
          border-top: 1px solid var(--color-border);
          padding: 60px 0 30px 0;
          margin-top: auto;
        }

        .footer-container {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 40px;
          padding-bottom: 40px;
          border-bottom: 1px solid var(--color-border);
        }

        .footer-brand {
          max-width: 300px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .logo-circle-black-small {
          width: 14px;
          height: 14px;
          background-color: #000;
          border-radius: 50%;
          display: block;
        }

        .logo-text-small {
          font-family: var(--font-heading);
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .footer-desc {
          color: var(--color-text-secondary);
          font-size: 14px;
        }

        .footer-links-group {
          display: flex;
          gap: 60px;
          flex-wrap: wrap;
        }

        .footer-links-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 120px;
        }

        .footer-links-col h4 {
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
          color: var(--color-text-primary);
        }

        .footer-links-col a {
          font-size: 14px;
          color: var(--color-text-secondary);
        }

        .footer-links-col a:hover {
          color: var(--color-text-primary);
        }

        .footer-bottom {
          padding-top: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: var(--color-text-muted);
          flex-wrap: wrap;
          gap: 16px;
        }

        .footer-bottom-links {
          display: flex;
          gap: 20px;
        }

        .footer-bottom-links a:hover {
          color: var(--color-text-primary);
        }

        @media (max-width: 768px) {
          .footer-container {
            flex-direction: column;
          }
          .footer-links-group {
            gap: 30px;
          }
        }
      `}</style>
    </footer>
  );
}
