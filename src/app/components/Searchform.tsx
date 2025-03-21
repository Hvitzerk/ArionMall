'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './searchForm.css';

interface SearchResult {
  _id: string;
  title: string;
  category: string;
  slug?: string;
}

interface SearchFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchForm({ isOpen, onClose }: SearchFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const activeSearchRef = useRef<AbortController | null>(null);

  // Fokus input saat panel dibuka
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset search saat panel ditutup
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setResults([]);
      setError(null);
    }
  }, [isOpen]);

  // Fungsi pencarian
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    // Batalkan pencarian sebelumnya jika masih berlangsung
    if (activeSearchRef.current) {
      activeSearchRef.current.abort();
    }

    // Buat controller baru untuk request saat ini
    const controller = new AbortController();
    activeSearchRef.current = controller;

    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`, {
        signal: controller.signal
      });
      const data = await response.json();
      
      if (response.ok && data.data && Array.isArray(data.data)) {
        setResults(data.data);
      } else {
        setResults([]);
        setError('Terjadi kesalahan saat mencari');
      }
    } catch (error) {
      // Jangan tampilkan error jika request dibatalkan
      if ((error as Error).name !== 'AbortError') {
        setResults([]);
        setError('Gagal terhubung ke server');
      }
    } finally {
      if (activeSearchRef.current === controller) {
        setIsLoading(false);
        activeSearchRef.current = null;
      }
    }
  };

  // Handle search input
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    
    // Langsung cari saat input berubah, tanpa debounce
    performSearch(newQuery);
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    const path = result.slug ? `/postitems/${result.slug}` : `/postitems/${result._id}`;
    router.push(path);
    onClose();
  };

  // Panel tidak akan ditampilkan jika isOpen = false
  if (!isOpen) return null;

  return (
    <>
      <div className="search-backdrop" onClick={onClose} />
      <div className="search-overlay active">
        <div className="search-container">
          <div className="search-header">
            <h3>Pencarian</h3>
            <button className="close-button" onClick={onClose}>X</button>
          </div>

          <div className="search-form">
            <input 
              ref={inputRef}
              type="text" 
              className="search-input"
              placeholder="Ketik untuk mencari..." 
              value={searchQuery}
              onChange={handleSearchInput}
            />
          </div>

          {error && <p className="search-error">{error}</p>}

          {isLoading && searchQuery && (
            <div className="search-loading">
              <div className="search-loader-spinner"></div>
              <p>Mencari...</p>
            </div>
          )}

          {results.length > 0 ? (
            <ul className="search-results-list">
              {results.map((result) => (
                <li
                  key={result._id}
                  className="search-result-item"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="result-title">{result.title}</div>
                  <div className="result-category">{result.category}</div>
                </li>
              ))}
            </ul>
          ) : searchQuery && !isLoading && !error ? (
            <p className="no-results">Tidak ada hasil untuk "{searchQuery}"</p>
          ) : null}
        </div>
      </div>
    </>
  );
}
