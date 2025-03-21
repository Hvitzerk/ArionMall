'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './sci.css';

interface SearchResult {
  _id: string;
  title: string;
  category: string;
  image?: string;
}

export default function Sci({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Debounce search function
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Search function
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query: string) => performSearch(query), 300),
    []
  );

  // Handle input change
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    router.push(`/post/${result._id}`);
    onClose();
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      const input = document.querySelector('.search-input') as HTMLInputElement;
      if (input) {
        input.focus();
      }
    } else {
      setSearchQuery('');
      setResults([]);
    }
  }, [isOpen]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className={`search-form ${isOpen ? 'active' : ''}`}>
      <div className="search-form-inner">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Cari artikel..."
            value={searchQuery}
            onChange={handleSearchInput}
          />
          <button className="close-search" onClick={onClose}>
            <i className="bi bi-x"></i>
          </button>
        </div>

        {results.length > 0 && (
          <div className="search-results">
            {results.map((result) => (
              <div
                key={result._id}
                className="search-result-item"
                onClick={() => handleResultClick(result)}
              >
                {result.image && (
                  <Image
                    src={result.image}
                    alt={result.title}
                    width={40}
                    height={40}
                    className="search-result-image"
                  />
                )}
                <div className="search-result-info">
                  <div className="search-result-title">{result.title}</div>
                  <div className="search-result-category">{result.category}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {searchQuery && !isLoading && results.length === 0 && (
          <div className="search-results">
            <div className="no-results">
              Tidak ada hasil untuk "{searchQuery}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
