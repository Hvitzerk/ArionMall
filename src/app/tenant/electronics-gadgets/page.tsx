'use client';

import React, { useState } from 'react';
import './styles.css';

interface ElectronicsGadget {
  id: string;
  name: string;
  floor: string;
  location: string;
  image: string;
  telephone: string;
  description: string;
  categories: string[];
  operationalHours: string;
  highlights?: string[];
}

const electronicsGadgetsTenants: ElectronicsGadget[] = [
  // 1st Floor
  {
    id: '1',
    name: 'ERAFONE',
    floor: '1st FLOOR',
    location: '108',
    image: '/assets/img/erafone.jpg',
    telephone: '021-4891304',
    description: 'Erafone adalah toko ritel resmi yang menyediakan berbagai merek smartphone, tablet, dan aksesori gadget terkini dengan kualitas terjamin dan layanan purna jual yang terpercaya.',
    categories: ['Smartphone', 'Tablet', 'Accessories', 'Gadget'],
    operationalHours: '10:00 - 21:30 WIB',
    highlights: ['Produk resmi & bergaransi', 'Layanan purna jual', 'Pembayaran fleksibel']
  },
  {
    id: '2',
    name: 'SENTRA PONSEL',
    floor: '1st FLOOR',
    location: '119',
    image: '/assets/img/sentra-ponsel.jpg',
    telephone: '021-4711944',
    description: 'Sentra Ponsel menawarkan berbagai pilihan smartphone, ponsel, dan aksesoris dari berbagai merek dengan harga kompetitif dan layanan service yang profesional.',
    categories: ['Smartphone', 'Mobile Phones', 'Accessories', 'Service'],
    operationalHours: '10:00 - 21:00 WIB',
    highlights: ['Harga bersaing', 'Layanan perbaikan', 'Aksesoris lengkap']
  },
  {
    id: '3',
    name: 'GRAND CELULAR',
    floor: '1st FLOOR',
    location: '131',
    image: '/assets/img/grand-celular.jpg',
    telephone: '-',
    description: 'Grand Celular menyediakan beragam pilihan produk telepon seluler dan aksesoris dengan harga terjangkau, serta menawarkan layanan service dan penggantian sparepart asli.',
    categories: ['Mobile Phones', 'Accessories', 'Parts & Service'],
    operationalHours: '10:00 - 21:00 WIB',
    highlights: ['Pilihan produk lengkap', 'Sparepart original', 'Teknisi berpengalaman']
  },
  {
    id: '4',
    name: 'SAMSUNG',
    floor: '1st FLOOR',
    location: '-',
    image: '/assets/img/samsung.jpg',
    telephone: '-',
    description: 'Samsung adalah toko resmi yang menawarkan berbagai produk elektronik dan gadget Samsung, dari smartphone, tablet, hingga aksesori orisinal dengan layanan konsultasi produk.',
    categories: ['Smartphone', 'Tablet', 'Accessories', 'Samsung Products'],
    operationalHours: '10:00 - 21:30 WIB',
    highlights: ['Produk orisinal', 'Garansi resmi', 'Konsultasi produk']
  },

  // 2nd Floor
  {
    id: '5',
    name: 'JAC SELULER',
    floor: '2nd FLOOR',
    location: '219',
    image: '/assets/img/jac-seluler.jpg',
    telephone: '021-4701478',
    description: 'JAC Seluler menyediakan beragam smartphone dan gadget terbaru dengan harga yang kompetitif. Kami juga menawarkan berbagai aksesoris ponsel dan layanan perbaikan.',
    categories: ['Smartphone', 'Accessories', 'Repair Service'],
    operationalHours: '10:00 - 21:00 WIB',
    highlights: ['Produk terbaru', 'Aksesoris lengkap', 'Service berkualitas']
  }
];

export default function ElectronicsGadgetsPage() {
  const [activeFloor, setActiveFloor] = useState('all');

  const filteredTenants = activeFloor === 'all'
    ? electronicsGadgetsTenants
    : electronicsGadgetsTenants.filter(tenant => tenant.floor.includes(activeFloor));

  // Function to determine glow and pattern class based on tenant ID
  const getGlowPatternClass = (id: string, type: 'glow' | 'pattern') => {
    const num = parseInt(id) % 2 + 1;
    return `${type}-${num}`;
  };

  return (
    <div className="electronics-container">
      <div className="electronics-header">
        <div className="luxury-header-container">
          <div className="luxury-header-content">
            <span className="luxury-overline">Tech & Innovation</span>
            <h1 className="luxury-title">Electronics & Gadgets</h1>
            <div className="luxury-separator"></div>
            <p className="luxury-subtitle">Discover cutting-edge technology and innovative gadgets for modern living</p>
            <div className="luxury-tags">
              <span>Smartphones</span>
              <span>Computers</span>
              <span>Audio</span>
              <span>Gaming</span>
            </div>
          </div>
        </div>
      </div>

      <div className="floor-filter">
        <button 
          className={activeFloor === 'all' ? 'active' : ''} 
          onClick={() => setActiveFloor('all')}
        >
          Semua Lantai
        </button>
        <button 
          className={activeFloor === '1st' ? 'active' : ''} 
          onClick={() => setActiveFloor('1st')}
        >
          Lantai 1
        </button>
        <button 
          className={activeFloor === '2nd' ? 'active' : ''} 
          onClick={() => setActiveFloor('2nd')}
        >
          Lantai 2
        </button>
      </div>

      <div className="electronics-grid">
        {filteredTenants.map((tenant) => (
          <div key={tenant.id} className="electronics-card">
            <div className="electronics-image">
              <div className="tech-placeholder">
                <div className="tech-placeholder-content">
                  <div className="tech-placeholder-icon">
                    <i className="bi bi-phone"></i>
                  </div>
                  <div className="tech-placeholder-name">{tenant.name}</div>
                  <div className="tech-placeholder-floor">{tenant.floor}</div>
                </div>
                <div className="tech-placeholder-circuit"></div>
                <div className={`tech-placeholder-dot-pattern ${getGlowPatternClass(tenant.id, 'pattern')}`}></div>
                <div className={`tech-placeholder-glow ${getGlowPatternClass(tenant.id, 'glow')}`}></div>
              </div>
              
              <div className="location-badge">
                <span className="floor">{tenant.floor}</span>
                {tenant.location !== '-' && (
                  <span className="location">Location: {tenant.location}</span>
                )}
              </div>
            </div>
            
            <div className="electronics-content">
              <h2>{tenant.name}</h2>
              
              <div className="contact-hours">
                {tenant.telephone !== '-' && (
                  <div className="contact">
                    <i className="bi bi-telephone"></i>
                    <span>{tenant.telephone}</span>
                  </div>
                )}
                <div className="hours">
                  <i className="bi bi-clock"></i>
                  <span>{tenant.operationalHours}</span>
                </div>
              </div>
              
              <p className="description">{tenant.description}</p>
              
              <div className="categories">
                <h3>Kategori:</h3>
                <div className="category-tags">
                  {tenant.categories.map((category, index) => (
                    <span key={index}>{category}</span>
                  ))}
                </div>
              </div>
              
              {tenant.highlights && (
                <div className="highlights">
                  <h3>Highlight:</h3>
                  <ul className="highlight-list">
                    {tenant.highlights.map((highlight, index) => (
                      <li key={index} className="highlight-item">
                        <i className="bi bi-check-circle"></i>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}