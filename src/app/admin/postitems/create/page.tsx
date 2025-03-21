'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './create.module.css';

interface ValidationErrors {
  title?: string;
  category?: string;
  brief?: string;
  author?: string;
  avatar?: string;
  img?: string;
}

export default function CreatePostItem() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    brief: '',
    author: '',
    avatar: '',
    img: '',
    top: false,
    whatsNew: false,
    showInMiddle: false,
    order: 0 // Default order is 0 now instead of 999
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [imagePreview, setImagePreview] = useState({ avatar: '', img: '' });

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
          router.push('/admin/auth');
        }
      } catch (err) {
        console.error('Verification error:', err);
        router.push('/admin/auth');
      }
    };
    
    verifyLoginStatus();
  }, [router]);

  // Preview images when URLs change
  useEffect(() => {
    if (formData.avatar) {
      setImagePreview(prev => ({ ...prev, avatar: formData.avatar }));
    } else {
      setImagePreview(prev => ({ ...prev, avatar: '' }));
    }
    
    if (formData.img) {
      setImagePreview(prev => ({ ...prev, img: formData.img }));
    } else {
      setImagePreview(prev => ({ ...prev, img: '' }));
    }
  }, [formData.avatar, formData.img]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Clear validation error when field is edited
    setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked
      });
    } else if (name === 'order') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;
    
    // Validate title
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
      isValid = false;
    } else if (formData.title.length > 100) {
      errors.title = 'Title must be less than 100 characters';
      isValid = false;
    }
    
    // Validate category
    if (!formData.category.trim()) {
      errors.category = 'Category is required';
      isValid = false;
    }
    
    // Validate brief
    if (!formData.brief.trim()) {
      errors.brief = 'Brief description is required';
      isValid = false;
    } else if (formData.brief.length > 500) {
      errors.brief = 'Brief description must be less than 500 characters';
      isValid = false;
    }
    
    // Validate author
    if (!formData.author.trim()) {
      errors.author = 'Author name is required';
      isValid = false;
    }
    
    // Validate avatar URL format if provided
    if (formData.avatar && !isValidURL(formData.avatar)) {
      errors.avatar = 'Avatar must be a valid URL';
      isValid = false;
    }
    
    // Validate image URL format if provided
    if (formData.img && !isValidURL(formData.img)) {
      errors.img = 'Image must be a valid URL';
      isValid = false;
    }
    
    setValidationErrors(errors);
    return isValid;
  };
  
  const isValidURL = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const response = await fetch('/api/postitems', {
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
          author: '',
          avatar: '',
          img: '',
          top: false,
          whatsNew: false,
          showInMiddle: false,
          order: 0
        });
        setValidationErrors({});
        setImagePreview({ avatar: '', img: '' });
        
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create post item');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Link href="/admin/postitems" className={styles.backLink}>
            <i className="bi bi-arrow-left"></i> Back to Post Items
          </Link>
          <h1>Create New Post Item</h1>
        </div>
      </div>

      {success && (
        <div className={styles.success}>
          <i className="bi bi-check-circle"></i>
          <span>Post item created successfully!</span>
          <div className={styles.successActions}>
            <button 
              onClick={() => setSuccess(false)}
              className={styles.createAnother}
            >
              Create Another
            </button>
            <Link href="/admin/postitems" className={styles.viewAll}>
              View All Items
            </Link>
          </div>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <i className="bi bi-exclamation-triangle"></i>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formSection}>
          <h2>Basic Information</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Title <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`${styles.input} ${validationErrors.title ? styles.inputError : ''}`}
              placeholder="Enter post title"
            />
            {validationErrors.title && (
              <div className={styles.errorMessage}>{validationErrors.title}</div>
            )}
            <div className={styles.hint}>
              Maximum 100 characters
              <span className={styles.charCount}>{formData.title.length}/100</span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.label}>
              Category <span className={styles.required}>*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`${styles.select} ${validationErrors.category ? styles.inputError : ''}`}
            >
              <option value="">Select a category</option>
              <option value="News">News</option>
              <option value="Event">Event</option>
              <option value="Promotion">Promotion</option>
              <option value="Announcement">Announcement</option>
              <option value="Other">Other</option>
            </select>
            {validationErrors.category && (
              <div className={styles.errorMessage}>{validationErrors.category}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="brief" className={styles.label}>
              Brief Description <span className={styles.required}>*</span>
            </label>
            <textarea
              id="brief"
              name="brief"
              value={formData.brief}
              onChange={handleChange}
              rows={4}
              className={`${styles.textarea} ${validationErrors.brief ? styles.inputError : ''}`}
              placeholder="Enter a brief description"
            ></textarea>
            {validationErrors.brief && (
              <div className={styles.errorMessage}>{validationErrors.brief}</div>
            )}
            <div className={styles.hint}>
              Provide a concise summary of your post
              <span className={styles.charCount}>{formData.brief.length}/500</span>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2>Author Information</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="author" className={styles.label}>
              Author Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={`${styles.input} ${validationErrors.author ? styles.inputError : ''}`}
              placeholder="Enter author name"
            />
            {validationErrors.author && (
              <div className={styles.errorMessage}>{validationErrors.author}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="avatar" className={styles.label}>
              Author Avatar URL
            </label>
            <input
              type="text"
              id="avatar"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              className={`${styles.input} ${validationErrors.avatar ? styles.inputError : ''}`}
              placeholder="Enter avatar image URL"
            />
            {validationErrors.avatar && (
              <div className={styles.errorMessage}>{validationErrors.avatar}</div>
            )}
            <div className={styles.hint}>Optional - URL to author's profile picture</div>
            
            {imagePreview.avatar && (
              <div className={styles.imagePreview}>
                <img 
                  src={imagePreview.avatar} 
                  alt="Avatar preview"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/assets/img/placeholder.jpg';
                    setValidationErrors(prev => ({
                      ...prev,
                      avatar: 'Unable to load image from this URL'
                    }));
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className={styles.formSection}>
          <h2>Media</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="img" className={styles.label}>
              Feature Image URL
            </label>
            <input
              type="text"
              id="img"
              name="img"
              value={formData.img}
              onChange={handleChange}
              className={`${styles.input} ${validationErrors.img ? styles.inputError : ''}`}
              placeholder="Enter feature image URL"
            />
            {validationErrors.img && (
              <div className={styles.errorMessage}>{validationErrors.img}</div>
            )}
            <div className={styles.hint}>Optional - URL to the main image for this post</div>
            
            {imagePreview.img && (
              <div className={styles.imagePreview}>
                <img 
                  src={imagePreview.img} 
                  alt="Feature image preview"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/assets/img/placeholder.jpg';
                    setValidationErrors(prev => ({
                      ...prev,
                      img: 'Unable to load image from this URL'
                    }));
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className={styles.formSection}>
          <h2>Display Settings</h2>
          
          <div className={styles.checkboxGroup}>
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                id="top"
                name="top"
                checked={formData.top}
                onChange={handleChange}
              />
              <label htmlFor="top">Feature as Top Post</label>
            </div>
            
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                id="whatsNew"
                name="whatsNew"
                checked={formData.whatsNew}
                onChange={handleChange}
              />
              <label htmlFor="whatsNew">Mark as What's New</label>
            </div>
            
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                id="showInMiddle"
                name="showInMiddle"
                checked={formData.showInMiddle}
                onChange={handleChange}
              />
              <label htmlFor="showInMiddle">Show in Middle Section</label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="order" className={styles.label}>
              Display Order
            </label>
            <input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="0"
              className={styles.input}
              placeholder="Enter display order (lower numbers appear first)"
            />
            <div className={styles.hint}>
              Lower numbers will be displayed first in listings. Default is 0.
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={() => router.push('/admin/postitems')}
            className={styles.cancelButton}
            disabled={loading}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className={styles.spinnerSmall}></div>
                Creating...
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle"></i>
                Create Post Item
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
