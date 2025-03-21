'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import './styles.css';

interface BeautyHealth {
  id: string;
  name: string;
  floor: string;
  location: string;
  image: string;
  telephone: string;
  description: string;
  services: string[];
  operationalHours: string;
  highlights?: string[];
}

const beautyHealthTenants: BeautyHealth[] = [
  {
    id: '1',
    name: 'APOTIK CENTURY',
    floor: '1st FLOOR',
    location: '113 - 114',
    image: '/assets/img/century-apotik.jpg',
    telephone: '021-47865530',
    description: 'Apotik Century adalah apotek modern yang menyediakan berbagai produk kesehatan, obat-obatan, suplemen, perawatan pribadi, dan konsultasi kesehatan dengan farmasis berpengalaman.',
    services: ['Farmasi', 'Suplemen', 'Produk Kesehatan', 'Konsultasi', 'Alat Kesehatan'],
    operationalHours: '10:00 - 22:00 WIB',
    highlights: ['Konsultasi gratis', 'Produk berkualitas', 'Pelayanan cepat']
  },
  {
    id: '2',
    name: 'JOHNNY ANDREAN SALON',
    floor: '2nd FLOOR',
    location: '213',
    image: '/assets/img/johnny-andrean.jpg',
    telephone: '021-4711626',
    description: 'Johnny Andrean Salon adalah salon dan pusat kecantikan terkemuka yang menawarkan berbagai layanan perawatan rambut, perawatan wajah, dan kecantikan dengan standar kualitas tinggi.',
    services: ['Hair Cut', 'Hair Coloring', 'Hair Treatment', 'Hair Styling', 'Manicure & Pedicure'],
    operationalHours: '10:00 - 21:00 WIB',
    highlights: ['Stylish terpercaya', 'Produk berkualitas', 'Layanan profesional']
  }
];

export default function BeautyHealth() {
  const [activeFloor, setActiveFloor] = useState('all');
  
  const filteredTenants = activeFloor === 'all' 
    ? beautyHealthTenants 
    : beautyHealthTenants.filter(tenant => tenant.floor.toLowerCase().includes(activeFloor));

  return (
    <div className="beauty-health-container">
      <div className="beauty-health-header">
        <div className="wellness-header-container">
          <div className="wellness-header-content">
            <span className="wellness-overline">Self-Care</span>
            <h1 className="wellness-title">Beauty & Health</h1>
            <div className="wellness-separator"></div>
            <p className="wellness-subtitle">Discover premium services and products for your wellness journey</p>
            <div className="wellness-tags">
              <span>Salons</span>
              <span>Skincare</span>
              <span>Pharmacy</span>
              <span>Clinics</span>
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

      <div className="beauty-health-grid">
        {filteredTenants.map((tenant) => (
          <div key={tenant.id} className="beauty-health-card">
            <div className="beauty-health-image">
              <Image
                src={tenant.image}
                alt={tenant.name}
                width={400}
                height={250}
                objectFit="cover"
              />
              <div className="location-badge">
                <span className="floor">{tenant.floor}</span>
                <span className="location">Location: {tenant.location}</span>
              </div>
            </div>
            
            <div className="beauty-health-content">
              <h2>{tenant.name}</h2>
              
              <div className="contact-hours">
                <div className="contact">
                  <i className="bi bi-telephone"></i>
                  <span>{tenant.telephone}</span>
                </div>
                <div className="hours">
                  <i className="bi bi-clock"></i>
                  <span>{tenant.operationalHours}</span>
                </div>
              </div>
              
              <p className="description">{tenant.description}</p>
              
              <div className="services">
                <h3>Layanan:</h3>
                <div className="service-tags">
                  {tenant.services.map((service, index) => (
                    <span key={index} className="service-tag">
                      {service}
                    </span>
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