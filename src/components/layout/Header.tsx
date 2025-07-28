import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, User, Menu as MenuIcon, X, Calendar, Camera, Users } from 'lucide-react';
import { useCart } from '../../context/CartContext';

// Import logo
import logoImage from '../../logooo.jpg';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { cart } = useCart();

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    { path: '/', label: 'Home', icon: null },
    { path: '/menu', label: 'Menu', icon: null },
    { path: '/gallery', label: 'Gallery', icon: <Camera size={16} /> },
    { path: '/events', label: 'Events', icon: <Calendar size={16} /> },
    { path: '/community', label: 'Community', icon: <Users size={16} /> },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="header"
    >
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <div className="logo-container">
              <img 
                src={logoImage}
                alt="Mae Kedai Logo" 
                className="logo-image"
              />
              <motion.h1
                whileHover={{ scale: 1.05 }}
                className="logo-text"
              >
                Mae Kedai
              </motion.h1>
            </div>
          </Link>

          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon && <span className="nav-icon">{item.icon}</span>}
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <Link to="/cart" className="cart-button">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="cart-icon-container"
              >
                <ShoppingCart size={24} />
                {cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="cart-badge"
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            <Link to="/profile" className="profile-button">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="profile-icon-container"
              >
                <User size={24} />
              </motion.div>
            </Link>

            <button
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: #F5F5DC;
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(245, 245, 220, 0.3);
          padding: 1rem 0;
          box-shadow: 0 2px 10px rgba(245, 245, 220, 0.2);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          text-decoration: none;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-image {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          transition: var(--transition);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .logo-image:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: #000000;
          margin: 0;
          text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
        }

        .nav {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: #000000;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: var(--border-radius);
          transition: var(--transition);
        }

        .nav-link:hover,
        .nav-link.active {
          background: rgba(135, 206, 235, 0.3);
          color: #1a1a1a;
          transform: translateY(-1px);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .cart-button,
        .profile-button {
          text-decoration: none;
          color: #000000;
        }

        .cart-icon-container,
        .profile-icon-container {
          position: relative;
          padding: 0.5rem;
          border-radius: 50%;
          transition: var(--transition);
        }

        .cart-icon-container:hover,
        .profile-icon-container:hover {
          background: rgba(135, 206, 235, 0.3);
          transform: scale(1.1);
        }

        .cart-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: linear-gradient(135deg, #4169E1 0%, #1E90FF 100%);
          color: #FFFFFF;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(65, 105, 225, 0.3);
        }

        .menu-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          transition: var(--transition);
          color: #000000;
        }

        .menu-toggle:hover {
          background: rgba(135, 206, 235, 0.3);
          transform: scale(1.1);
        }

        @media (max-width: 768px) {
          .nav {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background: #F5F5DC;
            flex-direction: column;
            padding: 2rem;
            box-shadow: 0 4px 20px rgba(245, 245, 220, 0.3);
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }

          .nav-open {
            transform: translateX(0);
          }

          .menu-toggle {
            display: block;
          }
        }
      `}</style>
    </motion.header>
  );
};

export default Header;