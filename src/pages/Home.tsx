import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, MapPin, Users } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web';
import SNILogo from '../SNI_mark.svg.png';
import HalalLogo from '../Halal_Indonesia.svg.png';
import SPPIRTLogo from '../logoSPPIRT.png';
import HACCPLogo from '../logo-haccp.png';

// Custom hook untuk efek typing
const useTypewriter = (text: string, speed: number = 100) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return displayText;
};

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  category: string;
  prepTime: string;
}

const Home: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [featuredDishes, setFeaturedDishes] = useState<Dish[]>([]);
  
  // Efek typing untuk judul hero
  const typedText = useTypewriter('Experience Authentic', 150);
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [showFirstCursor, setShowFirstCursor] = useState(true);
  const [showSecondCursor, setShowSecondCursor] = useState(false);
  const secondLineText = useTypewriter(showSecondLine ? 'Indonesian Cuisine' : '', 120);
  
  useEffect(() => {
    if (typedText === 'Experience Authentic') {
      setShowFirstCursor(false);
      const timer = setTimeout(() => {
        setShowSecondLine(true);
        setShowSecondCursor(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [typedText]);
  
  useEffect(() => {
    if (secondLineText === 'Indonesian Cuisine') {
      const timer = setTimeout(() => setShowSecondCursor(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [secondLineText]);

  const heroImages = [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const [springProps, setSpringProps] = useSpring(() => ({
    transform: 'scale(1)',
    config: { tension: 300, friction: 10 },
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    // Mock featured dishes - in real app, fetch from API
    setFeaturedDishes([
      {
        id: '1',
        name: 'Nasi Goreng Special',
        description: 'Authentic Indonesian fried rice with shrimp, chicken, and vegetables',
        price: 45000,
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        category: 'Main Course',
        prepTime: '15 min',
      },
      {
        id: '2',
        name: 'Rendang Padang',
        description: 'Slow-cooked beef in rich coconut curry with authentic spices',
        price: 65000,
        image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        category: 'Main Course',
        prepTime: '45 min',
      },
      {
        id: '3',
        name: 'Sate Ayam Madura',
        description: 'Grilled chicken skewers with peanut sauce and sweet soy',
        price: 35000,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        rating: 4.7,
        category: 'Appetizer',
        prepTime: '20 min',
      },
    ]);
  }, []);

  const stats = [
    { icon: Users, value: '10K+', label: 'Happy Customers' },
    { icon: Star, value: '4.8', label: 'Average Rating' },
    { icon: Clock, value: '15-45', label: 'Minutes Delivery' },
    { icon: MapPin, value: '5', label: 'Locations' },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-slider">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentImageIndex ? 'active' : ''}`}
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${image})`,
              }}
            />
          ))}
        </div>

        <motion.div
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          <motion.h1 variants={fadeInUp} className="hero-title">
            {typedText}
            {showFirstCursor && <span className="typing-cursor">|</span>}
            <br />
            {showSecondLine && (
              <span className="hero-highlight">
                {secondLineText}
                {showSecondCursor && <span className="typing-cursor">|</span>}
              </span>
            )}
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="hero-subtitle">
            Discover the rich flavors of Indonesia with our carefully crafted dishes,
            made from the finest ingredients and traditional recipes passed down through generations.
          </motion.p>

          <motion.div variants={fadeInUp} className="hero-actions">
            <Link to="/menu" className="btn btn-primary btn-large">
              Explore Menu
              <ArrowRight size={20} />
            </Link>
            <Link to="/community" className="btn btn-secondary btn-large">
              Join Community
            </Link>
          </motion.div>
        </motion.div>

        <div className="hero-scroll-indicator">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="scroll-arrow"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <motion.div
            className="stats-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
              >
                <stat.icon size={32} className="stat-icon" />
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-label">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="featured-section">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="section-header"
          >
            <h2 className="section-title">Featured Dishes</h2>
            <p className="section-subtitle">
              Handpicked by our chefs, these dishes represent the best of Indonesian cuisine
            </p>
          </motion.div>

          <motion.div
            className="dishes-grid"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredDishes.map((dish) => (
              <motion.div
                key={dish.id}
                className="dish-card"
                variants={fadeInUp}
                whileHover={{ y: -10 }}
              >
                <div className="dish-image-container">
                  <img src={dish.image} alt={dish.name} className="dish-image" />
                  <div className="dish-overlay">
                    <span className="dish-category">{dish.category}</span>
                  </div>
                </div>
                
                <div className="dish-content">
                  <h3 className="dish-name">{dish.name}</h3>
                  <p className="dish-description">{dish.description}</p>
                  
                  <div className="dish-meta">
                    <div className="dish-rating">
                      <Star size={16} className="star-icon" />
                      <span>{dish.rating}</span>
                    </div>
                    <div className="dish-time">
                      <Clock size={16} />
                      <span>{dish.prepTime}</span>
                    </div>
                  </div>
                  
                  <div className="dish-footer">
                    <span className="dish-price">Rp {dish.price.toLocaleString()}</span>
                    <Link to={`/menu/${dish.id}`} className="btn btn-primary">
                      Order Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="section-cta"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link to="/menu" className="btn btn-secondary">
              View Full Menu
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="certifications-section">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="section-header"
          >
            <h2 className="section-title">Sertifikasi & Standar Kualitas</h2>
            <p className="section-subtitle">
              Komitmen kami terhadap kualitas dan keamanan pangan terjamin melalui berbagai sertifikasi resmi
            </p>
          </motion.div>

          <motion.div
            className="certifications-grid"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="certification-card" variants={fadeInUp}>
              <div className="cert-logo">
                <img src={SNILogo} alt="SNI Logo" width="80" height="80" />
              </div>
            </motion.div>

            <motion.div className="certification-card" variants={fadeInUp}>
              <div className="cert-logo">
                <img src={HalalLogo} alt="Halal Logo" width="80" height="80" />
              </div>
            </motion.div>

            <motion.div className="certification-card" variants={fadeInUp}>
              <div className="cert-logo">
                <img src={SPPIRTLogo} alt="SPP-IRT Logo" width="80" height="80" />
              </div>
            </motion.div>

            <motion.div className="certification-card" variants={fadeInUp}>
              <div className="cert-logo">
                <img src={HACCPLogo} alt="HACCP Logo" width="80" height="80" />
              </div>
            </motion.div>

            {/* Duplikasi untuk efek kontinyu */}
            <motion.div className="certification-card" variants={fadeInUp}>
              <div className="cert-logo">
                <img src={SNILogo} alt="SNI Logo" width="80" height="80" />
              </div>
            </motion.div>

            <motion.div className="certification-card" variants={fadeInUp}>
              <div className="cert-logo">
                <img src={HalalLogo} alt="Halal Logo" width="80" height="80" />
              </div>
            </motion.div>

            <motion.div className="certification-card" variants={fadeInUp}>
              <div className="cert-logo">
                <img src={SPPIRTLogo} alt="SPP-IRT Logo" width="80" height="80" />
              </div>
            </motion.div>

            <motion.div className="certification-card" variants={fadeInUp}>
              <div className="cert-logo">
                <img src={HACCPLogo} alt="HACCP Logo" width="80" height="80" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <style>{`
        :root {
          --transition-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          --transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          --transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          --transition-smooth: 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          --easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
          --easing-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
          --easing-natural: cubic-bezier(0.4, 0, 0.2, 1);
        }

        * {
          scroll-behavior: smooth;
        }

        .home {
          min-height: 100vh;
        }

        .hero {
          position: relative;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .hero-slider {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .hero-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity var(--transition-smooth);
          transform: scale(1.05);
        }

        .hero-slide.active {
          opacity: 1;
          transform: scale(1);
          transition: opacity var(--transition-smooth), transform var(--transition-smooth);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: var(--bg-light);
          max-width: 800px;
          padding: 0 2rem;
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }

        .hero-highlight {
          background: linear-gradient(135deg, #FFD23F, #FF6B35);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .typing-cursor {
          display: inline-block;
          background-color: var(--bg-light);
          margin-left: 3px;
          width: 3px;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }

        .hero-subtitle {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.9;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-large {
          padding: 1rem 2rem;
          font-size: 1.1rem;
        }

        .hero-scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
        }

        .scroll-arrow {
          width: 2px;
          height: 30px;
          background: white;
          border-radius: 2px;
        }

        .stats-section {
          background: var(--bg-light);
          padding: 4rem 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          text-align: center;
        }

        .stat-card {
          background: linear-gradient(rgba(255, 248, 220, 0.9), rgba(245, 222, 179, 0.9)), url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80');
          background-size: cover;
          background-position: center;
          padding: 2rem;
          border-radius: var(--border-radius-large);
          box-shadow: var(--shadow-light);
          transition: var(--transition);
        }

        .stat-card:hover {
          box-shadow: var(--shadow-medium);
        }

        .stat-icon {
          color: var(--primary-color);
          margin-bottom: 1rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: var(--text-light);
          font-weight: 500;
        }

        .featured-section {
          padding: 4rem 0;
          background: linear-gradient(rgba(255, 248, 220, 0.8), rgba(245, 222, 179, 0.8)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: var(--text-dark);
        }

        .section-subtitle {
          font-size: 1.2rem;
          color: var(--text-light);
          max-width: 600px;
          margin: 0 auto;
        }

        .dishes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .dish-card {
          background: linear-gradient(rgba(255, 248, 220, 0.95), rgba(245, 222, 179, 0.95)), url('https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80');
          background-size: cover;
          background-position: center;
          border-radius: var(--border-radius-large);
          box-shadow: var(--shadow-light);
          overflow: hidden;
          transition: all var(--transition-smooth);
          will-change: transform, box-shadow;
        }

        .dish-card:hover {
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          transform: translateY(-12px) scale(1.02);
        }

        .dish-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .dish-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-smooth);
          will-change: transform;
        }

        .dish-card:hover .dish-image {
          transform: scale(1.08) rotate(1deg);
        }

        .dish-overlay {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(139, 0, 0, 0.9);
          color: var(--bg-light);
          padding: 0.5rem 1rem;
          border-radius: var(--border-radius);
          font-size: 0.8rem;
          font-weight: 600;
        }

        .dish-content {
          padding: 1.5rem;
        }

        .dish-name {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--text-dark);
        }

        .dish-description {
          color: var(--text-light);
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .dish-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: var(--text-light);
        }

        .dish-rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .star-icon {
          color: var(--accent-color);
        }

        .dish-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dish-price {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .section-cta {
          text-align: center;
          margin-top: 3rem;
        }

        .certifications-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .certifications-grid {
          display: flex;
          gap: 2rem;
          margin-top: 3rem;
          overflow: hidden;
          white-space: nowrap;
          animation: runningLogos 20s ease-in-out infinite;
          will-change: transform;
        }

        @keyframes runningLogos {
          0% {
            transform: translateX(100%);
          }
          50% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(-200%);
          }
        }

        .certification-card {
          background: white;
          padding: 1.5rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: all var(--transition-normal);
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 120px;
          height: 120px;
          will-change: transform, box-shadow;
        }

        .certification-card:hover {
          transform: translateY(-8px) scale(1.05);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
          border-color: #cbd5e1;
        }

        .cert-logo {
          display: flex;
          justify-content: center;
        }

        .cert-logo img {
          object-fit: contain;
          border-radius: 8px;
          transition: transform var(--transition-normal);
          will-change: transform;
        }

        .certification-card:hover .cert-logo img {
          transform: scale(1.15) rotate(5deg);
        }



        @media (max-width: 768px) {
          .hero-actions {
            flex-direction: column;
            align-items: center;
          }

          .dishes-grid {
            grid-template-columns: 1fr;
          }

          .section-title {
            font-size: 2rem;
          }

          .certifications-grid {
            gap: 1.5rem;
          }

          .certification-card {
            padding: 1rem;
            width: 100px;
            height: 100px;
          }

          .cert-logo img {
            width: 60px;
            height: 60px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;