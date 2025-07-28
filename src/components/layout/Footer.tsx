import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Clock } from 'lucide-react';
import NewsletterSignup from '../NewsletterSignup';

const Footer: React.FC = () => {
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
  ];

  const quickLinks = [
    { label: 'Menu', href: '/menu' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Events', href: '/events' },
    { label: 'Community', href: '/community' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const services = [
    { label: 'Food Delivery', href: '/delivery' },
    { label: 'Catering', href: '/catering' },
    { label: 'Gift Cards', href: '/gift-cards' },
    { label: 'Subscriptions', href: '/subscriptions' },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="footer"
    >
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Kedai Mae</h3>
            <p className="footer-description">
              Experience authentic Indonesian cuisine with a modern twist. 
              Fresh ingredients, traditional recipes, and unforgettable flavors.
            </p>
            <div className="social-links">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  aria-label={link.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="social-link"
                >
                  <link.icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Quick Links</h4>
            <ul className="footer-links">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Services</h4>
            <ul className="footer-links">
              {services.map((service) => (
                <li key={service.label}>
                  <Link to={service.href} className="footer-link">
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Contact Info</h4>
            <div className="contact-info">
              <div className="contact-item">
                <MapPin size={16} />
                <span>123 Culinary Street, Jakarta, Indonesia</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>+62 123 4567 8900</span>
              </div>
              <div className="contact-item">
                <Mail size={16} />
                <span>hello@kedaimae.com</span>
              </div>
              <div className="contact-item">
                <Clock size={16} />
                <span>Mon-Sun: 10:00 AM - 10:00 PM</span>
              </div>
            </div>
          </div>

          <div className="footer-section newsletter">
            <h4 className="footer-subtitle">Stay Updated</h4>
            <NewsletterSignup />
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Kedai Mae. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          background: linear-gradient(135deg, var(--bg-dark) 0%, var(--primary-color) 100%);
          color: var(--bg-light);
          padding: 4rem 0 2rem;
          margin-top: auto;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .footer-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--accent-color);
          margin: 0;
        }

        .footer-subtitle {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--secondary-color);
          margin: 0;
        }

        .footer-description {
          color: #000000;
          line-height: 1.6;
          margin: 0;
        }

        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(255, 210, 63, 0.1);
          border-radius: 50%;
          color: var(--accent-color);
          transition: var(--transition);
        }

        .social-link:hover {
          background: var(--accent-color);
          color: #1a0f0a;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .footer-link {
          color: #000000;
          text-decoration: none;
          transition: var(--transition);
        }

        .footer-link:hover {
          color: var(--accent-color);
          transform: translateX(5px);
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #000000;
          font-size: 0.9rem;
        }

        .newsletter {
          grid-column: 1 / -1;
        }

        .footer-bottom {
          border-top: 1px solid var(--secondary-color);
          padding-top: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          color: var(--accent-color);
          font-size: 0.9rem;
        }

        .footer-bottom-links {
          display: flex;
          gap: 2rem;
        }

        .footer-bottom-links a {
          color: var(--accent-color);
          text-decoration: none;
          transition: var(--transition);
        }

        .footer-bottom-links a:hover {
          color: var(--accent-color);
        }

        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }

          .footer-bottom-links {
            justify-content: center;
          }
        }
      `}</style>
    </motion.footer>
  );
};

export default Footer;