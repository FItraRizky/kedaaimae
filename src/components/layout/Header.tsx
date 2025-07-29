import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, User, Menu as MenuIcon, X, Calendar, Camera, Users, LogIn } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import logo
import logoImage from '../../logooo.jpg';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { cart } = useCart();

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Close menu when clicking outside
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMenuOpen]);

  const navItems = [
    { path: '/', label: 'Home', icon: null },
    { path: '/menu', label: 'Menu', icon: null },
    { path: '/gallery', label: 'Gallery', icon: <Camera size={16} /> },
    { path: '/events', label: 'Events', icon: <Calendar size={16} /> },
    { path: '/community', label: 'Community', icon: <Users size={16} /> },
    { path: '/login', label: 'Login', icon: <LogIn size={16} /> },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="header"
    >
      <div className="container" data-aos="fade-down" data-aos-duration="800">
        <div className="header-content" data-aos="fade-in" data-aos-delay="100">
          <Link to="/" className="logo" data-aos="fade-right">
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

          {/* Mobile menu overlay */}
          {isMenuOpen && (
            <div 
              className="menu-overlay" 
              onClick={handleMenuClose}
              onTouchStart={handleMenuClose}
            />
          )}

          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`} data-aos="fade-left">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={handleMenuClose}
                onTouchStart={handleMenuClose}
                data-aos="fade-up"
                data-aos-delay={`${100 + index * 50}`}
              >
                {item.icon && <span className="nav-icon">{item.icon}</span>}
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions" data-aos="fade-left" data-aos-delay="200">
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
              onClick={handleMenuToggle}
              onTouchStart={handleMenuToggle}
              aria-label="Toggle menu"
              data-aos="zoom-in"
              data-aos-delay="300"
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
          background: linear-gradient(135deg, #F5DEB3 0%, #D2B48C 100%);
          border-bottom: 1px solid rgba(210, 180, 140, 0.3);
          padding: 1rem 0;
          box-shadow: 0 2px 10px rgba(210, 180, 140, 0.2);
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
          text-shadow: none;
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
          background: rgba(255, 255, 255, 0.2);
          color: #000000;
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
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .cart-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: linear-gradient(135deg, #D2B48C 0%, #F5DEB3 100%);
          color: #8B4513;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(210, 180, 140, 0.3);
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
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9998;
          display: block;
        }

        @media (max-width: 768px) {
          .nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #D2B48C 0%, #F5DEB3 100%);
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 2rem;
            box-shadow: 0 4px 20px rgba(210, 180, 140, 0.3);
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            z-index: 9999;
            overflow: hidden;
            -webkit-overflow-scrolling: touch;
          }

          .nav-open {
            transform: translateX(0);
          }

          .nav-link {
            font-size: 1.2rem;
            padding: 1rem 2rem;
            margin: 0.5rem 0;
            width: 100%;
            text-align: center;
            border-radius: 8px;
          }

          .menu-toggle {
            display: block;
            z-index: 10000;
            position: relative;
          }

          .header {
            position: fixed;
            width: 100%;
            top: 0;
            left: 0;
            right: 0;
          }
        }
      `}</style>
    </motion.header>
  );
};

export default Header;