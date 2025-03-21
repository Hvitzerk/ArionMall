'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './postitems.module.css';
import { usePostItems, useFilteredPostItems } from '@/hooks/usePostItems';

export default function PostItemsAdmin() {
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [editingOrder, setEditingOrder] = useState<{ id: string, value: number } | null>(null);
  const [updateOrderStatus, setUpdateOrderStatus] = useState<{ success: boolean, message: string } | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    brief: '',
    img: '',
    avatar: '',
    author: '',
    top: false,
    whatsNew: false,
    showInMiddle: false,
    order: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const router = useRouter();

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

  // Fetch post items using SWR hook
  const { postItems, isLoading, isError, mutate } = usePostItems();
  
  // Filter and sort posts
  const {
    searchTerm,
    setSearchTerm,
    sortBy,
    sortOrder,
    toggleSort,
    filterMiddle,
    toggleMiddleFilter,
    getMiddleFilterText,
    updateItemOrder,
    sortedPosts,
    filteredPostsCount
  } = useFilteredPostItems(postItems);

  // Handle delete
  const confirmDelete = (id: string) => {
    setDeleteItemId(id);
    setShowConfirmation(true);
    setDeleteError('');
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setDeleteItemId(null);
    setDeleteError('');
  };

  const handleDelete = async () => {
    if (!deleteItemId) return;
    
    try {
      const res = await fetch(`/api/postitems/${deleteItemId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete item');
      }
      
      // Close confirmation modal
      setShowConfirmation(false);
      setDeleteItemId(null);
      
      // Revalidate data (refetch from server)
      mutate();
    } catch (err) {
      console.error('Error deleting post item:', err);
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  // Quick edit order
  const startEditingOrder = (id: string, currentOrder: number) => {
    setEditingOrder({ id, value: currentOrder });
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingOrder) {
      const newValue = parseInt(e.target.value) || 0;
      setEditingOrder({ ...editingOrder, value: newValue });
    }
  };

  const handleOrderKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await saveOrder();
    } else if (e.key === 'Escape') {
      setEditingOrder(null);
    }
  };

  const saveOrder = async () => {
    if (!editingOrder) return;
    
    setUpdateOrderStatus(null);
    
    try {
      const success = await updateItemOrder(editingOrder.id, editingOrder.value);
      
      if (success) {
        setUpdateOrderStatus({
          success: true,
          message: `Order updated to ${editingOrder.value}`
        });
        
        // Revalidate data
        mutate();
        
        // Clear update message after 3 seconds
        setTimeout(() => {
          setUpdateOrderStatus(null);
        }, 3000);
      } else {
        throw new Error('Failed to update order');
      }
    } catch (err) {
      setUpdateOrderStatus({
        success: false,
        message: 'Failed to update order'
      });
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setUpdateOrderStatus(null);
      }, 3000);
    }
    
    setEditingOrder(null);
  };

  // Modal edit functions
  const openEditModal = async (id: string) => {
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const res = await fetch(`/api/postitems/${id}`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch item data');
      }
      
      const data = await res.json();
      setEditItem(data);
      setFormData({
        title: data.title || '',
        category: data.category || '',
        brief: data.brief || '',
        img: data.img || '',
        avatar: data.avatar || '',
        author: data.author || '',
        top: data.top || false,
        whatsNew: data.whatsNew || false,
        showInMiddle: data.showInMiddle || false,
        order: data.order || 0
      });
      setShowEditModal(true);
    } catch (err) {
      console.error('Error fetching item data:', err);
      setError('Failed to load item data for editing');
    }
    
    setLoading(false);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditItem(null);
    setError('');
    setSuccess('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: checked });
    } else if (name === 'order') {
      const orderValue = parseInt(value) || 0;
      setFormData({ ...formData, [name]: orderValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editItem?._id) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await fetch(`/api/postitems/${editItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update item');
      }
      
      setSuccess('Post item updated successfully!');
      
      // Revalidate data
      mutate();
      
      // Close modal after successful update
      setTimeout(() => {
        closeEditModal();
      }, 2000);
    } catch (err) {
      console.error('Error updating post item:', err);
      setError(err instanceof Error ? err.message : 'Failed to update item');
    }
    
    setLoading(false);
  };

  // Date formatter
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Truncate text
  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // Check if we have URL params for notifications
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('deleted') === 'true') {
      // Could show a toast notification here if you have one
      console.log('Item deleted successfully');
      
      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Manage Post Items</h1>
        <Link href="/admin/postitems/create" className={styles.createButton}>
          <i className="bi bi-plus-circle"></i> Create New Post Item
        </Link>
      </div>

      {updateOrderStatus && (
        <div className={`${styles.notification} ${updateOrderStatus.success ? styles.success : styles.error}`}>
          <i className={updateOrderStatus.success ? "bi bi-check-circle" : "bi bi-exclamation-circle"}></i>
          <span>{updateOrderStatus.message}</span>
        </div>
      )}

      <div className={styles.controls}>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <i className="bi bi-search"></i>
        </div>

        <div className={styles.sortControls}>
          <button
            className={`${styles.filterButton} ${filterMiddle !== null ? styles.active : ''}`}
            onClick={toggleMiddleFilter}
          >
            <i className="bi bi-funnel"></i>
            {getMiddleFilterText()}
          </button>
          
          <span>Sort by:</span>
          <button 
            className={`${styles.sortButton} ${sortBy === 'title' ? styles.active : ''}`}
            onClick={() => toggleSort('title')}
          >
            Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            className={`${styles.sortButton} ${sortBy === 'createdAt' ? styles.active : ''}`}
            onClick={() => toggleSort('createdAt')}
          >
            Created {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            className={`${styles.sortButton} ${sortBy === 'updatedAt' ? styles.active : ''}`}
            onClick={() => toggleSort('updatedAt')}
          >
            Updated {sortBy === 'updatedAt' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            className={`${styles.sortButton} ${sortBy === 'order' ? styles.active : ''}`}
            onClick={() => toggleSort('order')}
          >
            Order {sortBy === 'order' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading post items...</p>
        </div>
      ) : isError ? (
        <div className={styles.error}>
          <p>{isError instanceof Error ? isError.message : 'Failed to load post items'}</p>
          <button 
            onClick={() => mutate()}
            className={styles.retryButton}
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className={styles.itemCount}>
            {filteredPostsCount} items found {filterMiddle === true && "(Show in Middle Only)"}
          </div>

          <div className={styles.itemsGrid}>
            {sortedPosts.map((item) => (
              <div key={item._id} className={`${styles.itemCard} ${item.showInMiddle ? styles.middleItem : ''}`}>
                <div className={styles.imageContainer}>
                  {item.img ? (
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className={styles.itemImage}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/assets/img/placeholder.jpg';
                      }}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <i className="bi bi-image"></i>
                    </div>
                  )}
                  <div className={styles.itemBadges}>
                    {item.top && <span className={styles.topBadge}>TOP</span>}
                    {item.whatsNew && <span className={styles.newBadge}>NEW</span>}
                    {item.showInMiddle && <span className={styles.middleBadge}>MIDDLE</span>}
                  </div>
                </div>
                
                <div className={styles.itemContent}>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  <div className={styles.itemCategory}>{item.category}</div>
                  <p className={styles.itemBrief}>{truncateText(item.brief)}</p>
                  
                  <div className={styles.itemMeta}>
                    <div className={styles.author}>
                      {item.avatar ? (
                        <img src={item.avatar} alt={item.author} className={styles.authorAvatar} />
                      ) : (
                        <div className={styles.authorPlaceholder}>
                          <i className="bi bi-person"></i>
                        </div>
                      )}
                      <span>{item.author}</span>
                    </div>
                    <div 
                      className={styles.order}
                      onClick={() => startEditingOrder(item._id, item.order)}
                    >
                      {editingOrder && editingOrder.id === item._id ? (
                        <div className={styles.orderEdit}>
                          <input
                            type="number"
                            value={editingOrder.value}
                            onChange={handleOrderChange}
                            onKeyDown={handleOrderKeyDown}
                            onBlur={saveOrder}
                            autoFocus
                            min="0"
                            className={styles.orderInput}
                          />
                        </div>
                      ) : (
                        <>
                          Order: <span className={styles.orderValue}>{item.order}</span>
                          <i className="bi bi-pencil-square"></i>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.itemDates}>
                    <div>Created: {formatDate(item.createdAt)}</div>
                    <div>Updated: {formatDate(item.updatedAt)}</div>
                  </div>
                  
                  <div className={styles.itemActions}>
                    <button 
                      onClick={() => openEditModal(item._id)}
                      className={styles.editButton}
                    >
                      <i className="bi bi-pencil"></i> Edit
                    </button>
                    <button 
                      onClick={() => confirmDelete(item._id)}
                      className={styles.deleteButton}
                    >
                      <i className="bi bi-trash"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmation && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this post item? This action cannot be undone.</p>
            
            {deleteError && (
              <div className={styles.errorMessage}>
                <i className="bi bi-exclamation-circle"></i>
                <span>{deleteError}</span>
              </div>
            )}
            
            <div className={styles.modalActions}>
              <button
                onClick={cancelDelete}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className={styles.deleteConfirmButton}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className={styles.modalOverlay} onClick={(e) => {
          if (e.target === e.currentTarget) closeEditModal();
        }}>
          <div className={styles.editModalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.editModalHeader}>
              <h2>Edit Post Item</h2>
              <button 
                className={styles.closeButton}
                onClick={closeEditModal}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            
            {error && (
              <div className={styles.errorMessage}>
                <i className="bi bi-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className={styles.successMessage}>
                <i className="bi bi-check-circle"></i>
                <span>{success}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className={styles.editForm}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="category">Category</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="img">Image URL</label>
                <input
                  type="text"
                  id="img"
                  name="img"
                  value={formData.img}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="brief">Brief</label>
                <textarea
                  id="brief"
                  name="brief"
                  value={formData.brief}
                  onChange={handleChange}
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="author">Author</label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="avatar">Avatar URL</label>
                  <input
                    type="text"
                    id="avatar"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="order">Order (smaller values appear first)</label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  min="0"
                />
                <small>Default value is 0. Lower numbers will be displayed first.</small>
              </div>
              
              <div className={styles.formCheckboxes}>
                <div className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id="top"
                    name="top"
                    checked={formData.top}
                    onChange={handleChange}
                  />
                  <label htmlFor="top">Top Post</label>
                </div>
                
                <div className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id="whatsNew"
                    name="whatsNew"
                    checked={formData.whatsNew}
                    onChange={handleChange}
                  />
                  <label htmlFor="whatsNew">What's New</label>
                </div>
                
                <div className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id="showInMiddle"
                    name="showInMiddle"
                    checked={formData.showInMiddle}
                    onChange={handleChange}
                  />
                  <label htmlFor="showInMiddle">Show in Middle</label>
                </div>
              </div>
              
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className={styles.cancelButton}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className={styles.smallSpinner}></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>Save Changes</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
