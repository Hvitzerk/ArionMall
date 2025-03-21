'use client';

import React, { useState, useEffect, useCallback } from 'react';
import './postitemsmanager.css';

interface PostItem {
  _id: string;
  img: string;
  category: string;
  date: string;
  title: string;
  brief: string | null;
  avatar: string | null;
  author: string | null;
  top: boolean;
  whatsNew: boolean;
  showInMiddle: boolean;
  order: number;
}

export default function PostItemsManager() {
  const [postItems, setPostItems] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  
  // Form state for creating/editing
  const [formData, setFormData] = useState({
    _id: '',
    title: '',
    category: '',
    brief: '',
    img: '',
    author: '',
    avatar: '',
    top: false,
    whatsNew: false,
    showInMiddle: false,
    order: 0,
    date: ''
  });
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  useEffect(() => {
    fetchPostItems();
  }, []);
  
  const fetchPostItems = async () => {
    try {
      setLoading(true);
      const timestamp = new Date().getTime();
      const res = await fetch(`/api/postitems?t=${timestamp}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log('PostItems fetched:', data);
        setPostItems(data);
      } else {
        setError('Failed to fetch post items');
      }
    } catch (err) {
      console.error('Error fetching post items:', err);
      setError('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setFormData({
      _id: '',
      title: '',
      category: '',
      brief: '',
      img: '',
      author: '',
      avatar: '',
      top: false,
      whatsNew: false,
      showInMiddle: false,
      order: 0,
      date: ''
    });
    setEditingItemId(null);
  };
  
  const cancelEdit = () => {
    resetForm();
    setEditingItemId(null);
  };
  
  const handleEdit = (item: PostItem) => {
    setEditingItemId(item._id);
    setFormData({
      _id: item._id,
      title: item.title,
      category: item.category,
      brief: item.brief || '',
      img: item.img,
      author: item.author || '',
      avatar: item.avatar || '',
      top: item.top,
      whatsNew: item.whatsNew,
      showInMiddle: item.showInMiddle,
      order: item.order,
      date: item.date
    });
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus item ini?')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/postitems/${id}`, {
        method: 'DELETE',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (res.ok) {
        console.log('Item deleted successfully');
        // Refresh the list
        fetchPostItems();
      } else {
        const data = await res.json();
        setError(`Failed to delete: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error deleting post item:', err);
      setError('An error occurred while deleting the item');
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    console.log(`Checkbox ${name} changed to ${checked}`);
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleInputChange = (nameOrEvent: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value?: any) => {
    if (typeof nameOrEvent === 'string') {
      // Called with name and value
      const name = nameOrEvent;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      // Called with event
      const { name, value, type } = nameOrEvent.target;
      
      if (type === 'checkbox') {
        setFormData(prev => ({
          ...prev,
          [name]: (nameOrEvent.target as HTMLInputElement).checked
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    }
  };
  
  const handleSubmit = async (eOrId: React.FormEvent | string = '') => {
    // If it's an event, prevent default behavior
    if (typeof eOrId !== 'string') {
      eOrId.preventDefault();
    }
    
    // Determine the ID for API endpoint
    const itemId = typeof eOrId === 'string' ? eOrId : editingItemId;
    
    try {
      setLoading(true);
      console.log("Processing submission with data:", formData);
      
      // Standardize image path - ensure it starts without a leading slash
      let imgPath = formData.img;
      if (imgPath.startsWith('/')) {
        imgPath = imgPath.substring(1);
      }
      
      // Convert checkboxes and order to their proper types
      const processedData = {
        ...formData,
        img: imgPath,
        order: Number(formData.order),
        top: Boolean(formData.top),
        whatsNew: Boolean(formData.whatsNew),
        showInMiddle: Boolean(formData.showInMiddle)
      };
      
      console.log("Submitting processed data:", processedData);
      
      const url = itemId
        ? `/api/postitems/${itemId}`
        : '/api/postitems';
        
      const method = itemId ? 'PUT' : 'POST';
      
      console.log(`Sending ${method} request to ${url}`);
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(processedData)
      });
      
      if (res.ok) {
        const responseData = await res.json();
        console.log(itemId ? 'Item updated:' : 'Item created:', responseData);
        
        // Reset the form
        resetForm();
        setShowCreateForm(false);
        
        // Refresh the list
        fetchPostItems();
      } else {
        const errorData = await res.json();
        console.error("Server response error:", await res.text());
        setError(`Failed to ${itemId ? 'update' : 'create'} item: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(`Error ${itemId ? 'updating' : 'creating'} post item:`, err);
      setError(`An error occurred while ${itemId ? 'updating' : 'creating'} the item`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="post-items-container">
      <div className="post-items-header">
        <h2>Post Items Manager</h2>
      </div>
      
      {!editingItemId && (
        <div className="post-items-form">
          <h3 className="text-lg font-medium mb-4">{formData._id ? 'Edit Post Item' : 'Add New Post Item'}</h3>
          <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1">Image URL</label>
                <input
                  type="text"
                  name="img"
                  value={formData.img}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1">Author</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block mb-1">Avatar URL</label>
                <input
                  type="text"
                  name="avatar"
                  value={formData.avatar}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block mb-1">Order</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block mb-1">Brief Description</label>
              <textarea
                name="brief"
                value={formData.brief}
                onChange={(e) => handleInputChange(e)}
                className="w-full border rounded-md px-3 py-2"
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="top"
                  checked={formData.top}
                  onChange={handleCheckboxChange}
                  className="rounded"
                />
                <span>Top Post</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="whatsNew"
                  checked={formData.whatsNew}
                  onChange={handleCheckboxChange}
                  className="rounded"
                />
                <span>What's New</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="showInMiddle"
                  checked={formData.showInMiddle}
                  onChange={handleCheckboxChange}
                  className="rounded"
                />
                <span>Show in Middle</span>
              </label>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowCreateForm(false);
                }}
                className="bg-gray-300 hover:bg-gray-400 rounded-md px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2"
              >
                Create Item
              </button>
            </div>
          </form>
        </div>
      )}
      
      {loading ? (
        <div className="loading-indicator">
          <p>Loading post items...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="post-items-table">
            <thead>
              <tr>
                <th className="w-1/12">Order</th>
                <th className="w-1/6">Title</th>
                <th className="w-1/6">Category</th>
                <th className="w-1/12">Image</th>
                <th className="w-1/12">Author</th>
                <th className="w-1/12">Top</th>
                <th className="w-1/12">New</th>
                <th className="w-1/12">Middle</th>
                <th className="w-1/6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {postItems.map((item) => (
                <React.Fragment key={item._id}>
                  {editingItemId === item._id ? (
                    <tr className="inline-edit-row">
                      <td colSpan={9}>
                        <div className="p-3">
                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div>
                              <label className="form-label">Title:</label>
                              <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleInputChange(e)}
                                className="w-full p-2 border border-gray-300 rounded"
                              />
                            </div>
                            <div>
                              <label className="form-label">Category:</label>
                              <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => handleInputChange(e)}
                                className="w-full p-2 border border-gray-300 rounded"
                              />
                            </div>
                            <div>
                              <label className="form-label">Image URL:</label>
                              <input
                                type="text"
                                value={formData.img}
                                onChange={(e) => handleInputChange(e)}
                                className="w-full p-2 border border-gray-300 rounded"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div>
                              <label className="form-label">Brief:</label>
                              <textarea
                                value={formData.brief}
                                onChange={(e) => handleInputChange(e)}
                                className="w-full p-2 border border-gray-300 rounded"
                                rows={2}
                              />
                            </div>
                            <div>
                              <label className="form-label">Author:</label>
                              <input
                                type="text"
                                value={formData.author || ''}
                                onChange={(e) => handleInputChange(e)}
                                className="w-full p-2 border border-gray-300 rounded"
                              />
                            </div>
                            <div>
                              <label className="form-label">Avatar URL:</label>
                              <input
                                type="text"
                                value={formData.avatar || ''}
                                onChange={(e) => handleInputChange(e)}
                                className="w-full p-2 border border-gray-300 rounded"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="checkbox-container">
                              <input
                                type="checkbox"
                                id={`top-${item._id}`}
                                name="top"
                                checked={formData.top}
                                onChange={(e) => handleCheckboxChange(e)}
                              />
                              <label htmlFor={`top-${item._id}`} className="form-label mb-0">Top Item</label>
                            </div>
                            <div className="checkbox-container">
                              <input
                                type="checkbox"
                                id={`whatsNew-${item._id}`}
                                name="whatsNew"
                                checked={formData.whatsNew}
                                onChange={(e) => handleCheckboxChange(e)}
                              />
                              <label htmlFor={`whatsNew-${item._id}`} className="form-label mb-0">What's New</label>
                            </div>
                            <div className="checkbox-container">
                              <input
                                type="checkbox"
                                id={`showInMiddle-${item._id}`}
                                name="showInMiddle"
                                checked={formData.showInMiddle}
                                onChange={(e) => handleCheckboxChange(e)}
                              />
                              <label htmlFor={`showInMiddle-${item._id}`} className="form-label mb-0">Show in Middle</label>
                            </div>
                          </div>
                          
                          <div className="inline-form-actions">
                            <button
                              type="button"
                              onClick={() => {
                                console.log("Saving changes for item:", item._id);
                                console.log("Current form data:", formData);
                                handleSubmit(item._id);
                              }}
                              className="save-button"
                              disabled={loading}
                            >
                              {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="cancel-button"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td>{item.order || 0}</td>
                      <td>{item.title}</td>
                      <td>{item.category}</td>
                      <td>
                        {item.img && (
                          <div className="relative">
                            <img
                              src={item.img}
                              alt={item.title}
                              className="post-image-preview"
                              onError={(e) => {
                                console.log("Image failed to load:", item.img);
                                const imgSrc = item.img;
                                if (imgSrc && !imgSrc.startsWith('http') && !imgSrc.startsWith('/')) {
                                  (e.target as HTMLImageElement).src = '/' + imgSrc;
                                  console.log("Adjusted image path to:", '/' + imgSrc);
                                } else {
                                  setTimeout(() => {
                                    if ((e.target as HTMLImageElement).naturalWidth === 0) {
                                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyNnB4IiBmaWxsPSIjNkI3MjgwIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
                                    }
                                  }, 1000);
                                }
                              }}
                            />
                          </div>
                        )}
                      </td>
                      <td>{item.author || 'Anonymous'}</td>
                      <td>{item.top ? 'Yes' : 'No'}</td>
                      <td>{item.whatsNew ? 'Yes' : 'No'}</td>
                      <td>{item.showInMiddle ? 'Yes' : 'No'}</td>
                      <td>
                        <div className="post-items-actions">
                          <button
                            onClick={() => handleEdit(item)}
                            className="edit-button"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="delete-button"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
