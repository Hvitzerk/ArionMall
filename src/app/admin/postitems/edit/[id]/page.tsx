'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './edit.module.css';
import { usePostItem } from '@/hooks/usePostItems';

interface EditPostItemProps {
  params: {
    id: string;
  };
}

export default function EditPostItem({ params: { id } }: EditPostItemProps) {
  const router = useRouter();
  const { postItem, isLoading, isError, mutate } = usePostItem(id);
  
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
    order: 0,
  });

  const [validationErrors, setValidationErrors] = useState({
    title: '',
    category: '',
    brief: '',
    author: '',
    avatar: '',
    img: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState({ avatar: '', img: '' });

  // Populate form when postItem is loaded
  useEffect(() => {
    if (postItem) {
      setFormData({
        title: postItem.title,
        category: postItem.category,
        brief: postItem.brief,
        author: postItem.author,
        avatar: postItem.avatar,
        img: postItem.img,
        top: postItem.top,
        whatsNew: postItem.whatsNew,
        showInMiddle: postItem.showInMiddle,
        order: postItem.order || 0,
      });
      
      setImagePreview({
        avatar: postItem.avatar,
        img: postItem.img
      });
    }
  }, [postItem]);

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

  // Validate URL
  const isValidUrl = (urlString: string) => {
    try {
      if (urlString === '') return true; // Empty is ok
      new URL(urlString);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Validate form inputs
  const validateField = (name: string, value: string) => {
    let errorMessage = '';
    
    switch (name) {
      case 'title':
        if (!value.trim()) {
          errorMessage = 'Title is required';
        } else if (value.length > 100) {
          errorMessage = 'Title cannot exceed 100 characters';
        }
        break;
      case 'category':
        if (!value.trim()) {
          errorMessage = 'Category is required';
        } else if (value.length > 50) {
          errorMessage = 'Category cannot exceed 50 characters';
        }
        break;
      case 'brief':
        if (!value.trim()) {
          errorMessage = 'Brief description is required';
        } else if (value.length > 300) {
          errorMessage = 'Brief description cannot exceed 300 characters';
        }
        break;
      case 'author':
        if (!value.trim()) {
          errorMessage = 'Author name is required';
        } else if (value.length > 50) {
          errorMessage = 'Author name cannot exceed 50 characters';
        }
        break;
      case 'avatar':
        if (value && !isValidUrl(value)) {
          errorMessage = 'Avatar must be a valid URL';
        }
        break;
      case 'img':
        if (!value.trim()) {
          errorMessage = 'Feature image is required';
        } else if (!isValidUrl(value)) {
          errorMessage = 'Feature image must be a valid URL';
        }
        break;
      default:
        break;
    }
    
    return errorMessage;
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
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
      
      // Update image preview for URLs
      if (name === 'avatar' || name === 'img') {
        if (isValidUrl(value)) {
          setImagePreview(prev => ({
            ...prev,
            [name]: value
          }));
        }
      }
      
      // Validate field
      const errorMessage = validateField(name, value);
      setValidationErrors(prev => ({
        ...prev,
        [name]: errorMessage
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    // Validate all fields
    const errors = {
      title: validateField('title', formData.title),
      category: validateField('category', formData.category),
      brief: validateField('brief', formData.brief),
      author: validateField('author', formData.author),
      avatar: validateField('avatar', formData.avatar),
      img: validateField('img', formData.img),
    };
    
    setValidationErrors(errors);
    
    // Check if there are any errors
    const hasErrors = Object.values(errors).some(error => error !== '');
    
    if (hasErrors) {
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch(`/api/postitems/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update post item');
      }
      
      // Update SWR cache
      mutate();
      
      setSuccess(true);
      window.scrollTo(0, 0);
      
      // Redirect after delay
      setTimeout(() => {
        router.push('/admin/postitems');
      }, 2000);
    } catch (err) {
      console.error('Error updating post item:', err);
      setError(err instanceof Error ? err.message : 'Failed to update post item');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading post item...</p>
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <i className="bi bi-exclamation-circle"></i>
          <p>{isError instanceof Error ? isError.message : 'Failed to load post item'}</p>
          <button 
            onClick={() => mutate()}
            className={styles.retryButton}
          >
            Retry
          </button>
          <Link href="/admin/postitems" className={styles.backButton}>
            Back to Post Items
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link href="/admin/postitems" className={styles.backLink}>
        <i className="bi bi-arrow-left"></i> Back to Post Items
      </Link>
      
      <div className={styles.header}>
        <h1>Edit Post Item</h1>
      </div>
      
      {success && (
        <div className={styles.success}>
          <i className="bi bi-check-circle"></i>
          <span>Post item updated successfully!</span>
          <p>Redirecting to post items list...</p>
        </div>
      )}
      
      {error && (
        <div className={styles.error}>
          <i className="bi bi-exclamation-circle"></i>
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
              <span>Post titles should be clear and concise</span>
              <span className={styles.charCount}>{formData.title.length}/100</span>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.label}>
              Category <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`${styles.input} ${validationErrors.category ? styles.inputError : ''}`}
              placeholder="Enter post category"
            />
            {validationErrors.category && (
              <div className={styles.errorMessage}>{validationErrors.category}</div>
            )}
            <div className={styles.hint}>
              <span>E.g., News, Event, Promotion</span>
              <span className={styles.charCount}>{formData.category.length}/50</span>
            </div>
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
              className={`${styles.textarea} ${validationErrors.brief ? styles.inputError : ''}`}
              placeholder="Enter a brief description"
            ></textarea>
            {validationErrors.brief && (
              <div className={styles.errorMessage}>{validationErrors.brief}</div>
            )}
            <div className={styles.hint}>
              <span>A short summary of the post</span>
              <span className={styles.charCount}>{formData.brief.length}/300</span>
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
            <div className={styles.hint}>
              <span>Full name of the author</span>
              <span className={styles.charCount}>{formData.author.length}/50</span>
            </div>
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
              placeholder="Enter avatar URL (optional)"
            />
            {validationErrors.avatar && (
              <div className={styles.errorMessage}>{validationErrors.avatar}</div>
            )}
            <div className={styles.hint}>
              <span>URL to the author's profile photo</span>
            </div>
            
            {imagePreview.avatar && (
              <div className={styles.imagePreview}>
                <img 
                  src={imagePreview.avatar} 
                  alt="Avatar Preview" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.formSection}>
          <h2>Image & Display Options</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="img" className={styles.label}>
              Feature Image URL <span className={styles.required}>*</span>
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
            <div className={styles.hint}>
              <span>URL to the main image for this post</span>
            </div>
            
            {imagePreview.img && (
              <div className={styles.imagePreview}>
                <img 
                  src={imagePreview.img} 
                  alt="Feature Image Preview" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}
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
              className={styles.input}
              min="0"
            />
            <div className={styles.hint}>
              <span>Lower numbers appear first. Default is 0.</span>
            </div>
          </div>
          
          <div className={styles.checkboxGroup}>
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                id="top"
                name="top"
                checked={formData.top}
                onChange={handleChange}
              />
              <label htmlFor="top">Display as Top Post</label>
            </div>
            
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                id="whatsNew"
                name="whatsNew"
                checked={formData.whatsNew}
                onChange={handleChange}
              />
              <label htmlFor="whatsNew">Display in What's New Section</label>
            </div>
            
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                id="showInMiddle"
                name="showInMiddle"
                checked={formData.showInMiddle}
                onChange={handleChange}
              />
              <label htmlFor="showInMiddle">Display in Middle Section</label>
            </div>
          </div>
        </div>
        
        <div className={styles.formActions}>
          <Link href="/admin/postitems" className={styles.cancelButton}>
            <i className="bi bi-x"></i> Cancel
          </Link>
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className={styles.spinnerSmall}></div>
                Updating...
              </>
            ) : (
              <>
                <i className="bi bi-check2"></i> 
                Update Post Item
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
