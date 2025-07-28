import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, Heart, Clock, Bell, MapPin, Phone, Mail, Camera, Edit3, Save, X, Calendar, Star, ShoppingBag, Award, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

interface OrderHistory {
  id: string;
  date: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'completed' | 'pending' | 'cancelled';
  rating?: number;
}

interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
}

const Profile: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { orderHistory } = useCart();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    preferences: {
      dietary: user?.preferences?.dietary || [],
      allergies: user?.preferences?.allergies || [],
      spiceLevel: user?.preferences?.spiceLevel || 'medium',
    },
    notifications: {
      email: user?.notifications?.email ?? true,
      push: user?.notifications?.push ?? true,
      sms: user?.notifications?.sms ?? false,
    },
  });

  const [orderHistoryData] = useState<OrderHistory[]>([
    {
      id: 'ORD-001',
      date: '2024-01-15T18:30:00Z',
      items: [
        { name: 'Nasi Goreng Special', quantity: 2, price: 45000 },
        { name: 'Es Cendol', quantity: 1, price: 15000 },
      ],
      total: 105000,
      status: 'completed',
      rating: 5,
    },
    {
      id: 'ORD-002',
      date: '2024-01-12T12:15:00Z',
      items: [
        { name: 'Rendang Padang', quantity: 1, price: 65000 },
        { name: 'Gado-Gado Jakarta', quantity: 1, price: 35000 },
      ],
      total: 100000,
      status: 'completed',
      rating: 4,
    },
    {
      id: 'ORD-003',
      date: '2024-01-10T19:45:00Z',
      items: [
        { name: 'Sate Ayam Madura', quantity: 3, price: 35000 },
      ],
      total: 105000,
      status: 'completed',
      rating: 5,
    },
  ]);

  const [favorites] = useState<FavoriteItem[]>([
    {
      id: '1',
      name: 'Nasi Goreng Special',
      price: 45000,
      image: 'https://picsum.photos/300/200?random=21',
      category: 'main-courses',
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Rendang Padang',
      price: 65000,
      image: 'https://picsum.photos/300/200?random=22',
      category: 'main-courses',
      rating: 4.9,
    },
    {
      id: '5',
      name: 'Es Cendol',
      price: 15000,
      image: 'https://picsum.photos/300/200?random=23',
      category: 'desserts',
      rating: 4.6,
    },
  ]);

  const dietaryOptions = [
    'vegetarian',
    'vegan',
    'gluten-free',
    'dairy-free',
    'nut-free',
  ];

  const allergyOptions = [
    'peanuts',
    'shellfish',
    'eggs',
    'dairy',
    'soy',
    'wheat',
    'fish',
    'coconut',
  ];

  const spiceLevels = [
    { value: 'mild', label: 'Mild 🌶️' },
    { value: 'medium', label: 'Medium 🌶️🌶️' },
    { value: 'hot', label: 'Hot 🌶️🌶️🌶️' },
    { value: 'extra-hot', label: 'Extra Hot 🌶️🌶️🌶️🌶️' },
  ];

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editForm);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      preferences: {
        dietary: user?.preferences?.dietary || [],
        allergies: user?.preferences?.allergies || [],
        spiceLevel: user?.preferences?.spiceLevel || 'medium',
      },
      notifications: {
        email: user?.notifications?.email ?? true,
        push: user?.notifications?.push ?? true,
        sms: user?.notifications?.sms ?? false,
      },
    });
    setIsEditing(false);
  };

  const toggleDietary = (option: string) => {
    setEditForm(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        dietary: prev.preferences.dietary.includes(option)
          ? prev.preferences.dietary.filter(d => d !== option)
          : [...prev.preferences.dietary, option],
      },
    }));
  };

  const toggleAllergy = (option: string) => {
    setEditForm(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        allergies: prev.preferences.allergies.includes(option)
          ? prev.preferences.allergies.filter(a => a !== option)
          : [...prev.preferences.allergies, option],
      },
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4caf50';
      case 'pending':
        return '#ff9800';
      case 'cancelled':
        return '#f44336';
      default:
        return '#666';
    }
  };

  const totalSpent = orderHistoryData.reduce((sum, order) => sum + order.total, 0);
  const averageRating = orderHistoryData
    .filter(order => order.rating)
    .reduce((sum, order) => sum + (order.rating || 0), 0) / orderHistoryData.filter(order => order.rating).length;

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="login-prompt">
            <h2>Please log in to view your profile</h2>
            <p>Access your order history, favorites, and personalized settings</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="profile-header"
        >
          <div className="profile-avatar">
            <img src={user.avatar} alt={user.name} />
            <button className="avatar-edit-btn">
              <Camera size={16} />
            </button>
          </div>
          <div className="profile-info">
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            <div className="profile-stats">
              <div className="stat">
                <ShoppingBag size={16} />
                <span>{orderHistoryData.length} Orders</span>
              </div>
              <div className="stat">
                <Heart size={16} />
                <span>{favorites.length} Favorites</span>
              </div>
              <div className="stat">
                <Award size={16} />
                <span>Level {user.level}</span>
              </div>
            </div>
          </div>
          <div className="profile-actions">
            {!isEditing ? (
              <button
                className="edit-btn"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button className="save-btn" onClick={handleSaveProfile}>
                  <Save size={16} />
                  Save
                </button>
                <button className="cancel-btn" onClick={handleCancelEdit}>
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="profile-tabs"
        >
          <button
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={20} />
            Profile
          </button>
          <button
            className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Clock size={20} />
            Order History
          </button>
          <button
            className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <Heart size={20} />
            Favorites
          </button>
          <button
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} />
            Settings
          </button>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="tab-content"
            >
              <div className="profile-content">
                <div className="profile-section">
                  <h3>Personal Information</h3>
                  <div className="profile-form">
                    <div className="form-group">
                      <label>Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      ) : (
                        <p>{user.name}</p>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        />
                      ) : (
                        <p>{user.email}</p>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      ) : (
                        <p>{user.phone || 'Not provided'}</p>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Address</label>
                      {isEditing ? (
                        <textarea
                          value={editForm.address}
                          onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                          rows={3}
                        />
                      ) : (
                        <p>{user.address || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="profile-section">
                  <h3>Dietary Preferences</h3>
                  <div className="preferences-grid">
                    {dietaryOptions.map(option => (
                      <label key={option} className="preference-item">
                        <input
                          type="checkbox"
                          checked={isEditing 
                            ? editForm.preferences.dietary.includes(option)
                            : user.preferences?.dietary?.includes(option) || false
                          }
                          onChange={() => isEditing && toggleDietary(option)}
                          disabled={!isEditing}
                        />
                        <span className="checkmark"></span>
                        {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="profile-section">
                  <h3>Allergies</h3>
                  <div className="preferences-grid">
                    {allergyOptions.map(option => (
                      <label key={option} className="preference-item">
                        <input
                          type="checkbox"
                          checked={isEditing 
                            ? editForm.preferences.allergies.includes(option)
                            : user.preferences?.allergies?.includes(option) || false
                          }
                          onChange={() => isEditing && toggleAllergy(option)}
                          disabled={!isEditing}
                        />
                        <span className="checkmark"></span>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="profile-section">
                  <h3>Spice Preference</h3>
                  <div className="spice-levels">
                    {spiceLevels.map(level => (
                      <label key={level.value} className="spice-level">
                        <input
                          type="radio"
                          name="spiceLevel"
                          value={level.value}
                          checked={isEditing 
                            ? editForm.preferences.spiceLevel === level.value
                            : user.preferences?.spiceLevel === level.value
                          }
                          onChange={(e) => isEditing && setEditForm(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              spiceLevel: e.target.value,
                            },
                          }))}
                          disabled={!isEditing}
                        />
                        <span className="radio-mark"></span>
                        {level.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="tab-content"
            >
              <div className="orders-summary">
                <div className="summary-card">
                  <TrendingUp size={24} />
                  <div>
                    <h4>Total Spent</h4>
                    <p>Rp {totalSpent.toLocaleString()}</p>
                  </div>
                </div>
                <div className="summary-card">
                  <ShoppingBag size={24} />
                  <div>
                    <h4>Total Orders</h4>
                    <p>{orderHistoryData.length}</p>
                  </div>
                </div>
                <div className="summary-card">
                  <Star size={24} />
                  <div>
                    <h4>Average Rating</h4>
                    <p>{averageRating.toFixed(1)} ⭐</p>
                  </div>
                </div>
              </div>

              <div className="orders-list">
                {orderHistoryData.map(order => (
                  <motion.div
                    key={order.id}
                    className="order-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="order-header">
                      <div>
                        <h4>Order #{order.id}</h4>
                        <p>{formatDate(order.date)}</p>
                      </div>
                      <div className="order-status">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        {order.rating && (
                          <div className="order-rating">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < order.rating! ? 'star-filled' : 'star-empty'}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="order-items">
                      {order.items.map((item, index) => (
                        <div key={index} className="order-item">
                          <span>{item.name}</span>
                          <span>x{item.quantity}</span>
                          <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="order-total">
                      <strong>Total: Rp {order.total.toLocaleString()}</strong>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'favorites' && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="tab-content"
            >
              <div className="favorites-grid">
                {favorites.map(item => (
                  <motion.div
                    key={item.id}
                    className="favorite-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="favorite-image">
                      <img src={item.image} alt={item.name} />
                      <button className="remove-favorite">
                        <Heart size={16} className="heart-filled" />
                      </button>
                    </div>
                    <div className="favorite-content">
                      <h4>{item.name}</h4>
                      <div className="favorite-meta">
                        <span className="price">Rp {item.price.toLocaleString()}</span>
                        <div className="rating">
                          <Star size={14} className="star-filled" />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                      <button className="add-to-cart-btn">
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="tab-content"
            >
              <div className="settings-content">
                <div className="settings-section">
                  <h3>Notifications</h3>
                  <div className="notification-settings">
                    <label className="notification-item">
                      <input
                        type="checkbox"
                        checked={isEditing 
                          ? editForm.notifications.email
                          : user.notifications?.email ?? false
                        }
                        onChange={(e) => isEditing && setEditForm(prev => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            email: e.target.checked,
                          },
                        }))}
                        disabled={!isEditing}
                      />
                      <span className="checkmark"></span>
                      <div>
                        <strong>Email Notifications</strong>
                        <p>Receive order updates and promotions via email</p>
                      </div>
                    </label>
                    <label className="notification-item">
                      <input
                        type="checkbox"
                        checked={isEditing 
                          ? editForm.notifications.push
                          : user.notifications?.push ?? false
                        }
                        onChange={(e) => isEditing && setEditForm(prev => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            push: e.target.checked,
                          },
                        }))}
                        disabled={!isEditing}
                      />
                      <span className="checkmark"></span>
                      <div>
                        <strong>Push Notifications</strong>
                        <p>Get instant updates on your device</p>
                      </div>
                    </label>
                    <label className="notification-item">
                      <input
                        type="checkbox"
                        checked={isEditing 
                          ? editForm.notifications.sms
                          : user.notifications?.sms ?? false
                        }
                        onChange={(e) => isEditing && setEditForm(prev => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            sms: e.target.checked,
                          },
                        }))}
                        disabled={!isEditing}
                      />
                      <span className="checkmark"></span>
                      <div>
                        <strong>SMS Notifications</strong>
                        <p>Receive important updates via text message</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="settings-section">
                  <h3>Account Actions</h3>
                  <div className="account-actions">
                    <button className="action-btn secondary">
                      Change Password
                    </button>
                    <button className="action-btn secondary">
                      Download Data
                    </button>
                    <button className="action-btn danger" onClick={logout}>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .profile-page {
          padding: 2rem 0;
          background: var(--bg-light);
          min-height: 100vh;
        }

        .login-prompt {
          text-align: center;
          padding: 4rem 2rem;
          background: linear-gradient(rgba(255, 248, 220, 0.95), rgba(245, 222, 179, 0.95)), url('https://picsum.photos/1000/600?random=24');
          background-size: cover;
          background-position: center;
          border-radius: var(--border-radius-large);
          box-shadow: var(--shadow-light);
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 2rem;
          background: linear-gradient(rgba(255, 248, 220, 0.95), rgba(245, 222, 179, 0.95)), url('https://picsum.photos/1000/600?random=25');
          background-size: cover;
          background-position: center;
          padding: 2rem;
          border-radius: var(--border-radius-large);
          box-shadow: var(--shadow-light);
          margin-bottom: 2rem;
        }

        .profile-avatar {
          position: relative;
        }

        .profile-avatar img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
        }

        .avatar-edit-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          background: var(--primary-color);
          color: var(--bg-light);
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 12px;
        }

        .profile-info {
          flex: 1;
        }

        .profile-info h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: var(--text-dark);
        }

        .profile-info p {
          color: var(--text-light);
          margin-bottom: 1rem;
        }

        .profile-stats {
          display: flex;
          gap: 2rem;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-light);
        }

        .profile-actions {
          display: flex;
          gap: 1rem;
        }

        .edit-btn, .save-btn, .cancel-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
          font-weight: 600;
        }

        .edit-btn {
          background: var(--primary-color);
          color: white;
        }

        .save-btn {
          background: #4caf50;
          color: white;
        }

        .cancel-btn {
          background: #f44336;
          color: white;
        }

        .profile-tabs {
          display: flex;
          background: linear-gradient(rgba(255, 248, 220, 0.95), rgba(245, 222, 179, 0.95)), url('https://picsum.photos/1000/600?random=26');
          background-size: cover;
          background-position: center;
          border-radius: var(--border-radius-large);
          padding: 1rem;
          margin-bottom: 2rem;
          box-shadow: var(--shadow-light);
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
          font-weight: 600;
          color: var(--text-light);
          flex: 1;
          justify-content: center;
        }

        .tab.active {
          background: var(--primary-color);
          color: white;
        }

        .tab:hover:not(.active) {
          background: #f5f5f5;
        }

        .tab-content {
          background: linear-gradient(rgba(255, 248, 220, 0.95), rgba(245, 222, 179, 0.95)), url('https://picsum.photos/1000/600?random=27');
          background-size: cover;
          background-position: center;
          border-radius: var(--border-radius-large);
          padding: 2rem;
          box-shadow: var(--shadow-light);
        }

        .profile-section {
          margin-bottom: 2rem;
        }

        .profile-section:last-child {
          margin-bottom: 0;
        }

        .profile-section h3 {
          font-size: 1.3rem;
          margin-bottom: 1rem;
          color: var(--text-dark);
        }

        .profile-form {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 600;
          color: var(--text-dark);
        }

        .form-group input,
        .form-group textarea {
          padding: 0.75rem;
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          font-size: 1rem;
        }

        .form-group p {
          color: var(--text-light);
          margin: 0;
        }

        .preferences-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .preference-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: var(--border-radius);
          transition: var(--transition);
        }

        .preference-item:hover {
          background: #f5f5f5;
        }

        .preference-item input[type="checkbox"] {
          margin: 0;
        }

        .spice-levels {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .spice-level {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: var(--border-radius);
          transition: var(--transition);
        }

        .spice-level:hover {
          background: #f5f5f5;
        }

        .orders-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .summary-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: var(--border-radius);
        }

        .summary-card h4 {
          margin: 0 0 0.25rem 0;
          color: var(--text-dark);
        }

        .summary-card p {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .order-card {
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          padding: 1.5rem;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .order-header h4 {
          margin: 0 0 0.25rem 0;
          color: var(--text-dark);
        }

        .order-header p {
          margin: 0;
          color: var(--text-light);
          font-size: 0.9rem;
        }

        .order-status {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          color: white;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .order-rating {
          display: flex;
          gap: 0.125rem;
        }

        .star-filled {
          color: var(--accent-color);
        }

        .star-empty {
          color: #000000;
        }

        .order-items {
          margin-bottom: 1rem;
        }

        .order-item {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 1rem;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .order-total {
          text-align: right;
          color: var(--primary-color);
        }

        .favorites-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .favorite-card {
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          overflow: hidden;
          transition: var(--transition);
        }

        .favorite-card:hover {
          box-shadow: var(--shadow-medium);
        }

        .favorite-image {
          position: relative;
          height: 150px;
          overflow: hidden;
        }

        .favorite-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-favorite {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .heart-filled {
          color: var(--primary-color);
        }

        .favorite-content {
          padding: 1rem;
        }

        .favorite-content h4 {
          margin: 0 0 0.5rem 0;
          color: var(--text-dark);
        }

        .favorite-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .price {
          font-weight: 700;
          color: var(--primary-color);
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--accent-color);
        }

        .add-to-cart-btn {
          width: 100%;
          padding: 0.75rem;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
          font-weight: 600;
        }

        .add-to-cart-btn:hover {
          background: #e55a2b;
        }

        .settings-section {
          margin-bottom: 2rem;
        }

        .notification-settings {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          cursor: pointer;
          padding: 1rem;
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          transition: var(--transition);
        }

        .notification-item:hover {
          background: #f5f5f5;
        }

        .notification-item input[type="checkbox"] {
          margin: 0;
        }

        .notification-item strong {
          display: block;
          margin-bottom: 0.25rem;
          color: var(--text-dark);
        }

        .notification-item p {
          margin: 0;
          color: var(--text-light);
          font-size: 0.9rem;
        }

        .account-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 300px;
        }

        .action-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
          font-weight: 600;
        }

        .action-btn.secondary {
          background: #f5f5f5;
          color: var(--text-dark);
        }

        .action-btn.secondary:hover {
          background: #e0e0e0;
        }

        .action-btn.danger {
          background: #f44336;
          color: white;
        }

        .action-btn.danger:hover {
          background: #d32f2f;
        }

        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            text-align: center;
          }

          .profile-tabs {
            flex-direction: column;
          }

          .profile-form {
            grid-template-columns: 1fr;
          }

          .preferences-grid {
            grid-template-columns: 1fr;
          }

          .orders-summary {
            grid-template-columns: 1fr;
          }

          .favorites-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default Profile;