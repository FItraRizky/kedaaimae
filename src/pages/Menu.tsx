import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, Clock, Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  prepTime: string;
  allergens: string[];
  dietary: string[];
  isSpicy: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
}

const Menu: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const categories = [
    'all',
    'appetizers',
    'main-courses',
    'desserts',
    'beverages',
    'vegetarian',
    'seafood',
    'meat',
  ];

  const dietaryOptions = [
    'vegetarian',
    'vegan',
    'gluten-free',
    'spicy',
  ];

  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Nasi Goreng Special',
      description: 'Traditional Indonesian fried rice with shrimp, chicken, and vegetables, served with fried egg and crackers',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'main-courses',
      rating: 4.8,
      prepTime: '15 min',
      allergens: ['shellfish', 'eggs', 'soy'],
      dietary: [],
      isSpicy: true,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true,
    },
    {
      id: '2',
      name: 'Rendang Padang',
      description: 'Slow-cooked beef in rich coconut curry with authentic Padang spices, served with steamed rice',
      price: 65000,
      image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'main-courses',
      rating: 4.9,
      prepTime: '45 min',
      allergens: ['coconut'],
      dietary: [],
      isSpicy: true,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true,
    },
    {
      id: '3',
      name: 'Gado-Gado Jakarta',
      description: 'Fresh vegetable salad with tofu, tempeh, and boiled eggs, topped with peanut sauce',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'appetizers',
      rating: 4.7,
      prepTime: '10 min',
      allergens: ['peanuts', 'eggs', 'soy'],
      dietary: ['vegetarian'],
      isSpicy: false,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true,
    },
    {
      id: '4',
      name: 'Sate Ayam Madura',
      description: 'Grilled chicken skewers marinated in sweet soy sauce, served with peanut sauce and rice cakes',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'appetizers',
      rating: 4.7,
      prepTime: '20 min',
      allergens: ['peanuts', 'soy'],
      dietary: [],
      isSpicy: false,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true,
    },
    {
      id: '5',
      name: 'Es Cendol',
      description: 'Traditional iced dessert with green rice flour jelly, coconut milk, and palm sugar syrup',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'desserts',
      rating: 4.6,
      prepTime: '5 min',
      allergens: ['coconut'],
      dietary: ['vegan'],
      isSpicy: false,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
    },
    {
      id: '6',
      name: 'Soto Ayam Lamongan',
      description: 'Clear chicken soup with turmeric, glass noodles, and fresh herbs, served with rice',
      price: 40000,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'main-courses',
      rating: 4.8,
      prepTime: '25 min',
      allergens: ['eggs'],
      dietary: [],
      isSpicy: false,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
    },
  ];

  const filteredItems = useMemo(() => {
    let filtered = menuItems;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (selectedDietary.length > 0) {
      filtered = filtered.filter((item) =>
        selectedDietary.every((diet) => {
          switch (diet) {
            case 'vegetarian':
              return item.isVegetarian;
            case 'vegan':
              return item.isVegan;
            case 'gluten-free':
              return item.isGlutenFree;
            case 'spicy':
              return item.isSpicy;
            default:
              return true;
          }
        })
      );
    }

    // Filter based on user's dietary preferences
    if (user?.preferences.dietary.length) {
      filtered = filtered.filter((item) => {
        return user.preferences.dietary.every((pref) => {
          switch (pref) {
            case 'vegetarian':
              return item.isVegetarian;
            case 'vegan':
              return item.isVegan;
            case 'gluten-free':
              return item.isGlutenFree;
            default:
              return true;
          }
        });
      });
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedDietary, sortBy, user]);

  const handleAddToCart = (item: MenuItem) => {
    // Check for allergens based on user preferences
    if (user?.preferences.allergies.length) {
      const hasAllergen = user.preferences.allergies.some((allergen) =>
        item.allergens.includes(allergen.toLowerCase())
      );
      
      if (hasAllergen) {
        toast.error(`Warning: This item contains ${item.allergens.join(', ')}`);
        return;
      }
    }

    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
    });
  };

  const toggleDietary = (option: string) => {
    setSelectedDietary((prev) =>
      prev.includes(option)
        ? prev.filter((d) => d !== option)
        : [...prev, option]
    );
  };

  return (
    <div className="menu-page">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="menu-header"
        >
          <h1>Our Menu</h1>
          <p>Discover authentic Indonesian flavors crafted with love and tradition</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="menu-controls"
        >
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            Filters
          </button>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="filters-panel"
            >
              <div className="filter-section">
                <h3>Categories</h3>
                <div className="filter-tags">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`filter-tag ${
                        selectedCategory === category ? 'active' : ''
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h3>Dietary Options</h3>
                <div className="filter-checkboxes">
                  {dietaryOptions.map((option) => (
                    <label key={option} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedDietary.includes(option)}
                        onChange={() => toggleDietary(option)}
                      />
                      <span className="checkmark"></span>
                      {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h3>Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="results-info">
          <p>
            Showing {filteredItems.length} of {menuItems.length} dishes
          </p>
        </div>

        {/* Menu Grid */}
        <motion.div
          className="menu-grid"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                className="menu-item-card"
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <div className="menu-item-image">
                  <img src={item.image} alt={item.name} />
                  <div className="menu-item-badges">
                    {item.isVegetarian && <span className="badge vegetarian">Vegetarian</span>}
                    {item.isVegan && <span className="badge vegan">Vegan</span>}
                    {item.isGlutenFree && <span className="badge gluten-free">Gluten-Free</span>}
                    {item.isSpicy && <span className="badge spicy">🌶️ Spicy</span>}
                  </div>
                </div>

                <div className="menu-item-content">
                  <div className="menu-item-header">
                    <h3 className="menu-item-name">{item.name}</h3>
                    <div className="menu-item-rating">
                      <Star size={16} className="star-icon" />
                      <span>{item.rating}</span>
                    </div>
                  </div>

                  <p className="menu-item-description">{item.description}</p>

                  <div className="menu-item-meta">
                    <div className="menu-item-time">
                      <Clock size={14} />
                      <span>{item.prepTime}</span>
                    </div>
                    <div className="menu-item-allergens">
                      Allergens: {item.allergens.join(', ') || 'None'}
                    </div>
                  </div>

                  <div className="menu-item-footer">
                    <span className="menu-item-price">
                      Rp {item.price.toLocaleString()}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart size={16} />
                      <span>Add to Cart</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="empty-state"
          >
            <h3>No dishes found</h3>
            <p>Try adjusting your filters or search terms</p>
          </motion.div>
        )}
      </div>

      <style>{`
        .menu-page {
          padding: 2rem 0;
          background: var(--bg-light);
        }

        .menu-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .menu-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: var(--text-dark);
        }

        .menu-header p {
          font-size: 1.2rem;
          color: var(--text-light);
        }

        .menu-controls {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          align-items: center;
        }

        .search-bar {
          flex: 1;
          display: flex;
          align-items: center;
          background: white;
          border-radius: var(--border-radius);
          padding: 0.75rem 1rem;
          box-shadow: var(--shadow-light);
        }

        .search-bar input {
          flex: 1;
          border: none;
          outline: none;
          margin-left: 0.5rem;
          font-size: 1rem;
        }

        .filter-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
        }

        .filter-toggle:hover {
          background: #f5f5f5;
        }

        .filters-panel {
          background: linear-gradient(rgba(255, 248, 220, 0.95), rgba(245, 222, 179, 0.95)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80');
          background-size: cover;
          background-position: center;
          border-radius: var(--border-radius-large);
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: var(--shadow-light);
          overflow: hidden;
        }

        .filter-section {
          margin-bottom: 1.5rem;
        }

        .filter-section:last-child {
          margin-bottom: 0;
        }

        .filter-section h3 {
          font-size: 1.1rem;
          margin-bottom: 1rem;
          color: var(--text-dark);
        }

        .filter-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .filter-tag {
          padding: 0.5rem 1rem;
          background: #f5f5f5;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          transition: var(--transition);
          font-size: 0.9rem;
        }

        .filter-tag.active {
          background: var(--primary-color);
          color: var(--bg-light);
        }

        .filter-checkboxes {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .checkbox-label input[type="checkbox"] {
          margin: 0;
        }

        .sort-select {
          padding: 0.5rem;
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          background: white;
        }

        .results-info {
          margin-bottom: 1rem;
          color: var(--text-light);
        }

        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        .menu-item-card {
          background: linear-gradient(rgba(255, 248, 220, 0.95), rgba(245, 222, 179, 0.95)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80');
          background-size: cover;
          background-position: center;
          border-radius: var(--border-radius-large);
          box-shadow: var(--shadow-light);
          overflow: hidden;
          transition: var(--transition);
        }

        .menu-item-card:hover {
          box-shadow: var(--shadow-medium);
        }

        .menu-item-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .menu-item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .menu-item-card:hover .menu-item-image img {
          transform: scale(1.05);
        }

        .menu-item-badges {
          position: absolute;
          top: 1rem;
          left: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .badge {
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .badge.vegetarian {
          background: #4caf50;
          color: white;
        }

        .badge.vegan {
          background: #2e7d32;
          color: white;
        }

        .badge.gluten-free {
          background: #ff9800;
          color: white;
        }

        .badge.spicy {
          background: #f44336;
          color: white;
        }

        .menu-item-content {
          padding: 1.5rem;
        }

        .menu-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }

        .menu-item-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-dark);
          margin: 0;
        }

        .menu-item-rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--accent-color);
          font-weight: 600;
        }

        .star-icon {
          color: var(--accent-color);
        }

        .menu-item-description {
          color: var(--text-light);
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .menu-item-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: var(--text-light);
        }

        .menu-item-time {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .menu-item-allergens {
          font-size: 0.8rem;
          color: #000000;
        }

        .menu-item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .menu-item-price {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .add-to-cart-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
          font-size: 0.9rem;
          font-weight: 600;
        }

        .add-to-cart-btn:hover {
          background: #e55a2b;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          color: var(--text-light);
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--text-dark);
        }

        @media (max-width: 768px) {
          .menu-controls {
            flex-direction: column;
          }

          .search-bar {
            width: 100%;
          }

          .menu-grid {
            grid-template-columns: 1fr;
          }

          .filters-panel {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Menu;