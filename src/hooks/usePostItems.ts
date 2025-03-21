import { useState } from 'react';
import useSWR from 'swr';

// Define the PostItem interface
export interface PostItem {
  _id: string;
  title: string;
  category: string;
  brief: string;
  author: string;
  avatar: string;
  img: string;
  top: boolean;
  whatsNew: boolean;
  showInMiddle: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Custom fetcher function with error handling
const fetcher = async (url: string) => {
  const res = await fetch(url, {
    headers: {
      'Cache-Control': 'no-cache',
    }
  });
  
  if (!res.ok) {
    const error = new Error('Failed to fetch data');
    error.message = await res.text();
    throw error;
  }
  
  return res.json();
};

// Hook for fetching all post items with caching
export function usePostItems() {
  const { data, error, isLoading, mutate } = useSWR<PostItem[]>('/api/postitems', fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 30000, // revalidate every 30 seconds
  });
  
  return {
    postItems: data,
    isLoading,
    isError: error,
    mutate, // Function to manually revalidate data
  };
}

// Hook for fetching a single post item by ID with caching
export function usePostItem(id: string) {
  const { data, error, isLoading, mutate } = useSWR<PostItem>(
    id ? `/api/postitems/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 0, // No auto refresh for individual items
    }
  );
  
  return {
    postItem: data,
    isLoading,
    isError: error,
    mutate, // Function to manually revalidate data
  };
}

// Hook for filtering and sorting post items
export function useFilteredPostItems(postItems: PostItem[] | undefined) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'createdAt' | 'updatedAt' | 'order'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterMiddle, setFilterMiddle] = useState<boolean | null>(null);
  
  // Filter posts based on search term and middle filter
  const filteredPosts = postItems?.filter(item => {
    // Search term filter
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brief.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Middle section filter  
    const matchesMiddle = filterMiddle === null || item.showInMiddle === filterMiddle;
    
    return matchesSearch && matchesMiddle;
  }) || [];
  
  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'title') {
      return sortOrder === 'asc' 
        ? a.title.localeCompare(b.title) 
        : b.title.localeCompare(a.title);
    } else if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      const dateA = new Date(a[sortBy]).getTime();
      const dateB = new Date(b[sortBy]).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      // Order (handle null/undefined/999 as the highest value for better sorting)
      const orderA = a.order === 999 ? Number.MAX_SAFE_INTEGER : a.order;
      const orderB = b.order === 999 ? Number.MAX_SAFE_INTEGER : b.order;
      return sortOrder === 'asc' ? orderA - orderB : orderB - orderA;
    }
  });
  
  // Toggle sort order
  const toggleSort = (field: 'title' | 'createdAt' | 'updatedAt' | 'order') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  
  // Set the middle filter
  const toggleMiddleFilter = () => {
    if (filterMiddle === null) {
      setFilterMiddle(true);
    } else if (filterMiddle === true) {
      setFilterMiddle(false);
    } else {
      setFilterMiddle(null);
    }
  };
  
  // Get middle filter text
  const getMiddleFilterText = () => {
    if (filterMiddle === null) return 'All Items';
    if (filterMiddle === true) return 'Middle Section Only';
    return 'Non-Middle Section';
  };
  
  // Update post item order (for quick edit)
  const updateItemOrder = async (id: string, newOrder: number) => {
    try {
      const item = postItems?.find(item => item._id === id);
      if (!item) throw new Error('Item not found');
      
      const response = await fetch(`/api/postitems/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...item, order: newOrder }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order');
      }
      
      return true;
    } catch (error) {
      console.error('Error updating order:', error);
      return false;
    }
  };
  
  return {
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
    filteredPostsCount: filteredPosts.length,
  };
}
