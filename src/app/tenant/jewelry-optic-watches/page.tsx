'use client';

import React, { useState } from 'react';
import './styles.css';

interface JewelryOpticWatch {
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

const jewelryOpticWatchesTenants: JewelryOpticWatch[] = [
  // 1st Floor
  {
    id: '1',
    name: 'TOKO MAS METRO',
    floor: '1st FLOOR',
    location: '106B',
    image: '/assets/img/toko-mas-metro.jpg',
    telephone: '021-4751567',
    description: 'Toko Mas Metro menawarkan berbagai koleksi perhiasan emas berkualitas tinggi dengan desain klasik hingga kontemporer, dengan jaminan keaslian dan kemurnian emas.',
    categories: ['Gold Jewelry', 'Necklaces', 'Rings', 'Bracelets'],
    operationalHours: '10:00 - 21:00 WIB',
    highlights: ['Kualitas terjamin', 'Desain beragam', 'Layanan after-sales']
  },
  {
    id: '2',
    name: 'OPTIK MELAWAI',
    floor: '1st FLOOR',
    location: '116',
    image: '/assets/img/optik-melawai.jpg',
    telephone: '021-4711529',
    description: 'Optik Melawai adalah pusat kacamata terkemuka yang menyediakan layanan pemeriksaan mata dan berbagai pilihan frame kacamata serta lensa berkualitas dari merek lokal dan internasional.',
    categories: ['Eyeglasses', 'Sunglasses', 'Contact Lenses', 'Eye Examination'],
    operationalHours: '10:00 - 21:30 WIB',
    highlights: ['Pemeriksaan mata gratis', 'Koleksi frame lengkap', 'Lensa berkualitas']
  },
  {
    id: '3',
    name: 'REGENCY WATCH',
    floor: '1st FLOOR',
    location: '117',
    image: '/assets/img/regency-watch.jpg',
    telephone: '021-4702484',
    description: 'Regency Watch menawarkan koleksi jam tangan original dari berbagai merek ternama dengan desain klasik hingga modern untuk pria dan wanita, dilengkapi garansi resmi.',
    categories: ['Watches', 'Men Watches', 'Women Watches', 'Accessories'],
    operationalHours: '10:00 - 21:00 WIB',
    highlights: ['Produk original', 'Garansi resmi', 'Layanan service']
  },
  {
    id: '4',
    name: 'TOKO MAS MENTENG',
    floor: '1st FLOOR',
    location: '121 - 122',
    image: '/assets/img/toko-mas-menteng.jpg',
    telephone: '021-4711990',
    description: 'Toko Mas Menteng adalah toko perhiasan emas terpercaya yang menawarkan berbagai jenis perhiasan emas dengan kualitas terbaik, mulai dari cincin, kalung, gelang, hingga anting dengan harga yang kompetitif.',
    categories: ['Gold Jewelry', 'Wedding Rings', 'Necklaces', 'Bracelets', 'Earrings'],
    operationalHours: '10:00 - 21:00 WIB',
    highlights: ['Perhiasan berkualitas', 'Harga kompetitif', 'Desain eksklusif']
  },
  {
    id: '5',
    name: 'MASTER ARLOJI',
    floor: '1st FLOOR',
    location: '127',
    image: '/assets/img/master-arloji.jpg',
    telephone: '021-4701489',
    description: 'Master Arloji adalah toko jam tangan yang menawarkan berbagai koleksi jam tangan original dari berbagai merek dengan pilihan model dan harga yang beragam, serta layanan service professional.',
    categories: ['Watches', 'Men Watches', 'Women Watches', 'Service'],
    operationalHours: '10:00 - 21:00 WIB',
    highlights: ['Beragam pilihan merek', 'Service berkualitas', 'Penggantian baterai']
  },

  // 2nd Floor
  {
    id: '6',
    name: 'EXELLENT WATCH',
    floor: '2nd FLOOR',
    location: '222',
    image: '/assets/img/exellent-watch.jpg',
    telephone: '021-4701490',
    description: 'Exellent Watch menyediakan koleksi jam tangan original dengan beragam pilihan model dan merek, dari kasual hingga formal, dengan jaminan kualitas terbaik dan layanan purna jual.',
    categories: ['Watches', 'Branded Watches', 'Accessories', 'Gift Items'],
    operationalHours: '10:00 - 21:00 WIB',
    highlights: ['Merek terpercaya', 'Pilihan beragam', 'Garansi resmi']
  }
];

export default function JewelryOpticWatchesPage() {
  const [activeFloor, setActiveFloor] = useState('all');

  const filteredTenants = activeFloor === 'all'
    ? jewelryOpticWatchesTenants
    : jewelryOpticWatchesTenants.filter(tenant => tenant.floor.includes(activeFloor));

  // Function to get appropriate icon for tenant based on category
  const getIconClass = (categories: string[]) => {
    if (categories.some(c => c.toLowerCase().includes('jewelry') || c.toLowerCase().includes('gold'))) {
      return 'bi-gem';
    } else if (categories.some(c => c.toLowerCase().includes('watch'))) {
      return 'bi-watch';
    } else if (categories.some(c => c.toLowerCase().includes('optic') || c.toLowerCase().includes('glass'))) {
      return 'bi-eyeglasses';
    }
    return 'bi-gem';
  };
  
  // Function to get accent pattern number based on tenant ID
  const getAccentNumber = (id: string) => {
    const num = parseInt(id) % 3 + 1;
    return num;
  };

  return (
    <div className="jewelry-container">
      <div className="jewelry-header">
        <div className="luxury-header-container">
          <div className="luxury-header-content">
            <span className="luxury-overline">LUXURY & ELEGANCE</span>
            <h1 className="luxury-title">Jewelry, Optic & Watches</h1>
            <div className="luxury-separator"></div>
            <p className="luxury-subtitle">Discover timeless elegance and exquisite craftsmanship in our premier collection</p>
            <div className="luxury-tags">
              <span>Jewelry</span>
              <span>Watches</span>
              <span>Eyewear</span>
              <span>Accessories</span>
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

      <div className="jewelry-grid">
        {filteredTenants.map((tenant) => (
          <div key={tenant.id} className="jewelry-card">
            <div className="jewelry-image">
              <div className="jewelry-luxury-placeholder">
                <div className="jewelry-luxury-content">
                  <div className="jewelry-luxury-icon">
                    <i className={`bi ${getIconClass(tenant.categories)}`}></i>
                  </div>
                  <div className="jewelry-luxury-name">{tenant.name}</div>
                  <div className="jewelry-luxury-floor">{tenant.floor}</div>
                </div>
                <div className="jewelry-luxury-border top-left"></div>
                <div className="jewelry-luxury-border top-right"></div>
                <div className="jewelry-luxury-border bottom-left"></div>
                <div className="jewelry-luxury-border bottom-right"></div>
                <div className={`jewelry-luxury-accent accent-${getAccentNumber(tenant.id)}`}></div>
                {getAccentNumber(tenant.id) > 1 && (
                  <div className={`jewelry-luxury-accent accent-${getAccentNumber(tenant.id) + 1 > 3 ? 1 : getAccentNumber(tenant.id) + 1}`}></div>
                )}
              </div>
              
              <div className="location-badge">
                <span className="floor">{tenant.floor}</span>
                <span className="location">Location: {tenant.location}</span>
              </div>
            </div>
            
            <div className="jewelry-content">
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