import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Star, 
  ChefHat, 
  Utensils, 
  Award, 
  Heart, 
  Share2, 
  Filter, 
  Search, 
  Plus, 
  Minus, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  CheckCircle, 
  ArrowLeft, 
  BookOpen, 
  Camera, 
  Coffee
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface Event {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: 'workshop' | 'tasting' | 'competition' | 'masterclass' | 'cultural';
  instructor: {
    name: string;
    title: string;
    image: string;
    rating: number;
    experience: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  location: string;
  price: number;
  originalPrice?: number;
  maxParticipants: number;
  currentParticipants: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  image: string;
  gallery: string[];
  includes: string[];
  requirements: string[];
  highlights: string[];
  tags: string[];
  rating: number;
  reviews: number;
  isPopular: boolean;
  isFeatured: boolean;
}

interface BookingForm {
  participants: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    dietaryRestrictions: string;
    experience: string;
    notes: string;
  };
}

const Events: React.FC = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [likedEvents, setLikedEvents] = useState<string[]>([]);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    participants: 1,
    customerInfo: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dietaryRestrictions: '',
      experience: '',
      notes: ''
    }
  });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Mock events data
  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Traditional Indonesian Cooking Masterclass',
      description: 'Learn to cook authentic Indonesian dishes with our master chef',
      longDescription: 'Immerse yourself in the rich culinary traditions of Indonesia with this comprehensive masterclass. You\'ll learn to prepare classic dishes like Rendang, Nasi Gudeg, and Gado-Gado from scratch, understanding the cultural significance and traditional techniques behind each recipe.',
      category: 'masterclass',
      instructor: {
        name: 'Chef Sari Kusuma',
        title: 'Master Chef & Culinary Heritage Expert',
        image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        experience: '15+ years'
      },
      date: '2024-02-15',
      startTime: '09:00',
      endTime: '15:00',
      duration: '6 hours',
      location: 'Kedai Mae Kitchen Studio',
      price: 450000,
      originalPrice: 550000,
      maxParticipants: 12,
      currentParticipants: 8,
      difficulty: 'intermediate',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      ],
      includes: [
        'All ingredients and cooking equipment',
        'Recipe booklet to take home',
        'Lunch featuring dishes you\'ve prepared',
        'Certificate of completion',
        'Professional photos of your dishes'
      ],
      requirements: [
        'Basic knife skills recommended',
        'Comfortable closed-toe shoes',
        'Apron will be provided',
        'No food allergies to common Indonesian spices'
      ],
      highlights: [
        'Learn 5 traditional Indonesian recipes',
        'Understand spice blending techniques',
        'Cultural stories behind each dish',
        'Take home recipe collection'
      ],
      tags: ['traditional', 'hands-on', 'cultural', 'intermediate'],
      rating: 4.8,
      reviews: 127,
      isPopular: true,
      isFeatured: true
    },
    {
      id: '2',
      title: 'Street Food Workshop: Jakarta Favorites',
      description: 'Master the art of Indonesian street food in this hands-on workshop',
      longDescription: 'Discover the vibrant world of Jakarta street food! Learn to make popular favorites like Kerak Telor, Martabak, and Soto Betawi. This workshop focuses on quick cooking techniques and authentic flavors that make Indonesian street food so beloved.',
      category: 'workshop',
      instructor: {
        name: 'Chef Budi Hartono',
        title: 'Street Food Specialist',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        rating: 4.7,
        experience: '12+ years'
      },
      date: '2024-02-18',
      startTime: '14:00',
      endTime: '18:00',
      duration: '4 hours',
      location: 'Kedai Mae Kitchen Studio',
      price: 275000,
      maxParticipants: 16,
      currentParticipants: 12,
      difficulty: 'beginner',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      ],
      includes: [
        'All ingredients and equipment',
        'Street food recipe cards',
        'Tasting of all prepared dishes',
        'Cooking tips and tricks guide'
      ],
      requirements: [
        'No prior cooking experience needed',
        'Comfortable clothing',
        'Enthusiasm for street food!'
      ],
      highlights: [
        'Learn 4 popular street food recipes',
        'Quick cooking techniques',
        'Food safety for street food',
        'Business tips for food vendors'
      ],
      tags: ['street-food', 'beginner', 'quick', 'popular'],
      rating: 4.6,
      reviews: 89,
      isPopular: true,
      isFeatured: false
    },
    {
      id: '3',
      title: 'Indonesian Spice Blending & Tasting',
      description: 'Explore the complex world of Indonesian spices and create your own blends',
      longDescription: 'Dive deep into the aromatic world of Indonesian spices. Learn about the history, cultivation, and culinary uses of traditional spices. Create your own custom spice blends and understand how to balance flavors in Indonesian cuisine.',
      category: 'tasting',
      instructor: {
        name: 'Chef Dewi Sartika',
        title: 'Spice Expert & Food Historian',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        experience: '20+ years'
      },
      date: '2024-02-20',
      startTime: '16:00',
      endTime: '19:00',
      duration: '3 hours',
      location: 'Kedai Mae Spice Garden',
      price: 195000,
      maxParticipants: 20,
      currentParticipants: 15,
      difficulty: 'beginner',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      ],
      includes: [
        'Guided spice garden tour',
        'Spice tasting session',
        'Custom spice blend creation',
        'Take-home spice collection',
        'Spice usage guide'
      ],
      requirements: [
        'No allergies to common spices',
        'Notebook for taking notes',
        'Curious palate'
      ],
      highlights: [
        'Learn about 15+ Indonesian spices',
        'Create 3 custom spice blends',
        'Historical and cultural context',
        'Professional spice storage tips'
      ],
      tags: ['spices', 'educational', 'tasting', 'cultural'],
      rating: 4.9,
      reviews: 156,
      isPopular: false,
      isFeatured: true
    },
    {
      id: '4',
      title: 'Indonesian Dessert Making Workshop',
      description: 'Create traditional Indonesian sweets and desserts',
      longDescription: 'Satisfy your sweet tooth while learning to make traditional Indonesian desserts. From Klepon to Es Cendol, discover the techniques and ingredients that make Indonesian sweets so unique and delicious.',
      category: 'workshop',
      instructor: {
        name: 'Chef Maya Indira',
        title: 'Pastry Chef & Dessert Specialist',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        experience: '10+ years'
      },
      date: '2024-02-22',
      startTime: '10:00',
      endTime: '14:00',
      duration: '4 hours',
      location: 'Kedai Mae Kitchen Studio',
      price: 320000,
      maxParticipants: 14,
      currentParticipants: 6,
      difficulty: 'intermediate',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      ],
      includes: [
        'All baking ingredients',
        'Professional baking tools',
        'Recipe collection booklet',
        'Dessert packaging to take home',
        'Tea and coffee during class'
      ],
      requirements: [
        'Basic baking knowledge helpful',
        'Comfortable clothing',
        'Hair tie if needed'
      ],
      highlights: [
        'Learn 5 traditional dessert recipes',
        'Traditional cooking techniques',
        'Ingredient substitution tips',
        'Presentation and plating skills'
      ],
      tags: ['desserts', 'baking', 'traditional', 'sweet'],
      rating: 4.7,
      reviews: 73,
      isPopular: false,
      isFeatured: false
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Events', icon: <Calendar size={20} /> },
    { id: 'workshop', name: 'Workshops', icon: <ChefHat size={20} /> },
    { id: 'masterclass', name: 'Masterclass', icon: <Award size={20} /> },
    { id: 'tasting', name: 'Tasting', icon: <Utensils size={20} /> },
    { id: 'competition', name: 'Competition', icon: <Star size={20} /> },
    { id: 'cultural', name: 'Cultural', icon: <BookOpen size={20} /> }
  ];

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleLikeEvent = (eventId: string) => {
    setLikedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleBookEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowBookingModal(true);
    setBookingStep('details');
  };

  const handleBookingSubmit = () => {
    if (!bookingForm.customerInfo.name || !bookingForm.customerInfo.email || !bookingForm.customerInfo.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (bookingStep === 'details') {
      setBookingStep('payment');
    } else if (bookingStep === 'payment') {
      setBookingStep('confirmation');
      setBookingConfirmed(true);
      toast.success('Booking confirmed successfully!');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '#4caf50';
      case 'intermediate':
        return '#ff9800';
      case 'advanced':
        return '#f44336';
      default:
        return '#666';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateTotal = () => {
    if (!selectedEvent) return 0;
    return selectedEvent.price * bookingForm.participants;
  };

  return (
    <div className="events-page">
      <div className="container">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="events-hero"
        >
          <h1>Culinary Events & Workshops</h1>
          <p>Join our expert chefs and discover the rich culinary heritage of Indonesia through hands-on experiences</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="events-filters"
        >
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Featured Events */}
        {selectedCategory === 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="featured-events"
          >
            <h2>Featured Events</h2>
            <div className="featured-grid">
              {events.filter(event => event.isFeatured).map(event => (
                <motion.div
                  key={event.id}
                  className="featured-event-card"
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="featured-image">
                    <img src={event.image} alt={event.title} />
                    <div className="featured-overlay">
                      <span className="featured-badge">Featured</span>
                      <button 
                        className={`like-btn ${likedEvents.includes(event.id) ? 'liked' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeEvent(event.id);
                        }}
                      >
                        <Heart size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="featured-content">
                    <div className="event-meta">
                      <span className="event-category">{event.category}</span>
                      <span 
                        className="difficulty-badge"
                        style={{ backgroundColor: getDifficultyColor(event.difficulty) }}
                      >
                        {event.difficulty}
                      </span>
                    </div>
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    <div className="event-details">
                      <div className="detail-item">
                        <Calendar size={16} />
                        {formatDate(event.date)}
                      </div>
                      <div className="detail-item">
                        <Clock size={16} />
                        {event.duration}
                      </div>
                      <div className="detail-item">
                        <Users size={16} />
                        {event.currentParticipants}/{event.maxParticipants}
                      </div>
                    </div>
                    <div className="event-footer">
                      <div className="price">
                        {event.originalPrice && (
                          <span className="original-price">Rp {event.originalPrice.toLocaleString()}</span>
                        )}
                        <span className="current-price">Rp {event.price.toLocaleString()}</span>
                      </div>
                      <button 
                        className="book-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookEvent(event);
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Events Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="events-grid"
        >
          <div className="grid-header">
            <h2>{selectedCategory === 'all' ? 'All Events' : categories.find(c => c.id === selectedCategory)?.name}</h2>
            <span className="results-count">{filteredEvents.length} events found</span>
          </div>
          
          <div className="events-list">
            {filteredEvents.map(event => (
              <motion.div
                key={event.id}
                className="event-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3 }}
                onClick={() => setSelectedEvent(event)}
              >
                <div className="event-image">
                  <img src={event.image} alt={event.title} />
                  <div className="event-badges">
                    {event.isPopular && <span className="popular-badge">Popular</span>}
                    <span 
                      className="difficulty-badge"
                      style={{ backgroundColor: getDifficultyColor(event.difficulty) }}
                    >
                      {event.difficulty}
                    </span>
                  </div>
                  <button 
                    className={`like-btn ${likedEvents.includes(event.id) ? 'liked' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeEvent(event.id);
                    }}
                  >
                    <Heart size={18} />
                  </button>
                </div>
                
                <div className="event-content">
                  <div className="event-header">
                    <span className="event-category">{event.category}</span>
                    <div className="event-rating">
                      <Star size={14} fill="currentColor" />
                      <span>{event.rating}</span>
                      <span className="reviews">({event.reviews})</span>
                    </div>
                  </div>
                  
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  
                  <div className="instructor-info">
                    <img src={event.instructor.image} alt={event.instructor.name} />
                    <div>
                      <span className="instructor-name">{event.instructor.name}</span>
                      <span className="instructor-title">{event.instructor.title}</span>
                    </div>
                  </div>
                  
                  <div className="event-details">
                    <div className="detail-item">
                      <Calendar size={16} />
                      {formatDate(event.date)}
                    </div>
                    <div className="detail-item">
                      <Clock size={16} />
                      {event.startTime} - {event.endTime}
                    </div>
                    <div className="detail-item">
                      <MapPin size={16} />
                      {event.location}
                    </div>
                    <div className="detail-item">
                      <Users size={16} />
                      {event.currentParticipants}/{event.maxParticipants} participants
                    </div>
                  </div>
                  
                  <div className="event-footer">
                    <div className="price">
                      {event.originalPrice && (
                        <span className="original-price">Rp {event.originalPrice.toLocaleString()}</span>
                      )}
                      <span className="current-price">Rp {event.price.toLocaleString()}</span>
                    </div>
                    <button 
                      className="book-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookEvent(event);
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Event Detail Modal */}
        <AnimatePresence>
          {selectedEvent && !showBookingModal && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
            >
              <motion.div
                className="event-detail-modal"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  className="close-btn"
                  onClick={() => setSelectedEvent(null)}
                >
                  ×
                </button>
                
                <div className="modal-content">
                  <div className="modal-header">
                    <img src={selectedEvent.image} alt={selectedEvent.title} />
                    <div className="header-content">
                      <div className="event-meta">
                        <span className="event-category">{selectedEvent.category}</span>
                        <span 
                          className="difficulty-badge"
                          style={{ backgroundColor: getDifficultyColor(selectedEvent.difficulty) }}
                        >
                          {selectedEvent.difficulty}
                        </span>
                        <div className="event-rating">
                          <Star size={16} fill="currentColor" />
                          <span>{selectedEvent.rating}</span>
                          <span className="reviews">({selectedEvent.reviews} reviews)</span>
                        </div>
                      </div>
                      <h2>{selectedEvent.title}</h2>
                      <p>{selectedEvent.longDescription}</p>
                    </div>
                  </div>
                  
                  <div className="modal-body">
                    <div className="event-info">
                      <div className="info-section">
                        <h3>Event Details</h3>
                        <div className="info-grid">
                          <div className="info-item">
                            <Calendar size={20} />
                            <div>
                              <span className="label">Date</span>
                              <span className="value">{formatDate(selectedEvent.date)}</span>
                            </div>
                          </div>
                          <div className="info-item">
                            <Clock size={20} />
                            <div>
                              <span className="label">Time</span>
                              <span className="value">{selectedEvent.startTime} - {selectedEvent.endTime}</span>
                            </div>
                          </div>
                          <div className="info-item">
                            <MapPin size={20} />
                            <div>
                              <span className="label">Location</span>
                              <span className="value">{selectedEvent.location}</span>
                            </div>
                          </div>
                          <div className="info-item">
                            <Users size={20} />
                            <div>
                              <span className="label">Participants</span>
                              <span className="value">{selectedEvent.currentParticipants}/{selectedEvent.maxParticipants}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="info-section">
                        <h3>Instructor</h3>
                        <div className="instructor-detail">
                          <img src={selectedEvent.instructor.image} alt={selectedEvent.instructor.name} />
                          <div>
                            <h4>{selectedEvent.instructor.name}</h4>
                            <p>{selectedEvent.instructor.title}</p>
                            <div className="instructor-stats">
                              <span>⭐ {selectedEvent.instructor.rating}</span>
                              <span>📅 {selectedEvent.instructor.experience}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="info-section">
                        <h3>What's Included</h3>
                        <ul className="includes-list">
                          {selectedEvent.includes.map((item, index) => (
                            <li key={index}>
                              <CheckCircle size={16} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="info-section">
                        <h3>Requirements</h3>
                        <ul className="requirements-list">
                          {selectedEvent.requirements.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="info-section">
                        <h3>Highlights</h3>
                        <ul className="highlights-list">
                          {selectedEvent.highlights.map((item, index) => (
                            <li key={index}>
                              <Star size={16} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="booking-sidebar">
                      <div className="price-card">
                        <div className="price">
                          {selectedEvent.originalPrice && (
                            <span className="original-price">Rp {selectedEvent.originalPrice.toLocaleString()}</span>
                          )}
                          <span className="current-price">Rp {selectedEvent.price.toLocaleString()}</span>
                          <span className="per-person">per person</span>
                        </div>
                        
                        <div className="availability">
                          <span className="spots-left">
                            {selectedEvent.maxParticipants - selectedEvent.currentParticipants} spots left
                          </span>
                        </div>
                        
                        <button 
                          className="book-now-btn"
                          onClick={() => handleBookEvent(selectedEvent)}
                        >
                          Book This Event
                        </button>
                        
                        <div className="share-actions">
                          <button className="share-btn">
                            <Share2 size={16} />
                            Share
                          </button>
                          <button 
                            className={`like-btn ${likedEvents.includes(selectedEvent.id) ? 'liked' : ''}`}
                            onClick={() => handleLikeEvent(selectedEvent.id)}
                          >
                            <Heart size={16} />
                            {likedEvents.includes(selectedEvent.id) ? 'Liked' : 'Like'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Booking Modal */}
        <AnimatePresence>
          {showBookingModal && selectedEvent && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBookingModal(false)}
            >
              <motion.div
                className="booking-modal"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="booking-header">
                  <button 
                    className="back-btn"
                    onClick={() => {
                      if (bookingStep === 'details') {
                        setShowBookingModal(false);
                      } else {
                        setBookingStep('details');
                      }
                    }}
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2>Book Event</h2>
                  <button 
                    className="close-btn"
                    onClick={() => setShowBookingModal(false)}
                  >
                    ×
                  </button>
                </div>
                
                <div className="booking-progress">
                  <div className={`step ${bookingStep === 'details' ? 'active' : bookingStep === 'payment' || bookingStep === 'confirmation' ? 'completed' : ''}`}>
                    <span>1</span>
                    Details
                  </div>
                  <div className={`step ${bookingStep === 'payment' ? 'active' : bookingStep === 'confirmation' ? 'completed' : ''}`}>
                    <span>2</span>
                    Payment
                  </div>
                  <div className={`step ${bookingStep === 'confirmation' ? 'active' : ''}`}>
                    <span>3</span>
                    Confirmation
                  </div>
                </div>
                
                <div className="booking-content">
                  {bookingStep === 'details' && (
                    <div className="booking-details">
                      <div className="event-summary">
                        <img src={selectedEvent.image} alt={selectedEvent.title} />
                        <div>
                          <h3>{selectedEvent.title}</h3>
                          <p>{formatDate(selectedEvent.date)} • {selectedEvent.startTime} - {selectedEvent.endTime}</p>
                          <p>{selectedEvent.location}</p>
                        </div>
                      </div>
                      
                      <div className="participants-section">
                        <h4>Number of Participants</h4>
                        <div className="participants-control">
                          <button 
                            onClick={() => setBookingForm(prev => ({
                              ...prev,
                              participants: Math.max(1, prev.participants - 1)
                            }))}
                          >
                            <Minus size={16} />
                          </button>
                          <span>{bookingForm.participants}</span>
                          <button 
                            onClick={() => setBookingForm(prev => ({
                              ...prev,
                              participants: Math.min(selectedEvent.maxParticipants - selectedEvent.currentParticipants, prev.participants + 1)
                            }))}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="customer-form">
                        <h4>Contact Information</h4>
                        <div className="form-grid">
                          <div className="form-group">
                            <label>Full Name *</label>
                            <input
                              type="text"
                              value={bookingForm.customerInfo.name}
                              onChange={(e) => setBookingForm(prev => ({
                                ...prev,
                                customerInfo: { ...prev.customerInfo, name: e.target.value }
                              }))}
                            />
                          </div>
                          <div className="form-group">
                            <label>Email *</label>
                            <input
                              type="email"
                              value={bookingForm.customerInfo.email}
                              onChange={(e) => setBookingForm(prev => ({
                                ...prev,
                                customerInfo: { ...prev.customerInfo, email: e.target.value }
                              }))}
                            />
                          </div>
                          <div className="form-group">
                            <label>Phone *</label>
                            <input
                              type="tel"
                              value={bookingForm.customerInfo.phone}
                              onChange={(e) => setBookingForm(prev => ({
                                ...prev,
                                customerInfo: { ...prev.customerInfo, phone: e.target.value }
                              }))}
                            />
                          </div>
                          <div className="form-group">
                            <label>Cooking Experience</label>
                            <select
                              value={bookingForm.customerInfo.experience}
                              onChange={(e) => setBookingForm(prev => ({
                                ...prev,
                                customerInfo: { ...prev.customerInfo, experience: e.target.value }
                              }))}
                            >
                              <option value="">Select experience level</option>
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                            </select>
                          </div>
                          <div className="form-group full-width">
                            <label>Dietary Restrictions</label>
                            <textarea
                              value={bookingForm.customerInfo.dietaryRestrictions}
                              onChange={(e) => setBookingForm(prev => ({
                                ...prev,
                                customerInfo: { ...prev.customerInfo, dietaryRestrictions: e.target.value }
                              }))}
                              placeholder="Please list any allergies or dietary restrictions"
                              rows={3}
                            />
                          </div>
                          <div className="form-group full-width">
                            <label>Additional Notes</label>
                            <textarea
                              value={bookingForm.customerInfo.notes}
                              onChange={(e) => setBookingForm(prev => ({
                                ...prev,
                                customerInfo: { ...prev.customerInfo, notes: e.target.value }
                              }))}
                              placeholder="Any special requests or questions?"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {bookingStep === 'payment' && (
                    <div className="payment-details">
                      <div className="booking-summary">
                        <h4>Booking Summary</h4>
                        <div className="summary-item">
                          <span>{selectedEvent.title}</span>
                          <span>Rp {selectedEvent.price.toLocaleString()}</span>
                        </div>
                        <div className="summary-item">
                          <span>Participants: {bookingForm.participants}</span>
                          <span>Rp {(selectedEvent.price * bookingForm.participants).toLocaleString()}</span>
                        </div>
                        <div className="summary-total">
                          <span>Total</span>
                          <span>Rp {calculateTotal().toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="payment-methods">
                        <h4>Payment Method</h4>
                        <div className="payment-options">
                          <label className="payment-option">
                            <input type="radio" name="payment" value="card" defaultChecked />
                            <div className="option-content">
                              <CreditCard size={20} />
                              <span>Credit/Debit Card</span>
                            </div>
                          </label>
                          <label className="payment-option">
                            <input type="radio" name="payment" value="bank" />
                            <div className="option-content">
                              <Coffee size={20} />
                              <span>Bank Transfer</span>
                            </div>
                          </label>
                          <label className="payment-option">
                            <input type="radio" name="payment" value="ewallet" />
                            <div className="option-content">
                              <Phone size={20} />
                              <span>E-Wallet</span>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {bookingStep === 'confirmation' && (
                    <div className="booking-confirmation">
                      <div className="success-icon">
                        <CheckCircle size={60} />
                      </div>
                      <h3>Booking Confirmed!</h3>
                      <p>Thank you for booking with us. You'll receive a confirmation email shortly.</p>
                      
                      <div className="confirmation-details">
                        <h4>Booking Details</h4>
                        <div className="detail-row">
                          <span>Booking ID:</span>
                          <span>#EV{Date.now().toString().slice(-6)}</span>
                        </div>
                        <div className="detail-row">
                          <span>Event:</span>
                          <span>{selectedEvent.title}</span>
                        </div>
                        <div className="detail-row">
                          <span>Date:</span>
                          <span>{formatDate(selectedEvent.date)}</span>
                        </div>
                        <div className="detail-row">
                          <span>Time:</span>
                          <span>{selectedEvent.startTime} - {selectedEvent.endTime}</span>
                        </div>
                        <div className="detail-row">
                          <span>Participants:</span>
                          <span>{bookingForm.participants}</span>
                        </div>
                        <div className="detail-row">
                          <span>Total Paid:</span>
                          <span>Rp {calculateTotal().toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="booking-footer">
                  {bookingStep !== 'confirmation' && (
                    <div className="total-price">
                      <span>Total: Rp {calculateTotal().toLocaleString()}</span>
                    </div>
                  )}
                  
                  {bookingStep === 'details' && (
                    <button className="continue-btn" onClick={handleBookingSubmit}>
                      Continue to Payment
                    </button>
                  )}
                  
                  {bookingStep === 'payment' && (
                    <button className="pay-btn" onClick={handleBookingSubmit}>
                      Confirm Payment
                    </button>
                  )}
                  
                  {bookingStep === 'confirmation' && (
                    <button 
                      className="done-btn" 
                      onClick={() => {
                        setShowBookingModal(false);
                        setSelectedEvent(null);
                        setBookingStep('details');
                        setBookingConfirmed(false);
                      }}
                    >
                      Done
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .events-page {
          padding: 2rem 0;
          background: var(--bg-light);
          min-height: 100vh;
        }

        .events-hero {
          text-align: center;
          margin-bottom: 3rem;
          padding: 3rem 0;
          background: linear-gradient(135deg, var(--primary-color), #e55a2b);
          color: white;
          border-radius: var(--border-radius-large);
        }

        .events-hero h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .events-hero p {
          font-size: 1.2rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }

        .events-filters {
          display: flex;
          gap: 2rem;
          margin-bottom: 3rem;
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

        .category-filters {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
        }

        .category-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
          white-space: nowrap;
          font-weight: 500;
        }

        .category-btn.active {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .category-btn:hover:not(.active) {
          border-color: var(--primary-color);
        }

        .featured-events {
          margin-bottom: 3rem;
        }

        .featured-events h2 {
          margin-bottom: 2rem;
          color: var(--text-dark);
        }

        .featured-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .featured-event-card {
          background: white;
          border-radius: var(--border-radius-large);
          overflow: hidden;
          box-shadow: var(--shadow-light);
          cursor: pointer;
          transition: var(--transition);
        }

        .featured-image {
          position: relative;
          height: 250px;
          overflow: hidden;
        }

        .featured-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition);
        }

        .featured-event-card:hover .featured-image img {
          transform: scale(1.05);
        }

        .featured-overlay {
          position: absolute;
          top: 1rem;
          left: 1rem;
          right: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .featured-badge {
          background: var(--accent-color);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .like-btn {
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
          color: var(--text-light);
        }

        .like-btn.liked {
          background: #ff4757;
          color: white;
        }

        .featured-content {
          padding: 1.5rem;
        }

        .event-meta {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          align-items: center;
        }

        .event-category {
          background: #f8f9fa;
          color: var(--text-dark);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .difficulty-badge {
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .featured-content h3 {
          margin: 0 0 0.5rem 0;
          color: var(--text-dark);
          font-size: 1.3rem;
        }

        .featured-content p {
          color: var(--text-light);
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .event-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-light);
          font-size: 0.9rem;
        }

        .event-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .original-price {
          text-decoration: line-through;
          color: var(--text-light);
          font-size: 0.9rem;
        }

        .current-price {
          font-weight: 700;
          color: var(--primary-color);
          font-size: 1.1rem;
        }

        .book-btn {
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
          font-weight: 600;
        }

        .book-btn:hover {
          background: #e55a2b;
        }

        .events-grid {
          background: white;
          border-radius: var(--border-radius-large);
          padding: 2rem;
          box-shadow: var(--shadow-light);
        }

        .grid-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e0e0e0;
        }

        .grid-header h2 {
          margin: 0;
          color: var(--text-dark);
        }

        .results-count {
          color: var(--text-light);
        }

        .events-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }

        .event-card {
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          overflow: hidden;
          cursor: pointer;
          transition: var(--transition);
        }

        .event-card:hover {
          box-shadow: var(--shadow-medium);
        }

        .event-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .event-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .event-badges {
          position: absolute;
          top: 1rem;
          left: 1rem;
          display: flex;
          gap: 0.5rem;
        }

        .popular-badge {
          background: #ff4757;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .event-image .like-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
        }

        .event-content {
          padding: 1.5rem;
        }

        .event-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .event-rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--accent-color);
          font-size: 0.9rem;
        }

        .reviews {
          color: var(--text-light);
        }

        .event-content h3 {
          margin: 0 0 0.5rem 0;
          color: var(--text-dark);
        }

        .event-content p {
          color: var(--text-light);
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .instructor-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: #f8f9fa;
          border-radius: var(--border-radius);
        }

        .instructor-info img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .instructor-name {
          font-weight: 600;
          color: var(--text-dark);
          display: block;
        }

        .instructor-title {
          font-size: 0.8rem;
          color: var(--text-light);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }

        .event-detail-modal {
          background: white;
          border-radius: var(--border-radius-large);
          max-width: 1000px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.5rem;
          z-index: 10;
        }

        .modal-header {
          position: relative;
          height: 300px;
          overflow: hidden;
        }

        .modal-header img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .header-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
          color: white;
          padding: 2rem;
        }

        .header-content h2 {
          margin: 0.5rem 0;
          font-size: 2rem;
        }

        .modal-body {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 2rem;
          padding: 2rem;
        }

        .info-section {
          margin-bottom: 2rem;
        }

        .info-section h3 {
          margin: 0 0 1rem 0;
          color: var(--text-dark);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: var(--border-radius);
        }

        .info-item .label {
          font-size: 0.8rem;
          color: var(--text-light);
          display: block;
        }

        .info-item .value {
          font-weight: 600;
          color: var(--text-dark);
        }

        .instructor-detail {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: var(--border-radius);
        }

        .instructor-detail img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
        }

        .instructor-detail h4 {
          margin: 0 0 0.25rem 0;
          color: var(--text-dark);
        }

        .instructor-detail p {
          margin: 0 0 0.5rem 0;
          color: var(--text-light);
          font-size: 0.9rem;
        }

        .instructor-stats {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
          color: var(--text-light);
        }

        .includes-list,
        .requirements-list,
        .highlights-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .includes-list li,
        .highlights-list li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0;
          color: var(--text-dark);
        }

        .includes-list li svg,
        .highlights-list li svg {
          color: var(--primary-color);
          flex-shrink: 0;
        }

        .requirements-list li {
          padding: 0.5rem 0;
          color: var(--text-dark);
          position: relative;
          padding-left: 1rem;
        }

        .requirements-list li::before {
          content: '•';
          color: var(--primary-color);
          position: absolute;
          left: 0;
        }

        .booking-sidebar {
          position: sticky;
          top: 2rem;
          height: fit-content;
        }

        .price-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          padding: 1.5rem;
          box-shadow: var(--shadow-light);
        }

        .price-card .price {
          text-align: center;
          margin-bottom: 1rem;
        }

        .per-person {
          font-size: 0.8rem;
          color: var(--text-light);
          display: block;
        }

        .availability {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .spots-left {
          color: var(--accent-color);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .book-now-btn {
          width: 100%;
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 1rem;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 1rem;
        }

        .book-now-btn:hover {
          background: #e55a2b;
        }

        .share-actions {
          display: flex;
          gap: 0.5rem;
        }

        .share-btn {
          flex: 1;
          background: #f8f9fa;
          border: 1px solid #e0e0e0;
          padding: 0.75rem;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .share-btn:hover {
          background: #e9ecef;
        }

        .share-actions .like-btn {
          flex: 1;
          background: #f8f9fa;
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          width: auto;
          height: auto;
          padding: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .booking-modal {
          background: white;
          border-radius: var(--border-radius-large);
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .booking-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e0e0e0;
        }

        .back-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          transition: var(--transition);
        }

        .back-btn:hover {
          background: #f8f9fa;
        }

        .booking-header h2 {
          margin: 0;
          color: var(--text-dark);
        }

        .booking-progress {
          display: flex;
          justify-content: center;
          padding: 2rem;
          background: #f8f9fa;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: white;
          border: 1px solid #e0e0e0;
          color: var(--text-light);
          position: relative;
        }

        .step:first-child {
          border-radius: var(--border-radius) 0 0 var(--border-radius);
        }

        .step:last-child {
          border-radius: 0 var(--border-radius) var(--border-radius) 0;
        }

        .step.active {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .step.completed {
          background: var(--accent-color);
          color: white;
          border-color: var(--accent-color);
        }

        .step span {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .step.active span,
        .step.completed span {
          background: rgba(255, 255, 255, 0.3);
        }

        .booking-content {
          padding: 2rem;
        }

        .event-summary {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: var(--border-radius);
          margin-bottom: 2rem;
        }

        .event-summary img {
          width: 80px;
          height: 80px;
          border-radius: var(--border-radius);
          object-fit: cover;
        }

        .event-summary h3 {
          margin: 0 0 0.5rem 0;
          color: var(--text-dark);
        }

        .event-summary p {
          margin: 0;
          color: var(--text-light);
          font-size: 0.9rem;
        }

        .participants-section {
          margin-bottom: 2rem;
        }

        .participants-section h4 {
          margin: 0 0 1rem 0;
          color: var(--text-dark);
        }

        .participants-control {
          display: flex;
          align-items: center;
          gap: 1rem;
          justify-content: center;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: var(--border-radius);
          width: fit-content;
          margin: 0 auto;
        }

        .participants-control button {
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }

        .participants-control button:hover {
          background: #e55a2b;
        }

        .participants-control span {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-dark);
          min-width: 2rem;
          text-align: center;
        }

        .customer-form h4 {
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

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-weight: 600;
          color: var(--text-dark);
          font-size: 0.9rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.75rem;
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          font-size: 1rem;
          transition: var(--transition);
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(255, 107, 74, 0.1);
        }

        .booking-summary {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: var(--border-radius);
          margin-bottom: 2rem;
        }

        .booking-summary h4 {
          margin: 0 0 1rem 0;
          color: var(--text-dark);
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #e0e0e0;
        }

        .summary-item:last-child {
          border-bottom: none;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          padding: 1rem 0 0 0;
          margin-top: 1rem;
          border-top: 2px solid var(--primary-color);
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text-dark);
        }

        .payment-methods h4 {
          margin: 0 0 1rem 0;
          color: var(--text-dark);
        }

        .payment-options {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .payment-option {
          display: flex;
          align-items: center;
          padding: 1rem;
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
        }

        .payment-option:hover {
          border-color: var(--primary-color);
        }

        .payment-option input {
          margin-right: 1rem;
        }

        .option-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .booking-confirmation {
          text-align: center;
          padding: 2rem 0;
        }

        .success-icon {
          color: var(--accent-color);
          margin-bottom: 1rem;
        }

        .booking-confirmation h3 {
          margin: 0 0 1rem 0;
          color: var(--text-dark);
          font-size: 1.5rem;
        }

        .booking-confirmation p {
          color: var(--text-light);
          margin-bottom: 2rem;
        }

        .confirmation-details {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: var(--border-radius);
          text-align: left;
          margin-top: 2rem;
        }

        .confirmation-details h4 {
          margin: 0 0 1rem 0;
          color: var(--text-dark);
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #e0e0e0;
        }

        .detail-row:last-child {
          border-bottom: none;
          font-weight: 600;
          color: var(--primary-color);
        }

        .booking-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-top: 1px solid #e0e0e0;
          background: #f8f9fa;
        }

        .total-price {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        .continue-btn,
        .pay-btn,
        .done-btn {
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
          font-weight: 600;
          font-size: 1rem;
        }

        .continue-btn:hover,
        .pay-btn:hover,
        .done-btn:hover {
          background: #e55a2b;
        }

        @media (max-width: 768px) {
          .events-filters {
            flex-direction: column;
            gap: 1rem;
          }

          .category-filters {
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }

          .featured-grid {
            grid-template-columns: 1fr;
          }

          .events-list {
            grid-template-columns: 1fr;
          }

          .modal-body {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .booking-sidebar {
            position: static;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .booking-progress {
            padding: 1rem;
          }

          .step {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }

          .booking-footer {
            flex-direction: column;
            gap: 1rem;
          }

          .continue-btn,
          .pay-btn,
          .done-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Events;