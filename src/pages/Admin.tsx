import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  ShoppingBag, 
  Menu as MenuIcon, 
  DollarSign, 
  Clock, 
  Star, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Download, 
  Eye, 
  Percent
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  averageRating: number;
  todayRevenue: number;
  todayOrders: number;
  newUsers: number;
  pendingOrders: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  createdAt: string;
  estimatedTime?: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  preparationTime: string;
  ingredients: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'banned';
}

interface Promotion {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  usageCount: number;
  maxUsage: number;
}

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');


  // Mock data - in real app, this would come from API
  const [stats] = useState<DashboardStats>({
    totalRevenue: 15750000,
    totalOrders: 342,
    totalUsers: 156,
    averageRating: 4.7,
    todayRevenue: 850000,
    todayOrders: 23,
    newUsers: 8,
    pendingOrders: 5,
  });

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      customerName: 'Ahmad Wijaya',
      customerEmail: 'ahmad@email.com',
      items: [
        { name: 'Nasi Goreng Special', quantity: 2, price: 45000 },
        { name: 'Es Cendol', quantity: 1, price: 15000 },
      ],
      total: 105000,
      status: 'pending',
      createdAt: '2024-01-15T18:30:00Z',
      estimatedTime: '25 min',
    },
    {
      id: 'ORD-002',
      customerName: 'Sari Dewi',
      customerEmail: 'sari@email.com',
      items: [
        { name: 'Rendang Padang', quantity: 1, price: 65000 },
      ],
      total: 65000,
      status: 'preparing',
      createdAt: '2024-01-15T18:15:00Z',
      estimatedTime: '15 min',
    },
    {
      id: 'ORD-003',
      customerName: 'Budi Santoso',
      customerEmail: 'budi@email.com',
      items: [
        { name: 'Gado-Gado Jakarta', quantity: 1, price: 35000 },
        { name: 'Sate Ayam Madura', quantity: 2, price: 35000 },
      ],
      total: 105000,
      status: 'ready',
      createdAt: '2024-01-15T17:45:00Z',
    },
  ]);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Nasi Goreng Special',
      description: 'Traditional Indonesian fried rice with shrimp, chicken, and vegetables',
      price: 45000,
      category: 'main-courses',
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      available: true,
      preparationTime: '15 min',
      ingredients: ['rice', 'shrimp', 'chicken', 'vegetables', 'egg'],
    },
    {
      id: '2',
      name: 'Rendang Padang',
      description: 'Slow-cooked beef in rich coconut curry with authentic Padang spices',
      price: 65000,
      category: 'main-courses',
      image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      available: true,
      preparationTime: '45 min',
      ingredients: ['beef', 'coconut milk', 'spices', 'chili'],
    },
  ]);

  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Ahmad Wijaya',
      email: 'ahmad@email.com',
      phone: '+62812345678',
      joinDate: '2024-01-10T00:00:00Z',
      totalOrders: 15,
      totalSpent: 750000,
      status: 'active',
    },
    {
      id: '2',
      name: 'Sari Dewi',
      email: 'sari@email.com',
      phone: '+62823456789',
      joinDate: '2024-01-08T00:00:00Z',
      totalOrders: 8,
      totalSpent: 420000,
      status: 'active',
    },
  ]);

  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: '1',
      title: 'Weekend Special',
      description: '20% off on all main courses during weekends',
      discountType: 'percentage',
      discountValue: 20,
      minOrderAmount: 50000,
      validFrom: '2024-01-13T00:00:00Z',
      validTo: '2024-01-31T23:59:59Z',
      isActive: true,
      usageCount: 45,
      maxUsage: 100,
    },
    {
      id: '2',
      title: 'New Customer Discount',
      description: 'Rp 25,000 off for first-time customers',
      discountType: 'fixed',
      discountValue: 25000,
      minOrderAmount: 75000,
      validFrom: '2024-01-01T00:00:00Z',
      validTo: '2024-12-31T23:59:59Z',
      isActive: true,
      usageCount: 23,
      maxUsage: 200,
    },
  ]);

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
  };

  const handleToggleMenuAvailability = (itemId: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, available: !item.available } : item
    ));
    toast.success('Menu item availability updated');
  };

  const handleTogglePromotion = (promoId: string) => {
    setPromotions(prev => prev.map(promo => 
      promo.id === promoId ? { ...promo, isActive: !promo.isActive } : promo
    ));
    toast.success('Promotion status updated');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#ff9800';
      case 'preparing':
        return '#2196f3';
      case 'ready':
        return '#4caf50';
      case 'completed':
        return '#8bc34a';
      case 'cancelled':
        return '#f44336';
      case 'active':
        return '#4caf50';
      case 'inactive':
        return '#ff9800';
      case 'banned':
        return '#f44336';
      default:
        return '#666';
    }
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || order.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'available' && item.available) ||
                         (selectedFilter === 'unavailable' && !item.available);
    return matchesSearch && matchesFilter;
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || user.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="admin-page">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-header"
        >
          <h1>Admin Dashboard</h1>
          <p>Manage your restaurant operations efficiently</p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-tabs"
        >
          <button
            className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <BarChart3 size={20} />
            Dashboard
          </button>
          <button
            className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={20} />
            Orders
          </button>
          <button
            className={`tab ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            <MenuIcon size={20} />
            Menu
          </button>
          <button
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={20} />
            Users
          </button>
          <button
            className={`tab ${activeTab === 'promotions' ? 'active' : ''}`}
            onClick={() => setActiveTab('promotions')}
          >
            <Percent size={20} />
            Promotions
          </button>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="tab-content"
            >
              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon revenue">
                    <DollarSign size={24} />
                  </div>
                  <div className="stat-content">
                    <h3>Total Revenue</h3>
                    <p className="stat-value">Rp {stats.totalRevenue.toLocaleString()}</p>
                    <span className="stat-change positive">+12% from last month</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon orders">
                    <ShoppingBag size={24} />
                  </div>
                  <div className="stat-content">
                    <h3>Total Orders</h3>
                    <p className="stat-value">{stats.totalOrders}</p>
                    <span className="stat-change positive">+8% from last month</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon users">
                    <Users size={24} />
                  </div>
                  <div className="stat-content">
                    <h3>Total Users</h3>
                    <p className="stat-value">{stats.totalUsers}</p>
                    <span className="stat-change positive">+15% from last month</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon rating">
                    <Star size={24} />
                  </div>
                  <div className="stat-content">
                    <h3>Average Rating</h3>
                    <p className="stat-value">{stats.averageRating} ⭐</p>
                    <span className="stat-change positive">+0.2 from last month</span>
                  </div>
                </div>
              </div>

              {/* Today's Summary */}
              <div className="today-summary">
                <h3>Today's Summary</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-label">Revenue</span>
                    <span className="summary-value">Rp {stats.todayRevenue.toLocaleString()}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Orders</span>
                    <span className="summary-value">{stats.todayOrders}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">New Users</span>
                    <span className="summary-value">{stats.newUsers}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Pending Orders</span>
                    <span className="summary-value pending">{stats.pendingOrders}</span>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="recent-orders">
                <h3>Recent Orders</h3>
                <div className="orders-table">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="order-row">
                      <div className="order-info">
                        <strong>{order.id}</strong>
                        <span>{order.customerName}</span>
                      </div>
                      <div className="order-total">
                        Rp {order.total.toLocaleString()}
                      </div>
                      <div className="order-status">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
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
              {/* Controls */}
              <div className="content-controls">
                <div className="search-bar">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Orders List */}
              <div className="orders-list">
                {filteredOrders.map(order => (
                  <motion.div
                    key={order.id}
                    className="order-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="order-header">
                      <div className="order-info">
                        <h4>{order.id}</h4>
                        <p>{order.customerName} • {order.customerEmail}</p>
                        <span className="order-time">{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="order-status-controls">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {order.status}
                        </span>
                        {order.estimatedTime && (
                          <span className="estimated-time">
                            <Clock size={14} />
                            {order.estimatedTime}
                          </span>
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

                    <div className="order-footer">
                      <div className="order-total">
                        <strong>Total: Rp {order.total.toLocaleString()}</strong>
                      </div>
                      <div className="order-actions">
                        {order.status === 'pending' && (
                          <button
                            className="action-btn preparing"
                            onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                          >
                            Start Preparing
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button
                            className="action-btn ready"
                            onClick={() => handleUpdateOrderStatus(order.id, 'ready')}
                          >
                            Mark Ready
                          </button>
                        )}
                        {order.status === 'ready' && (
                          <button
                            className="action-btn completed"
                            onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                          >
                            Complete Order
                          </button>
                        )}
                        <button
                          className="action-btn cancel"
                          onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="tab-content"
            >
              {/* Controls */}
              <div className="content-controls">
                <div className="search-bar">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Items</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
                <button className="add-btn">
                  <Plus size={20} />
                  Add Item
                </button>
              </div>

              {/* Menu Grid */}
              <div className="menu-grid">
                {filteredMenuItems.map(item => (
                  <motion.div
                    key={item.id}
                    className="menu-item-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="menu-item-image">
                      <img src={item.image} alt={item.name} />
                      <div className="availability-toggle">
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={item.available}
                            onChange={() => handleToggleMenuAvailability(item.id)}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>

                    <div className="menu-item-content">
                      <h4>{item.name}</h4>
                      <p>{item.description}</p>
                      <div className="menu-item-meta">
                        <span className="price">Rp {item.price.toLocaleString()}</span>
                        <span className="prep-time">
                          <Clock size={14} />
                          {item.preparationTime}
                        </span>
                      </div>
                      <div className="menu-item-actions">
                        <button className="action-btn edit">
                          <Edit size={16} />
                          Edit
                        </button>
                        <button className="action-btn delete">
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="tab-content"
            >
              {/* Controls */}
              <div className="content-controls">
                <div className="search-bar">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Users</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="banned">Banned</option>
                </select>
                <button className="export-btn">
                  <Download size={20} />
                  Export
                </button>
              </div>

              {/* Users Table */}
              <div className="users-table">
                <div className="table-header">
                  <div>User</div>
                  <div>Contact</div>
                  <div>Join Date</div>
                  <div>Orders</div>
                  <div>Total Spent</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>
                {filteredUsers.map(user => (
                  <div key={user.id} className="table-row">
                    <div className="user-info">
                      <strong>{user.name}</strong>
                    </div>
                    <div className="user-contact">
                      <div>{user.email}</div>
                      <div>{user.phone}</div>
                    </div>
                    <div>{formatDate(user.joinDate)}</div>
                    <div>{user.totalOrders}</div>
                    <div>Rp {user.totalSpent.toLocaleString()}</div>
                    <div>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(user.status) }}
                      >
                        {user.status}
                      </span>
                    </div>
                    <div className="user-actions">
                      <button className="action-btn view">
                        <Eye size={14} />
                      </button>
                      <button className="action-btn edit">
                        <Edit size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'promotions' && (
            <motion.div
              key="promotions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="tab-content"
            >
              {/* Controls */}
              <div className="content-controls">
                <button className="add-btn">
                  <Plus size={20} />
                  Create Promotion
                </button>
              </div>

              {/* Promotions Grid */}
              <div className="promotions-grid">
                {promotions.map(promo => (
                  <motion.div
                    key={promo.id}
                    className="promotion-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="promotion-header">
                      <h4>{promo.title}</h4>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={promo.isActive}
                          onChange={() => handleTogglePromotion(promo.id)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <p>{promo.description}</p>

                    <div className="promotion-details">
                      <div className="detail-item">
                        <span>Discount:</span>
                        <span>
                          {promo.discountType === 'percentage' 
                            ? `${promo.discountValue}%` 
                            : `Rp ${promo.discountValue.toLocaleString()}`
                          }
                        </span>
                      </div>
                      <div className="detail-item">
                        <span>Min Order:</span>
                        <span>Rp {promo.minOrderAmount.toLocaleString()}</span>
                      </div>
                      <div className="detail-item">
                        <span>Valid Until:</span>
                        <span>{formatDate(promo.validTo)}</span>
                      </div>
                      <div className="detail-item">
                        <span>Usage:</span>
                        <span>{promo.usageCount}/{promo.maxUsage}</span>
                      </div>
                    </div>

                    <div className="promotion-actions">
                      <button className="action-btn edit">
                        <Edit size={16} />
                        Edit
                      </button>
                      <button className="action-btn delete">
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .admin-page {
          padding: 2rem 0;
          background: var(--bg-light);
          min-height: 100vh;
        }

        .access-denied {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: var(--border-radius-large);
          box-shadow: var(--shadow-light);
        }

        .admin-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .admin-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: var(--text-dark);
        }

        .admin-header p {
          font-size: 1.2rem;
          color: var(--text-light);
        }

        .admin-tabs {
          display: flex;
          background: white;
          border-radius: var(--border-radius-large);
          padding: 1rem;
          margin-bottom: 2rem;
          box-shadow: var(--shadow-light);
          overflow-x: auto;
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
          white-space: nowrap;
        }

        .tab.active {
          background: var(--primary-color);
          color: white;
        }

        .tab:hover:not(.active) {
          background: #f5f5f5;
        }

        .tab-content {
          background: white;
          border-radius: var(--border-radius-large);
          padding: 2rem;
          box-shadow: var(--shadow-light);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: var(--border-radius);
          border-left: 4px solid var(--primary-color);
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-icon.revenue {
          background: #4caf50;
        }

        .stat-icon.orders {
          background: #2196f3;
        }

        .stat-icon.users {
          background: #ff9800;
        }

        .stat-icon.rating {
          background: var(--accent-color);
        }

        .stat-content h3 {
          margin: 0 0 0.5rem 0;
          color: var(--text-light);
          font-size: 0.9rem;
          text-transform: uppercase;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text-dark);
          margin: 0 0 0.25rem 0;
        }

        .stat-change {
          font-size: 0.8rem;
        }

        .stat-change.positive {
          color: #4caf50;
        }

        .today-summary {
          margin-bottom: 2rem;
        }

        .today-summary h3 {
          margin-bottom: 1rem;
          color: var(--text-dark);
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .summary-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: var(--border-radius);
        }

        .summary-label {
          font-size: 0.9rem;
          color: var(--text-light);
        }

        .summary-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        .summary-value.pending {
          color: #ff9800;
        }

        .recent-orders h3 {
          margin-bottom: 1rem;
          color: var(--text-dark);
        }

        .orders-table {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .order-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 1rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: var(--border-radius);
          align-items: center;
        }

        .order-info strong {
          display: block;
          color: var(--text-dark);
        }

        .order-info span {
          color: var(--text-light);
          font-size: 0.9rem;
        }

        .order-total {
          font-weight: 600;
          color: var(--primary-color);
        }

        .content-controls {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          align-items: center;
        }

        .search-bar {
          flex: 1;
          display: flex;
          align-items: center;
          background: #f8f9fa;
          border-radius: var(--border-radius);
          padding: 0.75rem 1rem;
        }

        .search-bar input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          margin-left: 0.5rem;
          font-size: 1rem;
        }

        .filter-select {
          padding: 0.75rem 1rem;
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          background: white;
          cursor: pointer;
        }

        .add-btn, .export-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
          font-weight: 600;
        }

        .add-btn:hover, .export-btn:hover {
          background: #e55a2b;
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
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .order-header h4 {
          margin: 0 0 0.25rem 0;
          color: var(--text-dark);
        }

        .order-header p {
          margin: 0 0 0.25rem 0;
          color: var(--text-light);
        }

        .order-time {
          font-size: 0.8rem;
          color: var(--text-light);
        }

        .order-status-controls {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          color: white;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .estimated-time {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          color: var(--text-light);
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

        .order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .order-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .action-btn.preparing {
          background: #2196f3;
          color: white;
        }

        .action-btn.ready {
          background: #4caf50;
          color: white;
        }

        .action-btn.completed {
          background: #8bc34a;
          color: white;
        }

        .action-btn.cancel {
          background: #f44336;
          color: white;
        }

        .action-btn.edit {
          background: #ff9800;
          color: white;
        }

        .action-btn.delete {
          background: #f44336;
          color: white;
        }

        .action-btn.view {
          background: #2196f3;
          color: white;
        }

        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .menu-item-card {
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          overflow: hidden;
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
        }

        .availability-toggle {
          position: absolute;
          top: 1rem;
          right: 1rem;
        }

        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 24px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: var(--primary-color);
        }

        input:checked + .slider:before {
          transform: translateX(26px);
        }

        .menu-item-content {
          padding: 1.5rem;
        }

        .menu-item-content h4 {
          margin: 0 0 0.5rem 0;
          color: var(--text-dark);
        }

        .menu-item-content p {
          color: var(--text-light);
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .menu-item-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .price {
          font-weight: 700;
          color: var(--primary-color);
        }

        .prep-time {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--text-light);
          font-size: 0.9rem;
        }

        .menu-item-actions {
          display: flex;
          gap: 0.5rem;
        }

        .users-table {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .table-header {
          display: grid;
          grid-template-columns: 1.5fr 1.5fr 1fr 0.5fr 1fr 0.5fr 0.5fr;
          gap: 1rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: var(--border-radius);
          font-weight: 600;
          color: var(--text-dark);
        }

        .table-row {
          display: grid;
          grid-template-columns: 1.5fr 1.5fr 1fr 0.5fr 1fr 0.5fr 0.5fr;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          align-items: center;
        }

        .user-contact div {
          font-size: 0.9rem;
          color: var(--text-light);
        }

        .user-actions {
          display: flex;
          gap: 0.25rem;
        }

        .promotions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .promotion-card {
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          padding: 1.5rem;
        }

        .promotion-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .promotion-header h4 {
          margin: 0;
          color: var(--text-dark);
        }

        .promotion-details {
          margin: 1rem 0;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .promotion-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .admin-tabs {
            flex-direction: column;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .content-controls {
            flex-direction: column;
          }

          .search-bar {
            width: 100%;
          }

          .order-header {
            flex-direction: column;
            gap: 1rem;
          }

          .order-footer {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .menu-grid {
            grid-template-columns: 1fr;
          }

          .table-header,
          .table-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .promotions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Admin;