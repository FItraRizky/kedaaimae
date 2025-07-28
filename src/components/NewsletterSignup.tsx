import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

interface NewsletterForm {
  email: string;
  name: string;
  preferences: string[];
}

const NewsletterSignup: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewsletterForm>();

  const onSubmit = async (data: NewsletterForm) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Welcome, ${data.name}! You've been subscribed to our newsletter.`);
      reset();
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const preferenceOptions = [
    'New Menu Items',
    'Special Promotions',
    'Cooking Tips',
    'Events & Workshops',
    'Recipe Updates',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="newsletter-signup"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="newsletter-form">
        <div className="form-header">
          <Mail size={24} className="form-icon" />
          <h3>Join Our Newsletter</h3>
          <p>Get exclusive offers, new menu updates, and cooking tips delivered to your inbox.</p>
        </div>

        <div className="form-row">
          <div className="form-group">
            <input
              type="text"
              placeholder="Your Name"
              {...register('name', { required: 'Name is required' })}
              className={`form-input ${errors.name ? 'error' : ''}`}
            />
            {errors.name && <span className="error-message">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Your Email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className={`form-input ${errors.email ? 'error' : ''}`}
            />
            {errors.email && <span className="error-message">{errors.email.message}</span>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">What are you interested in?</label>
          <div className="checkbox-group">
            {preferenceOptions.map((option) => (
              <label key={option} className="checkbox-label">
                <input
                  type="checkbox"
                  value={option}
                  {...register('preferences')}
                />
                <span className="checkmark"></span>
                {option}
              </label>
            ))}
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="submit-button"
        >
          {isSubmitting ? (
            <span>Subscribing...</span>
          ) : (
            <>
              <span>Subscribe Now</span>
              <Send size={16} />
            </>
          )}
        </motion.button>

        <p className="privacy-note">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </form>

      <style>{`
        .newsletter-signup {
          max-width: 500px;
        }

        .newsletter-form {
          background: rgba(255, 255, 255, 0.1);
          padding: 2rem;
          border-radius: var(--border-radius-large);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-icon {
          color: var(--accent-color);
          margin-bottom: 1rem;
        }

        .form-header h3 {
          color: var(--accent-color);
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
        }

        .form-header p {
          color: #000000;
          margin: 0;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          position: relative;
        }

        .form-input {
          width: 100%;
          padding: 0.875rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--border-radius);
          color: var(--text-dark);
          font-size: 1rem;
          transition: var(--transition);
        }

        .form-input::placeholder {
          color: #000000;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--accent-color);
          background: rgba(255, 255, 255, 0.15);
        }

        .form-input.error {
          border-color: #ff6b6b;
        }

        .error-message {
          position: absolute;
          top: 100%;
          left: 0;
          font-size: 0.8rem;
          color: #000000;
          margin-top: 0.25rem;
        }

        .form-label {
          display: block;
          color: var(--accent-color);
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .checkbox-group {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #000000;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .checkbox-label input[type="checkbox"] {
          display: none;
        }

        .checkmark {
          width: 16px;
          height: 16px;
          border: 2px solid #ccc;
          border-radius: 3px;
          position: relative;
          transition: var(--transition);
        }

        .checkbox-label input[type="checkbox"]:checked + .checkmark {
          background: var(--accent-color);
          border-color: var(--accent-color);
        }

        .checkbox-label input[type="checkbox"]:checked + .checkmark::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: var(--bg-dark);
          font-size: 12px;
          font-weight: bold;
        }

        .submit-button {
          width: 100%;
          padding: 1rem;
          background: var(--gradient-primary);
          color: var(--bg-light);
          border: none;
          border-radius: var(--border-radius);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 0, 0, 0.3);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .privacy-note {
          text-align: center;
          font-size: 0.8rem;
          color: var(--text-light);
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .checkbox-group {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default NewsletterSignup;