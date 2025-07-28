import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  CreditCard, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Tag, 
  Gift, 
  Percent, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CartItem } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedTime: string;
  icon: React.ReactNode;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  fee: number;
}

const Cart: React.FC = () => {
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getTotalPrice, 
    getTotalItems,
    appliedDiscount,
    applyDiscount,
    removeDiscount
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmation'>('cart');
  const [deliveryOption, setDeliveryOption] = useState<string>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [promoCode, setPromoCode] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    notes: ''
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  const deliveryOptions: DeliveryOption[] = [
    {
      id: 'pickup',
      name: 'Pickup',
      description: 'Pick up your order at our restaurant',
      price: 0,
      estimatedTime: '15-20 min',
      icon: <MapPin size={20} />
    },
    {
      id: 'delivery',
      name: 'Delivery',
      description: 'We\'ll deliver to your location',
      price: 15000,
      estimatedTime: '30-45 min',
      icon: <Clock size={20} />
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'cash',
      name: 'Cash',
      description: 'Pay with cash on pickup/delivery',
      icon: <CreditCard size={20} />,
      fee: 0
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Pay securely with your card',
      icon: <CreditCard size={20} />,
      fee: 0
    },
    {
      id: 'ewallet',
      name: 'E-Wallet',
      description: 'GoPay, OVO, DANA, ShopeePay',
      icon: <Phone size={20} />,
      fee: 0
    }
  ];

  const availablePromoCodes = [
    { code: 'WELCOME20', discount: 20, type: 'percentage', minOrder: 50000 },
    { code: 'NEWUSER', discount: 25000, type: 'fixed', minOrder: 75000 },
    { code: 'WEEKEND15', discount: 15, type: 'percentage', minOrder: 40000 }
  ];

  const selectedDelivery = deliveryOptions.find(option => option.id === deliveryOption);
  const selectedPayment = paymentMethods.find(method => method.id === paymentMethod);
  
  const subtotal = getTotalPrice();
  const deliveryFee = selectedDelivery?.price || 0;
  const paymentFee = selectedPayment?.fee || 0;
  const discountAmount = appliedDiscount ? 
    (appliedDiscount.type === 'percentage' ? 
      subtotal * (appliedDiscount.discount / 100) : 
      appliedDiscount.discount) : 0;
  const total = subtotal + deliveryFee + paymentFee - discountAmount;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleApplyPromoCode = () => {
    const promo = availablePromoCodes.find(p => p.code === promoCode.toUpperCase());
    if (promo) {
      if (subtotal >= promo.minOrder) {
        applyDiscount({
          code: promo.code,
          discount: promo.discount,
          type: promo.type as 'percentage' | 'fixed'
        });
        toast.success(`Promo code ${promo.code} applied!`);
        setPromoCode('');
      } else {
        toast.error(`Minimum order amount is Rp ${promo.minOrder.toLocaleString()}`);
      }
    } else {
      toast.error('Invalid promo code');
    }
  };

  const handleRemovePromoCode = () => {
    removeDiscount();
    toast.success('Promo code removed');
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setStep('checkout');
  };

  const handlePlaceOrder = () => {
    // Validate customer info
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (deliveryOption === 'delivery' && !customerInfo.address) {
      toast.error('Please provide delivery address');
      return;
    }

    // Simulate order placement
    setOrderPlaced(true);
    setStep('confirmation');
    toast.success('Order placed successfully!');
    
    // Clear cart after successful order
    setTimeout(() => {
      clearCart();
    }, 2000);
  };

  const handleBackToShopping = () => {
    navigate('/menu');
  };

  if (items.length === 0 && step === 'cart') {
    return (
      <div className="cart-page">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="empty-cart"
          >
            <ShoppingCart size={80} className="empty-cart-icon" />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/menu" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="progress-indicator"
        >
          <div className={`progress-step ${step === 'cart' ? 'active' : step === 'checkout' || step === 'confirmation' ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <span>Cart</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step === 'checkout' ? 'active' : step === 'confirmation' ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <span>Checkout</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step === 'confirmation' ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Confirmation</span>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 'cart' && (
            <motion.div
              key="cart"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="cart-content"
            >
              <div className="cart-main">
                <div className="cart-header">
                  <h2>Shopping Cart ({getTotalItems()} items)</h2>
                  <button 
                    className="clear-cart-btn"
                    onClick={clearCart}
                  >
                    <Trash2 size={16} />
                    Clear Cart
                  </button>
                </div>

                <div className="cart-items">
                  {items.map((item: CartItem) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="cart-item"
                    >
                      <div className="item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>{item.description}</p>
                        <div className="item-price">
                          Rp {item.price.toLocaleString()}
                        </div>
                      </div>

                      <div className="item-controls">
                        <div className="quantity-controls">
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <div className="item-total">
                          Rp {(item.price * item.quantity).toLocaleString()}
                        </div>
                        
                        <button
                          className="remove-btn"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="cart-sidebar">
                {/* Promo Code */}
                <div className="promo-section">
                  <h3>
                    <Tag size={20} />
                    Promo Code
                  </h3>
                  {appliedDiscount ? (
                    <div className="applied-promo">
                      <div className="promo-info">
                        <span className="promo-code">{appliedDiscount.code}</span>
                        <span className="promo-discount">
                          -{appliedDiscount.type === 'percentage' ? 
                            `${appliedDiscount.discount}%` : 
                            `Rp ${appliedDiscount.discount.toLocaleString()}`
                          }
                        </span>
                      </div>
                      <button 
                        className="remove-promo-btn"
                        onClick={handleRemovePromoCode}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="promo-input">
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <button 
                        className="apply-promo-btn"
                        onClick={handleApplyPromoCode}
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                <div className="order-summary">
                  <h3>Order Summary</h3>
                  <div className="summary-line">
                    <span>Subtotal</span>
                    <span>Rp {subtotal.toLocaleString()}</span>
                  </div>
                  {appliedDiscount && (
                    <div className="summary-line discount">
                      <span>Discount ({appliedDiscount.code})</span>
                      <span>-Rp {discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="summary-line total">
                    <span>Total</span>
                    <span>Rp {(subtotal - discountAmount).toLocaleString()}</span>
                  </div>
                </div>

                <div className="cart-actions">
                  <button 
                    className="continue-shopping-btn"
                    onClick={handleBackToShopping}
                  >
                    <ArrowLeft size={16} />
                    Continue Shopping
                  </button>
                  <button 
                    className="checkout-btn"
                    onClick={handleProceedToCheckout}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'checkout' && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="checkout-content"
            >
              <div className="checkout-main">
                <button 
                  className="back-btn"
                  onClick={() => setStep('cart')}
                >
                  <ArrowLeft size={16} />
                  Back to Cart
                </button>

                <h2>Checkout</h2>

                {/* Customer Information */}
                <div className="checkout-section">
                  <h3>
                    <User size={20} />
                    Customer Information
                  </h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Options */}
                <div className="checkout-section">
                  <h3>
                    <MapPin size={20} />
                    Delivery Options
                  </h3>
                  <div className="delivery-options">
                    {deliveryOptions.map(option => (
                      <label key={option.id} className="delivery-option">
                        <input
                          type="radio"
                          name="delivery"
                          value={option.id}
                          checked={deliveryOption === option.id}
                          onChange={(e) => setDeliveryOption(e.target.value)}
                        />
                        <div className="option-content">
                          <div className="option-header">
                            {option.icon}
                            <span className="option-name">{option.name}</span>
                            <span className="option-price">
                              {option.price === 0 ? 'Free' : `Rp ${option.price.toLocaleString()}`}
                            </span>
                          </div>
                          <p className="option-description">{option.description}</p>
                          <span className="option-time">{option.estimatedTime}</span>
                        </div>
                      </label>
                    ))}
                  </div>

                  {deliveryOption === 'delivery' && (
                    <div className="form-group">
                      <label>Delivery Address *</label>
                      <textarea
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                        placeholder="Enter your complete delivery address"
                        rows={3}
                      />
                    </div>
                  )}
                </div>

                {/* Payment Methods */}
                <div className="checkout-section">
                  <h3>
                    <CreditCard size={20} />
                    Payment Method
                  </h3>
                  <div className="payment-methods">
                    {paymentMethods.map(method => (
                      <label key={method.id} className="payment-method">
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <div className="method-content">
                          <div className="method-header">
                            {method.icon}
                            <span className="method-name">{method.name}</span>
                            {method.fee > 0 && (
                              <span className="method-fee">+Rp {method.fee.toLocaleString()}</span>
                            )}
                          </div>
                          <p className="method-description">{method.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Order Notes */}
                <div className="checkout-section">
                  <h3>Order Notes (Optional)</h3>
                  <textarea
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                    placeholder="Any special instructions for your order?"
                    rows={3}
                  />
                </div>
              </div>

              <div className="checkout-sidebar">
                {/* Order Summary */}
                <div className="order-summary">
                  <h3>Order Summary</h3>
                  
                  <div className="order-items-summary">
                    {items.map((item: CartItem) => (
                      <div key={item.id} className="summary-item">
                        <span className="item-name">{item.name} x{item.quantity}</span>
                        <span className="item-price">Rp {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="summary-calculations">
                    <div className="summary-line">
                      <span>Subtotal</span>
                      <span>Rp {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="summary-line">
                      <span>Delivery Fee</span>
                      <span>{deliveryFee === 0 ? 'Free' : `Rp ${deliveryFee.toLocaleString()}`}</span>
                    </div>
                    {paymentFee > 0 && (
                      <div className="summary-line">
                        <span>Payment Fee</span>
                        <span>Rp {paymentFee.toLocaleString()}</span>
                      </div>
                    )}
                    {appliedDiscount && (
                      <div className="summary-line discount">
                        <span>Discount ({appliedDiscount.code})</span>
                        <span>-Rp {discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="summary-line total">
                      <span>Total</span>
                      <span>Rp {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button 
                  className="place-order-btn"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </button>
              </div>
            </motion.div>
          )}

          {step === 'confirmation' && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="confirmation-content"
            >
              <div className="confirmation-card">
                <div className="success-icon">
                  <CheckCircle size={60} />
                </div>
                <h2>Order Confirmed!</h2>
                <p>Thank you for your order. We've received your order and will start preparing it shortly.</p>
                
                <div className="order-details">
                  <h3>Order Details</h3>
                  <div className="detail-row">
                    <span>Order ID:</span>
                    <span>#KM{Date.now().toString().slice(-6)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Customer:</span>
                    <span>{customerInfo.name}</span>
                  </div>
                  <div className="detail-row">
                    <span>Delivery:</span>
                    <span>{selectedDelivery?.name}</span>
                  </div>
                  <div className="detail-row">
                    <span>Payment:</span>
                    <span>{selectedPayment?.name}</span>
                  </div>
                  <div className="detail-row">
                    <span>Total:</span>
                    <span>Rp {total.toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span>Estimated Time:</span>
                    <span>{selectedDelivery?.estimatedTime}</span>
                  </div>
                </div>

                <div className="confirmation-actions">
                  <Link to="/profile" className="track-order-btn">
                    Track Order
                  </Link>
                  <Link to="/menu" className="continue-shopping-btn">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .cart-page {
          padding: 2rem 0;
          background: var(--bg-light);
          min-height: 100vh;
        }

        .empty-cart {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: var(--border-radius-large);
          box-shadow: var(--shadow-light);
        }

        .empty-cart-icon {
          color: var(--text-light);
          margin-bottom: 1rem;
        }

        .empty-cart h2 {
          margin-bottom: 0.5rem;
          color: var(--text-dark);
        }

        .empty-cart p {
          color: var(--text-light);
          margin-bottom: 2rem;
        }

        .progress-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 3rem;
          background: white;
          padding: 2rem;
          border-radius: var(--border-radius-large);
          box-shadow: var(--shadow-light);
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e0e0e0;
          color: var(--text-light);
          font-weight: 600;
          transition: var(--transition);
        }

        .progress-step.active .step-number {
          background: var(--primary-color);
          color: var(--bg-light);
        }

        .progress-step.completed .step-number {
          background: var(--secondary-color);
          color: var(--bg-light);
        }

        .progress-line {
          width: 100px;
          height: 2px;
          background: var(--accent-color);
          margin: 0 1rem;
        }

        .cart-content {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2rem;
        }

        .cart-main {
          background: linear-gradient(rgba(255, 248, 220, 0.95), rgba(245, 222, 179, 0.95)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80');
          background-size: cover;
          background-position: center;
          border-radius: var(--border-radius-large);
          padding: 2rem;
          box-shadow: var(--shadow-light);
        }

        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e0e0e0;
        }

        .cart-header h2 {
          margin: 0;
          color: var(--text-dark);
        }

        .clear-cart-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f44336;
          color: white;
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
        }

        .clear-cart-btn:hover {
          background: #d32f2f;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .cart-item {
          display: grid;
          grid-template-columns: 100px 1fr auto;
          gap: 1.5rem;
          padding: 1.5rem;
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          align-items: center;
        }

        .item-image {
          width: 100px;
          height: 100px;
          border-radius: var(--border-radius);
          overflow: hidden;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-details h4 {
          margin: 0 0 0.5rem 0;
          color: var(--text-dark);
        }

        .item-details p {
          color: var(--text-light);
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .item-price {
          font-weight: 600;
          color: var(--primary-color);
        }

        .item-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f8f9fa;
          border-radius: var(--border-radius);
          padding: 0.25rem;
        }

        .quantity-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: white;
          border-radius: var(--border-radius);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }

        .quantity-btn:hover {
          background: var(--primary-color);
          color: white;
        }

        .quantity {
          min-width: 40px;
          text-align: center;
          font-weight: 600;
        }

        .item-total {
          font-weight: 700;
          color: var(--text-dark);
        }

        .remove-btn {
          padding: 0.5rem;
          background: #f44336;
          color: white;
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
        }

        .remove-btn:hover {
          background: #d32f2f;
        }

        .cart-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .promo-section,
          .order-summary {
            background: linear-gradient(rgba(255, 248, 220, 0.95), rgba(245, 222, 179, 0.95)), url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80');
            background-size: cover;
            background-position: center;
          border-radius: var(--border-radius-large);
          padding: 1.5rem;
          box-shadow: var(--shadow-light);
        }

        .promo-section h3,
        .order-summary h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0 0 1rem 0;
          color: var(--text-dark);
        }

        .promo-input {
          display: flex;
          gap: 0.5rem;
        }

        .promo-input input {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          outline: none;
        }

        .apply-promo-btn {
          padding: 0.75rem 1rem;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
        }

        .apply-promo-btn:hover {
          background: #e55a2b;
        }

        .applied-promo {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #e8f5e8;
          border-radius: var(--border-radius);
          border: 1px solid #4caf50;
        }

        .promo-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .promo-code {
          font-weight: 600;
          color: #4caf50;
        }

        .promo-discount {
          font-size: 0.9rem;
          color: var(--text-light);
        }

        .remove-promo-btn {
          padding: 0.25rem;
          background: #f44336;
          color: white;
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
        }

        .summary-line {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .summary-line.discount {
          color: #4caf50;
        }

        .summary-line.total {
          font-weight: 700;
          font-size: 1.1rem;
          padding-top: 0.75rem;
          border-top: 1px solid #e0e0e0;
          margin-top: 0.75rem;
        }

        .cart-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .continue-shopping-btn,
        .checkout-btn,
        .place-order-btn,
        .track-order-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
          font-weight: 600;
          text-decoration: none;
        }

        .continue-shopping-btn {
          background: #f8f9fa;
          color: var(--text-dark);
          border: 1px solid #e0e0e0;
        }

        .continue-shopping-btn:hover {
          background: #e9ecef;
        }

        .checkout-btn,
        .place-order-btn,
        .track-order-btn {
          background: var(--primary-color);
          color: white;
        }

        .checkout-btn:hover,
        .place-order-btn:hover,
        .track-order-btn:hover {
          background: #e55a2b;
        }

        .checkout-content {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2rem;
        }

        .checkout-main {
          background: white;
          border-radius: var(--border-radius-large);
          padding: 2rem;
          box-shadow: var(--shadow-light);
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f8f9fa;
          color: var(--text-dark);
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
          margin-bottom: 2rem;
        }

        .back-btn:hover {
          background: #e9ecef;
        }

        .checkout-main h2 {
          margin: 0 0 2rem 0;
          color: var(--text-dark);
        }

        .checkout-section {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #e0e0e0;
        }

        .checkout-section:last-child {
          border-bottom: none;
        }

        .checkout-section h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0 0 1.5rem 0;
          color: var(--text-dark);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
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
          outline: none;
          transition: var(--transition);
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: var(--primary-color);
        }

        .delivery-options,
        .payment-methods {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .delivery-option,
        .payment-method {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
        }

        .delivery-option:hover,
        .payment-method:hover {
          border-color: var(--primary-color);
        }

        .delivery-option input,
        .payment-method input {
          margin-top: 0.25rem;
        }

        .option-content,
        .method-content {
          flex: 1;
        }

        .option-header,
        .method-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .option-name,
        .method-name {
          font-weight: 600;
          color: var(--text-dark);
        }

        .option-price,
        .method-fee {
          margin-left: auto;
          font-weight: 600;
          color: var(--primary-color);
        }

        .option-description,
        .method-description {
          color: var(--text-light);
          margin-bottom: 0.25rem;
        }

        .option-time {
          font-size: 0.9rem;
          color: var(--text-light);
        }

        .checkout-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .order-items-summary {
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e0e0e0;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .item-name {
          color: var(--text-light);
        }

        .item-price {
          font-weight: 600;
        }

        .summary-calculations {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .confirmation-content {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
        }

        .confirmation-card {
          background: white;
          border-radius: var(--border-radius-large);
          padding: 3rem;
          box-shadow: var(--shadow-light);
          text-align: center;
          max-width: 500px;
          width: 100%;
        }

        .success-icon {
          color: #4caf50;
          margin-bottom: 1.5rem;
        }

        .confirmation-card h2 {
          margin: 0 0 1rem 0;
          color: var(--text-dark);
        }

        .confirmation-card p {
          color: var(--text-light);
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .order-details {
          text-align: left;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: var(--border-radius);
        }

        .order-details h3 {
          margin: 0 0 1rem 0;
          color: var(--text-dark);
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .detail-row:last-child {
          margin-bottom: 0;
          padding-top: 0.5rem;
          border-top: 1px solid #e0e0e0;
          font-weight: 600;
        }

        .confirmation-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .cart-content,
          .checkout-content {
            grid-template-columns: 1fr;
          }

          .progress-indicator {
            padding: 1rem;
          }

          .progress-line {
            width: 50px;
          }

          .cart-item {
            grid-template-columns: 80px 1fr;
            gap: 1rem;
          }

          .item-controls {
            grid-column: 1 / -1;
            flex-direction: row;
            justify-content: space-between;
            margin-top: 1rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .confirmation-card {
            padding: 2rem 1rem;
          }

          .confirmation-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Cart;