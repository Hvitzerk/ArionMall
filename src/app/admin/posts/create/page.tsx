'use client';

import { useState, useEffect } from 'react';
import styles from './create.module.css';

export default function CreatePost() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    brief: '',
    content: '',
    author: '',
    img: '',
    featured: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Verify admin is logged in
  useEffect(() => {
    const verifyLoginStatus = async () => {
      try {
        const res = await fetch('/api/admin/dashboard/verify', {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          }
        });
        
        if (!res.ok) {
          window.location.href = '/admin/auth';
        }
      } catch (err) {
        console.error('Verification error:', err);
        window.location.href = '/admin/auth';
      }
    };
    
    verifyLoginStatus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setSuccess(true);
        setFormData({
          title: '',
          category: '',
          brief: '',
          content: '',
          author: '',
          img: '',
          featured: false
        });
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create post');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container || 'container'}>
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Create New Home Post</h1>
        <a 
          href="/admin/dashboard" 
          style={{ 
            backgroundColor: '#4a5568', 
            color: 'white', 
            padding: '0.5rem 1rem', 
            borderRadius: '0.25rem', 
            textDecoration: 'none', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem' 
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Dashboard
        </a>
      </div>

      {success && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#c6f6d5', 
          borderRadius: '0.25rem', 
          color: '#2f855a', 
          marginBottom: '1rem' 
        }}>
          Post created successfully!
        </div>
      )}

      {error && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#fed7d7', 
          borderRadius: '0.25rem', 
          color: '#c53030', 
          marginBottom: '1rem' 
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: 'white', 
        padding: '1.5rem', 
        borderRadius: '0.5rem', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' 
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'medium' }}>
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              borderRadius: '0.25rem', 
              border: '1px solid #e2e8f0' 
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="category" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'medium' }}>
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              borderRadius: '0.25rem', 
              border: '1px solid #e2e8f0',
              appearance: 'menulist' 
            }}
          >
            <option value="">Select a category</option>
            <option value="News">News</option>
            <option value="Event">Event</option>
            <option value="Promotion">Promotion</option>
            <option value="Update">Update</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="brief" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'medium' }}>
            Brief Description *
          </label>
          <textarea
            id="brief"
            name="brief"
            value={formData.brief}
            onChange={handleChange}
            required
            rows={3}
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              borderRadius: '0.25rem', 
              border: '1px solid #e2e8f0' 
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="content" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'medium' }}>
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={8}
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              borderRadius: '0.25rem', 
              border: '1px solid #e2e8f0' 
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="author" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'medium' }}>
            Author *
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              borderRadius: '0.25rem', 
              border: '1px solid #e2e8f0' 
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="img" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'medium' }}>
            Image URL *
          </label>
          <input
            type="text"
            id="img"
            name="img"
            value={formData.img}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              borderRadius: '0.25rem', 
              border: '1px solid #e2e8f0' 
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              style={{ width: '1rem', height: '1rem' }}
            />
            <span>Featured Post</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ 
            backgroundColor: '#3182ce', 
            color: 'white', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '0.25rem', 
            border: 'none', 
            fontWeight: 'medium',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Submitting...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}
