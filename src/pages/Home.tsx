import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, MapPin, Users } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web';

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
    'https://picsum.photos/1920/1080?random=1',
    'https://picsum.photos/1920/1080?random=2',
    'https://picsum.photos/1920/1080?random=3',
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
        image: 'https://picsum.photos/400/300?random=4',
        rating: 4.8,
        category: 'Main Course',
        prepTime: '15 min',
      },
      {
        id: '2',
        name: 'Rendang Padang',
        description: 'Slow-cooked beef in rich coconut curry with authentic spices',
        price: 65000,
        image: 'https://picsum.photos/400/300?random=5',
        rating: 4.9,
        category: 'Main Course',
        prepTime: '45 min',
      },
      {
        id: '3',
        name: 'Sate Ayam Madura',
        description: 'Grilled chicken skewers with peanut sauce and sweet soy',
        price: 35000,
        image: 'https://picsum.photos/400/300?random=6',
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

      <style>{`
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
          transition: opacity 1s ease-in-out;
        }

        .hero-slide.active {
          opacity: 1;
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
          background: linear-gradient(rgba(255, 248, 220, 0.9), rgba(245, 222, 179, 0.9)), url('https://picsum.photos/1000/600?random=7');
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
          background: linear-gradient(rgba(255, 248, 220, 0.8), rgba(245, 222, 179, 0.8)), url('https://picsum.photos/2000/1200?random=8');
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
          background: linear-gradient(rgba(255, 248, 220, 0.95), rgba(245, 222, 179, 0.95)), url('https://picsum.photos/1000/600?random=9');
          background-size: cover;
          background-position: center;
          border-radius: var(--border-radius-large);
          box-shadow: var(--shadow-light);
          overflow: hidden;
          transition: var(--transition);
        }

        .dish-card:hover {
          box-shadow: var(--shadow-medium);
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
          transition: transform 0.3s ease;
        }

        .dish-card:hover .dish-image {
          transform: scale(1.05);
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
        }
      `}</style>
    </div>
  );
};

export default Home;