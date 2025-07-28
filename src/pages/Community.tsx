import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ThumbsUp, ThumbsDown, Share2, Plus, Search, Camera, Heart, MessageSquare, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    level: string;
  };
  category: string;
  likes: number;
  dislikes: number;
  replies: number;
  createdAt: string;
  tags: string[];
  image?: string;
  isLiked?: boolean;
  isDisliked?: boolean;
}

interface Poll {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
  totalVotes: number;
  createdAt: string;
  author: {
    name: string;
    avatar: string;
  };
  hasVoted?: boolean;
  userVote?: string;
}

interface UGCPost {
  id: string;
  title: string;
  description: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  createdAt: string;
  tags: string[];
  isLiked?: boolean;
}

const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState('forum');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');


  const categories = [
    'all',
    'recipes',
    'reviews',
    'tips',
    'events',
    'general',
  ];

  const [forumPosts, setForumPosts] = useState<ForumPost[]>([
    {
      id: '1',
      title: 'Best Rendang Recipe - Family Secret Revealed!',
      content: 'After years of perfecting this recipe, I\'m finally ready to share my grandmother\'s secret rendang recipe. The key is in the spice paste and slow cooking process...',
      author: {
        name: 'Chef Sari',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        level: 'Master Chef',
      },
      category: 'recipes',
      likes: 156,
      dislikes: 3,
      replies: 42,
      createdAt: '2024-01-15T10:30:00Z',
      tags: ['rendang', 'traditional', 'beef', 'spicy'],
      image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '2',
      title: 'Kedai Mae Experience - 5 Stars!',
      content: 'Just visited Kedai Mae last weekend and I must say, the experience was absolutely amazing! The nasi goreng was perfectly seasoned and the service was top-notch.',
      author: {
        name: 'Foodie Ahmad',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        level: 'Food Enthusiast',
      },
      category: 'reviews',
      likes: 89,
      dislikes: 1,
      replies: 23,
      createdAt: '2024-01-14T15:45:00Z',
      tags: ['review', 'nasi-goreng', 'service'],
    },
    {
      id: '3',
      title: 'Tips for Perfect Gado-Gado Sauce',
      content: 'The secret to amazing gado-gado is all in the peanut sauce. Here are my top 5 tips for making the perfect sauce that will elevate your gado-gado game...',
      author: {
        name: 'Ibu Ratna',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        level: 'Home Cook',
      },
      category: 'tips',
      likes: 67,
      dislikes: 0,
      replies: 18,
      createdAt: '2024-01-13T09:20:00Z',
      tags: ['gado-gado', 'sauce', 'tips', 'peanut'],
    },
  ]);

  const [polls, setPolls] = useState<Poll[]>([
    {
      id: '1',
      question: 'What\'s your favorite Indonesian dish at Kedai Mae?',
      options: [
        { id: '1', text: 'Nasi Goreng Special', votes: 45 },
        { id: '2', text: 'Rendang Padang', votes: 38 },
        { id: '3', text: 'Gado-Gado Jakarta', votes: 22 },
        { id: '4', text: 'Sate Ayam Madura', votes: 31 },
      ],
      totalVotes: 136,
      createdAt: '2024-01-15T08:00:00Z',
      author: {
        name: 'Kedai Mae Team',
        avatar: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      },
    },
    {
      id: '2',
      question: 'Which cooking workshop would you be most interested in?',
      options: [
        { id: '1', text: 'Traditional Rendang Masterclass', votes: 28 },
        { id: '2', text: 'Indonesian Street Food', votes: 35 },
        { id: '3', text: 'Vegetarian Indonesian Cuisine', votes: 19 },
        { id: '4', text: 'Dessert & Beverages', votes: 24 },
      ],
      totalVotes: 106,
      createdAt: '2024-01-14T12:00:00Z',
      author: {
        name: 'Chef Budi',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      },
    },
  ]);

  const [ugcPosts, setUgcPosts] = useState<UGCPost[]>([
    {
      id: '1',
      title: 'My Homemade Rendang Attempt',
      description: 'Tried making rendang at home using the recipe from the forum. Not perfect but getting there!',
      image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      author: {
        name: 'Cooking Newbie',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      },
      likes: 34,
      comments: 12,
      createdAt: '2024-01-15T14:30:00Z',
      tags: ['homemade', 'rendang', 'attempt'],
    },
    {
      id: '2',
      title: 'Beautiful Gado-Gado Presentation',
      description: 'Spent extra time on presentation today. Sometimes food is art!',
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      author: {
        name: 'Artistic Cook',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      },
      likes: 67,
      comments: 8,
      createdAt: '2024-01-14T16:45:00Z',
      tags: ['gado-gado', 'presentation', 'art'],
    },
  ]);

  const handleLikePost = (postId: string) => {
    setForumPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isCurrentlyLiked = post.isLiked;
        const isCurrentlyDisliked = post.isDisliked;
        
        return {
          ...post,
          likes: isCurrentlyLiked ? post.likes - 1 : post.likes + 1,
          dislikes: isCurrentlyDisliked ? post.dislikes - 1 : post.dislikes,
          isLiked: !isCurrentlyLiked,
          isDisliked: false,
        };
      }
      return post;
    }));
  };

  const handleDislikePost = (postId: string) => {
    setForumPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isCurrentlyLiked = post.isLiked;
        const isCurrentlyDisliked = post.isDisliked;
        
        return {
          ...post,
          likes: isCurrentlyLiked ? post.likes - 1 : post.likes,
          dislikes: isCurrentlyDisliked ? post.dislikes - 1 : post.dislikes + 1,
          isLiked: false,
          isDisliked: !isCurrentlyDisliked,
        };
      }
      return post;
    }));
  };

  const handleVotePoll = (pollId: string, optionId: string) => {
    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId && !poll.hasVoted) {
        return {
          ...poll,
          options: poll.options.map(option => ({
            ...option,
            votes: option.id === optionId ? option.votes + 1 : option.votes,
          })),
          totalVotes: poll.totalVotes + 1,
          hasVoted: true,
          userVote: optionId,
        };
      }
      return poll;
    }));
    toast.success('Vote recorded!');
  };

  const handleLikeUGC = (postId: string) => {
    setUgcPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isCurrentlyLiked = post.isLiked;
        return {
          ...post,
          likes: isCurrentlyLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !isCurrentlyLiked,
        };
      }
      return post;
    }));
  };

  const filteredForumPosts = forumPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  return (
    <div className="community-page">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="community-header"
        >
          <h1>Community Hub</h1>
          <p>Connect, share, and discover with fellow food enthusiasts</p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="community-tabs"
        >
          <button
            className={`tab ${activeTab === 'forum' ? 'active' : ''}`}
            onClick={() => setActiveTab('forum')}
          >
            <MessageCircle size={20} />
            Forum
          </button>
          <button
            className={`tab ${activeTab === 'polls' ? 'active' : ''}`}
            onClick={() => setActiveTab('polls')}
          >
            <TrendingUp size={20} />
            Polls & Surveys
          </button>
          <button
            className={`tab ${activeTab === 'ugc' ? 'active' : ''}`}
            onClick={() => setActiveTab('ugc')}
          >
            <Camera size={20} />
            Showcase
          </button>
        </motion.div>

        {/* Search and Filters */}
        {activeTab === 'forum' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="community-controls"
          >
            <div className="search-bar">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            <button
              className="new-post-btn"
              onClick={() => toast.success('New post feature coming soon!')}
            >
              <Plus size={20} />
              New Post
            </button>
          </motion.div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'forum' && (
            <motion.div
              key="forum"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="forum-content"
            >
              <div className="forum-posts">
                {filteredForumPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    className="forum-post-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="post-header">
                      <div className="author-info">
                        <img src={post.author.avatar} alt={post.author.name} className="author-avatar" />
                        <div>
                          <h4 className="author-name">{post.author.name}</h4>
                          <span className="author-level">{post.author.level}</span>
                        </div>
                      </div>
                      <div className="post-meta">
                        <span className="post-category">{post.category}</span>
                        <span className="post-date">{formatDate(post.createdAt)}</span>
                      </div>
                    </div>

                    <div className="post-content">
                      <h3 className="post-title">{post.title}</h3>
                      <p className="post-excerpt">{post.content}</p>
                      
                      {post.image && (
                        <div className="post-image">
                          <img src={post.image} alt={post.title} />
                        </div>
                      )}

                      <div className="post-tags">
                        {post.tags.map((tag) => (
                          <span key={tag} className="tag">#{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className="post-actions">
                      <button
                        className={`action-btn ${post.isLiked ? 'liked' : ''}`}
                        onClick={() => handleLikePost(post.id)}
                      >
                        <ThumbsUp size={16} />
                        <span>{post.likes}</span>
                      </button>
                      <button
                        className={`action-btn ${post.isDisliked ? 'disliked' : ''}`}
                        onClick={() => handleDislikePost(post.id)}
                      >
                        <ThumbsDown size={16} />
                        <span>{post.dislikes}</span>
                      </button>
                      <button className="action-btn">
                        <MessageCircle size={16} />
                        <span>{post.replies}</span>
                      </button>
                      <button className="action-btn">
                        <Share2 size={16} />
                        Share
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'polls' && (
            <motion.div
              key="polls"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="polls-content"
            >
              <div className="polls-header">
                <button
                  className="new-poll-btn"
                  onClick={() => toast.success('Create poll feature coming soon!')}
                >
                  <Plus size={20} />
                  Create Poll
                </button>
              </div>

              <div className="polls-grid">
                {polls.map((poll) => (
                  <motion.div
                    key={poll.id}
                    className="poll-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="poll-header">
                      <div className="poll-author">
                        <img src={poll.author.avatar} alt={poll.author.name} />
                        <span>{poll.author.name}</span>
                      </div>
                      <span className="poll-date">{formatDate(poll.createdAt)}</span>
                    </div>

                    <h3 className="poll-question">{poll.question}</h3>

                    <div className="poll-options">
                      {poll.options.map((option) => {
                        const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
                        const isSelected = poll.userVote === option.id;
                        
                        return (
                          <button
                            key={option.id}
                            className={`poll-option ${poll.hasVoted ? 'voted' : ''} ${isSelected ? 'selected' : ''}`}
                            onClick={() => !poll.hasVoted && handleVotePoll(poll.id, option.id)}
                            disabled={poll.hasVoted}
                          >
                            <span className="option-text">{option.text}</span>
                            {poll.hasVoted && (
                              <>
                                <div className="option-bar" style={{ width: `${percentage}%` }} />
                                <span className="option-percentage">{percentage.toFixed(1)}%</span>
                              </>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="poll-footer">
                      <span className="poll-votes">{poll.totalVotes} votes</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'ugc' && (
            <motion.div
              key="ugc"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="ugc-content"
            >
              <div className="ugc-grid">
                {ugcPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    className="ugc-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="ugc-image">
                      <img src={post.image} alt={post.title} />
                      <div className="ugc-overlay">
                        <button
                          className={`ugc-like-btn ${post.isLiked ? 'liked' : ''}`}
                          onClick={() => handleLikeUGC(post.id)}
                        >
                          <Heart size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="ugc-content">
                      <div className="ugc-author">
                        <img src={post.author.avatar} alt={post.author.name} />
                        <span>{post.author.name}</span>
                      </div>

                      <h3 className="ugc-title">{post.title}</h3>
                      <p className="ugc-description">{post.description}</p>

                      <div className="ugc-tags">
                        {post.tags.map((tag) => (
                          <span key={tag} className="tag">#{tag}</span>
                        ))}
                      </div>

                      <div className="ugc-stats">
                        <span className="ugc-likes">
                          <Heart size={14} />
                          {post.likes}
                        </span>
                        <span className="ugc-comments">
                          <MessageSquare size={14} />
                          {post.comments}
                        </span>
                        <span className="ugc-date">{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .community-page {
          padding: 2rem 0;
          background: var(--bg-light);
          min-height: 100vh;
        }

        .community-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .community-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: var(--text-dark);
        }

        .community-header p {
          font-size: 1.2rem;
          color: var(--text-light);
        }

        .community-tabs {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
          background: white;
          padding: 1rem;
          border-radius: var(--border-radius-large);
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
        }

        .tab.active {
          background: var(--primary-color);
          color: white;
        }

        .tab:hover:not(.active) {
          background: #f5f5f5;
        }

        .community-controls {
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

        .category-select {
          padding: 0.75rem 1rem;
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          background: white;
          cursor: pointer;
        }

        .new-post-btn, .new-poll-btn {
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

        .new-post-btn:hover, .new-poll-btn:hover {
          background: #e55a2b;
        }

        .forum-posts {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .forum-post-card {
          background: white;
          border-radius: var(--border-radius-large);
          padding: 1.5rem;
          box-shadow: var(--shadow-light);
          transition: var(--transition);
        }

        .forum-post-card:hover {
          box-shadow: var(--shadow-medium);
        }

        .post-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .author-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .author-name {
          font-weight: 600;
          color: var(--text-dark);
          margin: 0;
        }

        .author-level {
          font-size: 0.8rem;
          color: var(--text-light);
        }

        .post-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }

        .post-category {
          background: var(--accent-color);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .post-date {
          font-size: 0.8rem;
          color: var(--text-light);
        }

        .post-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 0.5rem;
        }

        .post-excerpt {
          color: var(--text-light);
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .post-image {
          margin: 1rem 0;
          border-radius: var(--border-radius);
          overflow: hidden;
        }

        .post-image img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .post-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .tag {
          background: #f0f0f0;
          color: var(--text-dark);
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.8rem;
        }

        .post-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem;
          background: transparent;
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
          color: var(--text-light);
        }

        .action-btn:hover {
          background: #f5f5f5;
        }

        .action-btn.liked {
          color: var(--primary-color);
        }

        .action-btn.disliked {
          color: #000000;
        }

        .polls-header {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 2rem;
        }

        .polls-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .poll-card {
          background: white;
          border-radius: var(--border-radius-large);
          padding: 1.5rem;
          box-shadow: var(--shadow-light);
        }

        .poll-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .poll-author {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .poll-author img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          object-fit: cover;
        }

        .poll-question {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 1.5rem;
        }

        .poll-options {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .poll-option {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          background: #f8f9fa;
          border: 2px solid transparent;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
          text-align: left;
        }

        .poll-option:hover:not(.voted) {
          border-color: var(--primary-color);
        }

        .poll-option.voted {
          cursor: default;
        }

        .poll-option.selected {
          border-color: var(--primary-color);
          background: rgba(255, 107, 53, 0.1);
        }

        .option-bar {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background: rgba(255, 107, 53, 0.2);
          border-radius: var(--border-radius);
          transition: width 0.3s ease;
        }

        .option-text {
          position: relative;
          z-index: 1;
        }

        .option-percentage {
          position: relative;
          z-index: 1;
          font-weight: 600;
          color: var(--primary-color);
        }

        .poll-footer {
          text-align: center;
          color: var(--text-light);
          font-size: 0.9rem;
        }

        .ugc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        .ugc-card {
          background: white;
          border-radius: var(--border-radius-large);
          overflow: hidden;
          box-shadow: var(--shadow-light);
          transition: var(--transition);
        }

        .ugc-card:hover {
          box-shadow: var(--shadow-medium);
        }

        .ugc-image {
          position: relative;
          height: 250px;
          overflow: hidden;
        }

        .ugc-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .ugc-card:hover .ugc-image img {
          transform: scale(1.05);
        }

        .ugc-overlay {
          position: absolute;
          top: 1rem;
          right: 1rem;
        }

        .ugc-like-btn {
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

        .ugc-like-btn.liked {
          background: var(--primary-color);
          color: white;
        }

        .ugc-content {
          padding: 1.5rem;
        }

        .ugc-author {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .ugc-author img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          object-fit: cover;
        }

        .ugc-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 0.5rem;
        }

        .ugc-description {
          color: var(--text-light);
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .ugc-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .ugc-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          color: var(--text-light);
        }

        .ugc-likes, .ugc-comments {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        @media (max-width: 768px) {
          .community-tabs {
            flex-direction: column;
          }

          .community-controls {
            flex-direction: column;
          }

          .search-bar {
            width: 100%;
          }

          .polls-grid {
            grid-template-columns: 1fr;
          }

          .ugc-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Community;