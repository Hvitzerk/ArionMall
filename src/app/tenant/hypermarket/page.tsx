'use client';

import React from 'react';
import Image from 'next/image';
import './styles.css';

interface Hypermarket {
  id: string;
  name: string;
  floor: string;
  location: string;
  image: string;
  telephone: string;
  description: string;
  categories: string[];
  operationalHours: string;
  highlights: string[];
  products: string[];
}

const hypermarketTenant: Hypermarket = {
  id: '1',
  name: 'DAILY FOOD HALL',
  floor: '2nd FLOOR',
  location: '201',
  image: '/assets/img/daily-foodhall.jpg',
  telephone: '-',
  description: 'Daily Food Hall adalah hypermarket modern yang menawarkan pilihan produk segar, kebutuhan sehari-hari, dan berbagai barang berkualitas dengan harga kompetitif.',
  categories: ['Groceries', 'Fresh Produce', 'Household', 'Home Appliances', 'Fashion'],
  operationalHours: '10:00 - 22:00 WIB',
  highlights: [
    'Produk segar berkualitas',
    'Beragam pilihan kebutuhan rumah tangga',
    'Pengalaman belanja modern',
    'Harga kompetitif'
  ],
  products: [
    'Produk Segar',
    'Bahan Makanan',
    'Minuman',
    'Barang Rumah Tangga',
    'Peralatan Dapur',
    'Perlengkapan Mandi & Kebersihan',
    'Elektronik Rumah Tangga',
    'Pakaian & Aksesoris',
    'Alat Tulis & Kantor'
  ]
};

export default function Hypermarket() {
  return (
    <div className="hypermarket-container">
      <div className="hypermarket-header">
        <div className="luxury-header-container">
          <div className="luxury-header-content">
            <h1 className="luxury-title">Hypermarket</h1>
            <div className="luxury-separator"></div>
            <p className="luxury-subtitle">One-stop shopping for premium groceries and household essentials</p>
            <div className="luxury-tags">
              <span>Groceries</span>
              <span>Fresh Produce</span>
              <span>Home Goods</span>
              <span>Appliances</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hypermarket-content">
        <div className="tenant-image">
          <Image
            src={hypermarketTenant.image}
            alt={hypermarketTenant.name}
            width={600}
            height={400}
            objectFit="cover"
            className="main-image"
          />
          <div className="tenant-badge">
            <span className="floor">{hypermarketTenant.floor}</span>
            <span className="location">Location: {hypermarketTenant.location}</span>
          </div>
        </div>

        <div className="tenant-details">
          <h2>{hypermarketTenant.name}</h2>
          
          <div className="tenant-info">
            <div className="contact-hours">
              {hypermarketTenant.telephone !== '-' && (
                <div className="contact">
                  <i className="bi bi-telephone"></i>
                  <span>{hypermarketTenant.telephone}</span>
                </div>
              )}
              
              <div className="hours">
                <i className="bi bi-clock"></i>
                <span>{hypermarketTenant.operationalHours}</span>
              </div>
            </div>
            
            <p className="description">{hypermarketTenant.description}</p>
            
            <div className="categories">
              <h3>Kategori:</h3>
              <div className="category-tags">
                {hypermarketTenant.categories.map((category, index) => (
                  <span key={index} className="category-tag">
                    {category}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="highlights">
              <h3>Highlights:</h3>
              <ul className="highlights-list">
                {hypermarketTenant.highlights.map((highlight, index) => (
                  <li key={index} className="highlight-item">
                    <i className="bi bi-check-circle"></i>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="products">
              <h3>Produk yang Tersedia:</h3>
              <div className="products-grid">
                {hypermarketTenant.products.map((product, index) => (
                  <div key={index} className="product-item">
                    <i className="bi bi-basket"></i>
                    <span>{product}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 