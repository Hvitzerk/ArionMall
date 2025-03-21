'use client';

import React from 'react';
import Image from 'next/image';
import './styles.css';

interface Entertainment {
  id: string;
  name: string;
  floor: string;
  image: string;
  logo?: string;
  telephone: string;
  description: string;
  features: string[];
  operationalHours: string;
  pricing?: string;
}

const entertainments: Entertainment[] = [
  {
    id: '1',
    name: 'ARION XXI',
    floor: '5th FLOOR',
    image: '/assets/img/arionxxi.jpg',
    logo: '/assets/img/cinema-xxi.jpg',
    telephone: '021-4757658',
    description: 'Nikmati pengalaman menonton film terbaru di Cinema XXI Arion Mall dengan teknologi audio visual terkini dan kenyamanan tempat duduk premium.',
    features: ['4 Studio', 'Dolby Digital Surround', 'Kursi Premium', 'Cafetaria', 'Pembelian Tiket Online'],
    operationalHours: '10:00 - 22:00 WIB',
    pricing: 'Rp 40.000 - Rp 75.000'
  },
  {
    id: '2',
    name: 'FUN WORLD & KIDZILLA',
    floor: '2nd FLOOR',
    image: '/assets/img/funworld.jpg',
    telephone: '-',
    description: 'Zona permainan yang menyenangkan untuk segala usia dengan berbagai permainan arcade, simulasi, dan area khusus untuk anak-anak.',
    features: ['Arcade Games', 'Kids Area', 'Simulasi Racing', 'Photo Booth', 'Redemption Games'],
    operationalHours: '10:00 - 21:00 WIB',
    pricing: 'Mulai dari Rp 20.000'
  }
];

export default function Entertainment() {
  return (
    <div className="entertainment-container">
      <div className="entertainment-header">
        <div className="fun-header-container">
          <div className="fun-header-content">
            <span className="fun-overline">Fun & Recreation</span>
            <h1 className="fun-title">Entertainment</h1>
            <div className="fun-separator"></div>
            <p className="fun-subtitle">Exciting entertainment experiences for all ages</p>
            <div className="fun-tags">
              <span>Cinema</span>
              <span>Game Center</span>
              <span>Arcade</span>
              <span>Kids Zone</span>
            </div>
          </div>
        </div>
      </div>

      {entertainments.map((entertainment) => (
        <div key={entertainment.id} className="entertainment-section">
          <div className="section-header">
            <div className="title-logo">
              {entertainment.logo && (
                <Image
                  src={entertainment.logo}
                  alt={`${entertainment.name} logo`}
                  width={60}
                  height={60}
                  className="logo"
                />
              )}
              <h2>{entertainment.name}</h2>
            </div>
            <span className="floor-badge">{entertainment.floor}</span>
          </div>

          <div className="entertainment-details">
            <div className="entertainment-image">
              <Image
                src={entertainment.image}
                alt={entertainment.name}
                width={500}
                height={300}
                objectFit="cover"
              />
            </div>
            
            <div className="entertainment-info">
              <p className="description">{entertainment.description}</p>
              
              <div className="contact-hours">
                <div className="contact">
                  <h3>Kontak:</h3>
                  <p><i className="bi bi-telephone"></i> {entertainment.telephone !== '-' ? entertainment.telephone : 'Tidak tersedia'}</p>
                </div>
                <div className="hours">
                  <h3>Jam Operasional:</h3>
                  <p><i className="bi bi-clock"></i> {entertainment.operationalHours}</p>
                </div>
                {entertainment.pricing && (
                  <div className="pricing">
                    <h3>Harga:</h3>
                    <p><i className="bi bi-cash"></i> {entertainment.pricing}</p>
                  </div>
                )}
              </div>
              
              <div className="features">
                <h3>Fasilitas:</h3>
                <div className="feature-tags">
                  {entertainment.features.map((feature, index) => (
                    <span key={index} className="feature-tag">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 