import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, Heart, Share2, Download, X, ChevronLeft, ChevronRight, Eye, Camera, Calendar, User } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web';

interface GalleryImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
  photographer: string;
  date: string;
  likes: number;
  views: number;
  isLiked: boolean;
  featured: boolean;
}

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [isImmersiveMode, setIsImmersiveMode] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const categories = ['all', 'appetizers', 'main-courses', 'desserts', 'beverages', 'specials', 'behind-scenes'];

  // Mock data with Unsplash images
  useEffect(() => {
    const mockImages: GalleryImage[] = [
      {
        id: '1',
        title: 'Signature Nasi Rendang',
        description: 'Our most popular dish featuring tender beef rendang with aromatic jasmine rice',
        imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'main-courses',
        tags: ['spicy', 'traditional', 'beef', 'signature'],
        photographer: 'Chef Ahmad',
        date: '2024-01-15',
        likes: 245,
        views: 1250,
        isLiked: false,
        featured: true
      },
      {
        id: '2',
        title: 'Fresh Spring Rolls',
        description: 'Crispy spring rolls filled with fresh vegetables and served with sweet chili sauce',
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d51a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'appetizers',
        tags: ['fresh', 'vegetarian', 'crispy', 'healthy'],
        photographer: 'Sarah Lee',
        date: '2024-01-14',
        likes: 189,
        views: 890,
        isLiked: true,
        featured: false
      },
      {
        id: '3',
        title: 'Chocolate Lava Cake',
        description: 'Decadent chocolate cake with molten center, served with vanilla ice cream',
        imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'desserts',
        tags: ['chocolate', 'dessert', 'warm', 'indulgent'],
        photographer: 'Maria Santos',
        date: '2024-01-13',
        likes: 312,
        views: 1580,
        isLiked: false,
        featured: true
      },
      {
        id: '4',
        title: 'Tropical Smoothie Bowl',
        description: 'Refreshing acai bowl topped with fresh fruits, granola, and coconut flakes',
        imageUrl: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'beverages',
        tags: ['healthy', 'tropical', 'fresh', 'colorful'],
        photographer: 'David Kim',
        date: '2024-01-12',
        likes: 156,
        views: 720,
        isLiked: true,
        featured: false
      },
      {
        id: '5',
        title: 'Grilled Salmon Teriyaki',
        description: 'Fresh Atlantic salmon glazed with homemade teriyaki sauce and sesame seeds',
        imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'main-courses',
        tags: ['salmon', 'grilled', 'healthy', 'japanese'],
        photographer: 'Chef Tanaka',
        date: '2024-01-11',
        likes: 278,
        views: 1340,
        isLiked: false,
        featured: true
      },
      {
        id: '6',
        title: 'Kitchen in Action',
        description: 'Behind the scenes: Our chefs preparing the daily specials',
        imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'behind-scenes',
        tags: ['kitchen', 'chefs', 'preparation', 'teamwork'],
        photographer: 'Restaurant Team',
        date: '2024-01-10',
        likes: 98,
        views: 450,
        isLiked: false,
        featured: false
      },
      {
        id: '7',
        title: 'Artisan Coffee Latte',
        description: 'Perfectly crafted latte with beautiful latte art, made from premium beans',
        imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'beverages',
        tags: ['coffee', 'latte-art', 'premium', 'artisan'],
        photographer: 'Barista Joe',
        date: '2024-01-09',
        likes: 203,
        views: 980,
        isLiked: true,
        featured: false
      },
      {
        id: '8',
        title: 'Chef\'s Special Platter',
        description: 'Today\'s special featuring a variety of our signature dishes',
        imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'specials',
        tags: ['variety', 'special', 'signature', 'platter'],
        photographer: 'Chef Ahmad',
        date: '2024-01-08',
        likes: 367,
        views: 1890,
        isLiked: false,
        featured: true
      }
    ];

    setTimeout(() => {
      setImages(mockImages);
      setFilteredImages(mockImages);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter images based on search and category
  useEffect(() => {
    let filtered = images;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(image => image.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(image => 
        image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredImages(filtered);
  }, [images, selectedCategory, searchTerm]);

  const handleLike = (imageId: string) => {
    setImages(prev => prev.map(img => 
      img.id === imageId 
        ? { ...img, isLiked: !img.isLiked, likes: img.isLiked ? img.likes - 1 : img.likes + 1 }
        : img
    ));
  };

  const openImmersiveMode = (image: GalleryImage) => {
    setSelectedImage(image);
    setCurrentImageIndex(filteredImages.findIndex(img => img.id === image.id));
    setIsImmersiveMode(true);
    document.body.style.overflow = 'hidden';
  };

  const closeImmersiveMode = () => {
    setIsImmersiveMode(false);
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (currentImageIndex - 1 + filteredImages.length) % filteredImages.length
      : (currentImageIndex + 1) % filteredImages.length;
    
    setCurrentImageIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  const fadeIn = useSpring({
    opacity: loading ? 0 : 1,
    transform: loading ? 'translateY(20px)' : 'translateY(0px)',
    config: { tension: 280, friction: 60 }
  });

  if (loading) {
    return (
      <div className="gallery-loading">
        <div className="loading-spinner"></div>
        <p>Loading gallery...</p>
      </div>
    );
  }

  return (
    <animated.div style={fadeIn} className="gallery-page">
      {/* Header */}
      <div className="gallery-header">
        <div className="header-content">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Food Gallery</h1>
            <p>Discover the artistry behind our culinary creations</p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div 
            className="gallery-controls"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="search-bar">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>

            <div className="view-controls">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={20} />
              </button>
              <button
                className={`view-btn ${viewMode === 'masonry' ? 'active' : ''}`}
                onClick={() => setViewMode('masonry')}
              >
                <List size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Featured Images */}
      {selectedCategory === 'all' && (
        <motion.section 
          className="featured-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2>Featured</h2>
          <div className="featured-grid">
            {filteredImages.filter(img => img.featured).map((image, index) => (
              <motion.div
                key={image.id}
                className="featured-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => openImmersiveMode(image)}
              >
                <div className="image-container">
                  <img src={image.imageUrl} alt={image.title} />
                  <div className="image-overlay">
                    <div className="overlay-content">
                      <h3>{image.title}</h3>
                      <p>{image.description}</p>
                      <div className="image-stats">
                        <span><Heart size={16} /> {image.likes}</span>
                        <span><Eye size={16} /> {image.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Gallery Grid */}
      <motion.section 
        className="gallery-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="gallery-info">
          <h2>All Images ({filteredImages.length})</h2>
        </div>

        <div className={`gallery-grid ${viewMode}`}>
          <AnimatePresence>
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                className="gallery-item"
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <div className="image-wrapper">
                  <img 
                    src={image.imageUrl} 
                    alt={image.title}
                    onClick={() => openImmersiveMode(image)}
                  />
                  <div className="image-actions">
                    <button 
                      className={`like-btn ${image.isLiked ? 'liked' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(image.id);
                      }}
                    >
                      <Heart size={18} fill={image.isLiked ? 'currentColor' : 'none'} />
                    </button>
                    <button className="share-btn">
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="image-info">
                  <h3>{image.title}</h3>
                  <div className="image-meta">
                    <span className="photographer">
                      <Camera size={14} /> {image.photographer}
                    </span>
                    <span className="date">
                      <Calendar size={14} /> {new Date(image.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="image-stats">
                    <span><Heart size={14} /> {image.likes}</span>
                    <span><Eye size={14} /> {image.views}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Immersive Mode Modal */}
      <AnimatePresence>
        {isImmersiveMode && selectedImage && (
          <motion.div
            className="immersive-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="immersive-backdrop" onClick={closeImmersiveMode} />
            
            <motion.div
              className="immersive-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Navigation */}
              <div className="immersive-nav">
                <button className="nav-btn prev" onClick={() => navigateImage('prev')}>
                  <ChevronLeft size={24} />
                </button>
                <button className="nav-btn next" onClick={() => navigateImage('next')}>
                  <ChevronRight size={24} />
                </button>
                <button className="close-btn" onClick={closeImmersiveMode}>
                  <X size={24} />
                </button>
              </div>

              {/* Image */}
              <div className="immersive-image">
                <img src={selectedImage.imageUrl} alt={selectedImage.title} />
              </div>

              {/* Info Panel */}
              <div className="immersive-info">
                <div className="info-header">
                  <h2>{selectedImage.title}</h2>
                  <div className="info-actions">
                    <button 
                      className={`action-btn like ${selectedImage.isLiked ? 'liked' : ''}`}
                      onClick={() => handleLike(selectedImage.id)}
                    >
                      <Heart size={20} fill={selectedImage.isLiked ? 'currentColor' : 'none'} />
                      {selectedImage.likes}
                    </button>
                    <button className="action-btn share">
                      <Share2 size={20} />
                    </button>
                    <button className="action-btn download">
                      <Download size={20} />
                    </button>
                  </div>
                </div>
                
                <p className="description">{selectedImage.description}</p>
                
                <div className="info-details">
                  <div className="detail-item">
                    <User size={16} />
                    <span>Photographer: {selectedImage.photographer}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>Date: {new Date(selectedImage.date).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <Eye size={16} />
                    <span>Views: {selectedImage.views}</span>
                  </div>
                </div>
                
                <div className="tags">
                  {selectedImage.tags.map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .gallery-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .gallery-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: 1rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e0e0e0;
          border-top: 3px solid var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .gallery-header {
          background: white;
          padding: 2rem 0;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .gallery-header h1 {
          font-size: 2.5rem;
          color: var(--text-dark);
          margin: 0 0 0.5rem 0;
          text-align: center;
        }

        .gallery-header p {
          color: var(--text-light);
          font-size: 1.1rem;
          text-align: center;
          margin-bottom: 2rem;
        }

        .gallery-controls {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .search-bar {
          position: relative;
          max-width: 400px;
          margin: 0 auto;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
        }

        .search-bar input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius-large);
          font-size: 1rem;
          transition: var(--transition);
        }

        .search-bar input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(255, 107, 74, 0.1);
        }

        .category-filters {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .category-btn {
          padding: 0.75rem 1.5rem;
          border: 1px solid #e0e0e0;
          background: white;
          border-radius: var(--border-radius-large);
          cursor: pointer;
          transition: var(--transition);
          font-weight: 500;
          color: var(--text-dark);
        }

        .category-btn:hover {
          border-color: var(--primary-color);
          color: var(--primary-color);
        }

        .category-btn.active {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .view-controls {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
        }

        .view-btn {
          padding: 0.75rem;
          border: 1px solid #e0e0e0;
          background: white;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .view-btn:hover {
          border-color: var(--primary-color);
          color: var(--primary-color);
        }

        .view-btn.active {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .featured-section {
          max-width: 1200px;
          margin: 0 auto 3rem auto;
          padding: 0 2rem;
        }

        .featured-section h2 {
          font-size: 2rem;
          color: var(--text-dark);
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .featured-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .featured-card {
          border-radius: var(--border-radius-large);
          overflow: hidden;
          box-shadow: var(--shadow-medium);
          cursor: pointer;
          transition: var(--transition);
        }

        .featured-card:hover {
          box-shadow: var(--shadow-large);
        }

        .image-container {
          position: relative;
          height: 250px;
          overflow: hidden;
        }

        .image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition);
        }

        .featured-card:hover .image-container img {
          transform: scale(1.05);
        }

        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
          color: white;
          padding: 2rem 1.5rem 1.5rem;
          transform: translateY(100%);
          transition: var(--transition);
        }

        .featured-card:hover .image-overlay {
          transform: translateY(0);
        }

        .overlay-content h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.2rem;
        }

        .overlay-content p {
          margin: 0 0 1rem 0;
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .image-stats {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
        }

        .image-stats span {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .gallery-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem 3rem;
        }

        .gallery-info {
          margin-bottom: 2rem;
        }

        .gallery-info h2 {
          font-size: 1.8rem;
          color: var(--text-dark);
          text-align: center;
        }

        .gallery-grid {
          display: grid;
          gap: 2rem;
        }

        .gallery-grid.grid {
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        }

        .gallery-grid.masonry {
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          grid-auto-rows: 10px;
        }

        .gallery-item {
          background: white;
          border-radius: var(--border-radius-large);
          overflow: hidden;
          box-shadow: var(--shadow-light);
          transition: var(--transition);
        }

        .gallery-item:hover {
          box-shadow: var(--shadow-medium);
        }

        .image-wrapper {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          cursor: pointer;
          transition: var(--transition);
        }

        .image-wrapper:hover img {
          transform: scale(1.05);
        }

        .image-actions {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          gap: 0.5rem;
          opacity: 0;
          transition: var(--transition);
        }

        .image-wrapper:hover .image-actions {
          opacity: 1;
        }

        .like-btn,
        .share-btn {
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
          color: var(--text-dark);
        }

        .like-btn:hover,
        .share-btn:hover {
          background: white;
          transform: scale(1.1);
        }

        .like-btn.liked {
          color: var(--accent-color);
        }

        .image-info {
          padding: 1.5rem;
        }

        .image-info h3 {
          margin: 0 0 0.75rem 0;
          color: var(--text-dark);
          font-size: 1.1rem;
        }

        .image-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          font-size: 0.8rem;
          color: var(--text-light);
        }

        .image-meta span {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .image-info .image-stats {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
          color: var(--text-light);
        }

        .immersive-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .immersive-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
        }

        .immersive-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          display: grid;
          grid-template-columns: 1fr 400px;
          background: white;
          border-radius: var(--border-radius-large);
          overflow: hidden;
        }

        .immersive-nav {
          position: absolute;
          top: 1rem;
          right: 1rem;
          z-index: 10;
          display: flex;
          gap: 0.5rem;
        }

        .nav-btn,
        .close-btn {
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }

        .nav-btn:hover,
        .close-btn:hover {
          background: rgba(0, 0, 0, 0.9);
        }

        .nav-btn.prev {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
        }

        .nav-btn.next {
          position: absolute;
          right: 420px;
          top: 50%;
          transform: translateY(-50%);
        }

        .immersive-image {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
          min-height: 500px;
        }

        .immersive-image img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .immersive-info {
          padding: 2rem;
          background: white;
          overflow-y: auto;
        }

        .info-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .info-header h2 {
          margin: 0;
          color: var(--text-dark);
          font-size: 1.5rem;
          flex: 1;
        }

        .info-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          background: #f8f9fa;
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          padding: 0.5rem;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
        }

        .action-btn:hover {
          background: #e9ecef;
        }

        .action-btn.like.liked {
          color: var(--accent-color);
        }

        .description {
          color: var(--text-dark);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .info-details {
          margin-bottom: 1.5rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          color: var(--text-light);
          font-size: 0.9rem;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          background: var(--primary-color);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: var(--border-radius-large);
          font-size: 0.8rem;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .gallery-controls {
            padding: 0 1rem;
          }

          .category-filters {
            overflow-x: auto;
            justify-content: flex-start;
            padding-bottom: 0.5rem;
          }

          .featured-grid {
            grid-template-columns: 1fr;
          }

          .gallery-grid {
            grid-template-columns: 1fr;
          }

          .immersive-content {
            grid-template-columns: 1fr;
            max-width: 95vw;
            max-height: 95vh;
          }

          .nav-btn.next {
            right: 1rem;
          }

          .immersive-info {
            max-height: 300px;
          }
        }
      `}</style>
    </animated.div>
  );
};

export default Gallery;