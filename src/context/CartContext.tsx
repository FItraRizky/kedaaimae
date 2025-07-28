import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export interface CartItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  addons?: string[];
  specialInstructions?: string;
}

interface OrderHistory {
  id: string;
  date: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'completed' | 'pending' | 'cancelled';
  rating?: number;
}

interface CartContextType {
  cart: CartItem[];
  items: CartItem[];
  orderHistory: OrderHistory[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  applyDiscount: (code: string | { code: string; discount: number; type: 'percentage' | 'fixed' }) => boolean;
  removeDiscount: () => void;
  appliedDiscount: { code: string; discount: number; type: 'percentage' | 'fixed' } | null;
  discount: { code: string; amount: number; type: 'percentage' | 'fixed' } | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<CartContextType['discount']>(null);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: item.quantity || 1 }]);
    }
    
    toast.success(`${item.name} added to cart!`);
  };

  const removeFromCart = (id: string) => {
    const item = cart.find(cartItem => cartItem.id === id);
    setCart(cart.filter(cartItem => cartItem.id !== id));
    if (item) {
      toast.success(`${item.name} removed from cart`);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCart(cart.map(cartItem =>
      cartItem.id === id ? { ...cartItem, quantity } : cartItem
    ));
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(null);
    toast.success('Cart cleared!');
  };

  const getTotalPrice = () => {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    if (discount) {
      if (discount.type === 'percentage') {
        return subtotal * (1 - discount.amount / 100);
      } else {
        return Math.max(0, subtotal - discount.amount);
      }
    }
    
    return subtotal;
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const applyDiscount = (code: string | { code: string; discount: number; type: 'percentage' | 'fixed' }): boolean => {
    if (typeof code === 'string') {
      const validCodes: { [key: string]: { amount: number; type: 'percentage' | 'fixed' } } = {
        'WELCOME10': { amount: 10, type: 'percentage' },
        'SAVE20': { amount: 20, type: 'fixed' },
        'MAE2024': { amount: 15, type: 'percentage' },
      };

      const discountCode = validCodes[code.toUpperCase()];
      
      if (discountCode) {
        setDiscount({ code: code.toUpperCase(), ...discountCode });
        toast.success(`Discount ${code.toUpperCase()} applied!`);
        return true;
      } else {
        toast.error('Invalid discount code');
        return false;
      }
    } else {
      setDiscount({ code: code.code, amount: code.discount, type: code.type });
      toast.success(`Discount ${code.code} applied!`);
      return true;
    }
  };

  const removeDiscount = () => {
    setDiscount(null);
    toast.success('Discount removed!');
  };

  const value: CartContextType = {
    cart,
    items: cart,
    orderHistory: [
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
    ],
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    applyDiscount,
    removeDiscount,
    appliedDiscount: discount ? { code: discount.code, discount: discount.amount, type: discount.type } : null,
    discount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};