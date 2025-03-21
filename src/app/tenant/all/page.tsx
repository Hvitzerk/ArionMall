'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { tenantData, type TenantCategory } from '@/app/types/tenant';
import './styles.css';

export default function TenantDirectory() {
  // State untuk filter lantai
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  // State untuk filter kategori
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  // State untuk menyimpan query pencarian
  const [searchQuery, setSearchQuery] = useState('');
  // State untuk status loading pencarian
  const [isSearching, setIsSearching] = useState(false);
  // State untuk pesan error
  const [searchError, setSearchError] = useState('');
  // Ref untuk menyimpan AbortController yang digunakan untuk membatalkan request
  const activeSearchRef = useRef<AbortController | null>(null);

  useEffect(() => {
    console.log('Tenant Data:', tenantData);
    console.log('Current Filters:', { selectedFloor, selectedCategory, searchQuery });
  }, [selectedFloor, selectedCategory, searchQuery]);

  const floors = ['all', '1st FLOOR', '2nd FLOOR', '3rd-4th FLOOR', '5th FLOOR'];
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(tenantData.map(tenant => tenant.category))];
    return ['all', ...uniqueCategories];
  }, []);

  // FITUR 1: REAL-TIME SEARCH - Pencarian langsung saat mengetik
  // Search function dengan pembatalan request sebelumnya
  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    
    // FITUR 2: REQUEST CANCELLATION - Batalkan pencarian sebelumnya jika masih berlangsung
    if (activeSearchRef.current) {
      activeSearchRef.current.abort();
    }

    // Buat controller baru untuk request saat ini
    const controller = new AbortController();
    activeSearchRef.current = controller;
    
    setIsSearching(true);
    setSearchError(''); // Reset error sebelum memulai pencarian baru
    
    try {
      // Kirim request dengan signal dari AbortController
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
        signal: controller.signal
      });
      const data = await response.json();
      
      if (!response.ok) {
        // Hanya log error tanpa menampilkan ke pengguna
        console.error('Search error:', data.message || 'Terjadi kesalahan saat mencari');
        // Tidak perlu set searchError
      }
      
      // Update filtered results
      const searchResults = data.data || [];
      // ... handle search results as needed
      
    } catch (error) {
      // Hanya log error tanpa menampilkan ke pengguna
      if ((error as Error).name !== 'AbortError') {
        console.error('Search error:', error);
        // Tidak perlu set searchError
      }
    } finally {
      // Hanya update state jika ini adalah request terbaru
      if (activeSearchRef.current === controller) {
        setIsSearching(false);
        activeSearchRef.current = null;
      }
    }
  };

  // FITUR 1: REAL-TIME SEARCH - Handler yang dipanggil setiap kali input berubah
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Langsung cari saat input berubah, tanpa debounce
    performSearch(query);
  };

  const filteredTenants = useMemo(() => {
    return tenantData.filter(tenant => {
      const matchesFloor = selectedFloor === 'all' || tenant.floor === selectedFloor;
      const matchesCategory = selectedCategory === 'all' || tenant.category === selectedCategory;
      const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFloor && matchesCategory && matchesSearch;
    });
  }, [selectedFloor, selectedCategory, searchQuery]);

  return (
    <div className="tenant-directory-container">
      <div className="tenant-hero">
        <div className="hero-logo">
          <Image
            src="/assets/img/Logo0.png"
            alt="Arion Mall Logo"
            width={180}
            height={180}
            priority
          />
        </div>
        <h1>Tenant Directory</h1>
        <p>Temukan tenant favorit Anda di Arion Mall</p>
      </div>

      <div className="filter-wrapper">
        <div className="filter-section">
          <div className="filter-label">Lantai:</div>
          <div className="button-group">
            {floors.map((floor) => (
              <button
                key={floor}
                className={`filter-button ${selectedFloor === floor ? 'active' : ''}`}
                onClick={() => setSelectedFloor(floor)}
              >
                {floor === 'all' ? 'Semua Lantai' : floor}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section category-filters">
          <div className="filter-label">Kategori:</div>
          <div className="category-search-wrapper">
            <div className="category-group">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`filter-button ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'Semua Kategori' : category}
                </button>
              ))}
            </div>
            
            {/* FITUR 3: NON-BLOCKING UI - Input tetap responsif saat pencarian berjalan */}
            <div className="search-container">
              <div className="search-input-wrapper">
                <i className="bi bi-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Ketik untuk mencari..."
                  value={searchQuery}
                  onChange={handleSearchInput}
                  className="search-input"
                />
                {/* Spinner dipindahkan dari sini */}
                {searchQuery && !isSearching && (
                  <button 
                    className="search-clear" 
                    onClick={() => {
                      setSearchQuery('');
                    }}
                    aria-label="Clear search"
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
              {/* Element error dibuat tapi tidak ditampilkan dengan CSS display:none */}
              {searchError && <div className="search-error">{searchError}</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="tenant-grid">
        {/* Menampilkan spinner saat pencarian berlangsung */}
        {isSearching && searchQuery && (
          <div className="tenant-search-loader">
            <div className="search-loader-spinner"></div>
            <p>Mencari tenant...</p>
          </div>
        )}
        
        {filteredTenants.length > 0 ? (
          filteredTenants.map((tenant, index) => (
            <div key={index} className="tenant-card">
              <h3 className="tenant-name">{tenant.name}</h3>
              <div className="tenant-tag">
                <span className="tenant-category-tag">{tenant.category}</span>
              </div>
              <div className="tenant-details">
                <div className="tenant-location">
                  <i className="bi bi-geo-alt"></i>
                  <span>{tenant.floor}</span>
                </div>
                {tenant.telephone && tenant.telephone !== '–' && (
                  <div className="tenant-phone">
                    <i className="bi bi-telephone"></i>
                    <span>{tenant.telephone}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>Tidak ada tenant yang ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
} 