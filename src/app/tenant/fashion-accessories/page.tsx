'use client';

import React, { useState } from 'react';
import './styles.css';

interface FashionAccessory {
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

const fashionAccessoryTenants: FashionAccessory[] = [
  // 1st Floor
  {
    id: '1',
    name: 'VIOLET',
    floor: '1st FLOOR',
    location: '107',
    image: '/assets/img/violet.jpg',
    telephone: '021-4701479',
    description: 'Violet menawarkan berbagai pilihan fashion wanita trendy, dari pakaian kasual, formal, hingga aksesoris yang melengkapi penampilan Anda dengan harga terjangkau.',
    categories: ['Women Fashion', 'Casual Wear', 'Formal Wear', 'Accessories'],
    operationalHours: '10:00 - 21:30 WIB',
    highlights: ['Koleksi up-to-date', 'Harga terjangkau', 'Beragam pilihan']
  },
  {
    id: '2',
    name: 'TIRAMISU',
    floor: '1st FLOOR',
    location: '112',
    image: '/assets/img/tiramisu.jpg',
    telephone: '021-4711538',
    description: 'Tiramisu menyediakan beragam pilihan fashion wanita dengan desain modern dan feminin, cocok untuk berbagai kesempatan dengan bahan berkualitas dan harga kompetitif.',
    categories: ['Women Fashion', 'Dress', 'Blouse', 'Accessories'],
    operationalHours: '10:00 - 21:00 WIB',
    highlights: ['Koleksi feminine', 'Bahan nyaman', 'Update berkala']
  },
  {
    id: '3',
    name: 'BUTIK CITRA/RANTI',
    floor: '1st FLOOR',
    location: '123',
    image: '/assets/img/butik-citra.jpg',
    telephone: '021-4711949',
    description: 'Butik Citra/Ranti adalah butik yang menyediakan busana wanita dengan sentuhan etnik dan kontemporer, menawarkan koleksi yang elegan untuk berbagai acara formal maupun kasual.',
    categories: ['Women Fashion', 'Boutique', 'Ethnic Wear', 'Contemporary'],
    operationalHours: '10:00 - 21:00 WIB'
  },
  {
    id: '4',
    name: 'TOKO MODIZ',
    floor: '1st FLOOR',
    location: '124',
    image: '/assets/img/modiz.jpg',
    telephone: '021-4703535',
    description: 'Toko Modiz menawarkan koleksi pakaian dan aksesoris fashion dengan gaya trendy dan modis untuk wanita muda dan dewasa, selalu mengikuti perkembangan trend fashion terkini.',
    categories: ['Women Fashion', 'Youth Style', 'Trendy', 'Accessories'],
    operationalHours: '10:00 - 21:00 WIB',
    highlights: ['Trend terkini', 'Harga bersaing', 'Beragam pilihan aksesoris']
  },

  // 2nd Floor
  {
    id: '5',
    name: 'THE BRA HOUSE I',
    floor: '2nd FLOOR',
    location: '206',
    image: '/assets/img/the-bra-house.jpg',
    telephone: '021-47863012',
    description: 'The Bra House I adalah toko pakaian dalam wanita yang menawarkan berbagai pilihan bra, underwear, dan lingerie dengan kualitas terbaik, kenyamanan maksimal, dan desain yang menarik.',
    categories: ['Underwear', 'Lingerie', 'Women Essentials'],
    operationalHours: '10:00 - 21:00 WIB',
    highlights: ['Kualitas premium', 'Beragam ukuran', 'Konsultasi bra fitting']
  },
  {
    id: '6',
    name: 'TAS PARIS',
    floor: '2nd FLOOR',
    location: '207',
    image: '/assets/img/tas-paris.jpg',
    telephone: '-',
    description: 'Tas Paris menyediakan berbagai pilihan tas wanita dengan desain modern dan klasik, dari tas tangan, tas selempang, hingga ransel dengan harga terjangkau dan kualitas baik.',
    categories: ['Bags', 'Handbags', 'Accessories', 'Women Fashion'],
    operationalHours: '10:00 - 21:00 WIB'
  },
  {
    id: '7',
    name: 'INDAH FASHION',
    floor: '2nd FLOOR',
    location: '212',
    image: '/assets/img/indah-fashion.jpg',
    telephone: '-',
    description: 'Indah Fashion menawarkan berbagai pakaian wanita dengan desain yang indah dan anggun, menyediakan pilihan busana kasual hingga formal dengan sentuhan lokal dan internasional.',
    categories: ['Women Fashion', 'Casual Wear', 'Formal Wear'],
    operationalHours: '10:00 - 21:00 WIB',
    highlights: ['Desain unik', 'Kombinasi lokal dan internasional']
  },
  {
    id: '8',
    name: 'STEPHANNY COLLECTION',
    floor: '2nd FLOOR',
    location: '214',
    image: '/assets/img/stephanny.jpg',
    telephone: '021-4701475',
    description: 'Stephanny Collection menyediakan pilihan fashion wanita eksklusif dengan kualitas terbaik, meliputi dress, blouse, rok, dan celana dengan desain yang feminin dan elegan.',
    categories: ['Women Fashion', 'Collection', 'Exclusive', 'Feminine'],
    operationalHours: '10:00 - 21:00 WIB',
    highlights: ['Koleksi eksklusif', 'Desain elegant', 'Pilihan premium']
  },
  {
    id: '9',
    name: 'EXSPORT',
    floor: '2nd FLOOR',
    location: '215',
    image: '/assets/img/exsport.jpg',
    telephone: '021-4701493',
    description: 'Exsport adalah toko tas dan perlengkapan dengan berbagai pilihan ransel, tas selempang, dan aksesoris lainnya yang cocok untuk aktivitas sehari-hari, sekolah, kuliah, hingga petualangan.',
    categories: ['Bags', 'Backpacks', 'Accessories', 'Lifestyle'],
    operationalHours: '10:00 - 21:30 WIB',
    highlights: ['Brand lokal berkualitas', 'Desain kekinian', 'Tahan lama']
  },
  {
    id: '10',
    name: 'SEPATU BATA',
    floor: '2nd FLOOR',
    location: '217',
    image: '/assets/img/bata.jpg',
    telephone: '021-4701491',
    description: 'Sepatu Bata adalah toko sepatu terkemuka yang menawarkan berbagai jenis sepatu untuk pria, wanita, dan anak-anak, dengan fokus pada kualitas, kenyamanan, dan gaya yang timeless.',
    categories: ['Shoes', 'Footwear', 'Men Fashion', 'Women Fashion', 'Kids Fashion'],
    operationalHours: '10:00 - 21:30 WIB',
    highlights: ['Brand terpercaya', 'Koleksi lengkap', 'Kualitas terjamin']
  },
  {
    id: '11',
    name: 'GIRLY FASHION',
    floor: '2nd FLOOR',
    location: '218',
    image: '/assets/img/girly-fashion.jpg',
    telephone: '-',
    description: 'Girly Fashion menawarkan pakaian dan aksesoris dengan sentuhan feminin dan girly, cocok untuk wanita muda yang menyukai gaya yang manis, playful, dan trendy.',
    categories: ['Women Fashion', 'Girly Style', 'Casual Wear', 'Accessories'],
    operationalHours: '10:00 - 21:00 WIB'
  },
  {
    id: '12',
    name: 'THE BRA HOUSE II',
    floor: '2nd FLOOR',
    location: '220',
    image: '/assets/img/the-bra-house-2.jpg',
    telephone: '-',
    description: 'The Bra House II menyediakan pilihan pakaian dalam wanita berkualitas dengan variasi gaya dan ukuran, memberikan kenyamanan dan kepercayaan diri untuk setiap wanita.',
    categories: ['Underwear', 'Lingerie', 'Women Essentials'],
    operationalHours: '10:00 - 21:00 WIB',
    highlights: ['Pilihan beragam', 'Kualitas terjamin', 'Harga terjangkau']
  }
];

export default function FashionAccessoriesPage() {
  const [activeFloor, setActiveFloor] = useState('all');

  const filteredTenants = activeFloor === 'all'
    ? fashionAccessoryTenants
    : fashionAccessoryTenants.filter(tenant => tenant.floor.toLowerCase().includes(activeFloor));

  // Function to get pattern class based on tenant ID
  const getPatternClass = (id: string) => {
    const patternNumber = (parseInt(id) % 4) + 1;
    return `pattern-${patternNumber}`;
  };

  return (
    <div className="fashion-container">
      <div className="fashion-header">
        <div className="style-header-container">
          <div className="style-header-content">
            <span className="style-overline">Elevate Your Look</span>
            <h1 className="style-title">Fashion & Accessories</h1>
            <div className="style-separator"></div>
            <p className="style-subtitle">Discover the latest trends and timeless pieces to express your unique style</p>
            <div className="style-tags">
              <span>Women's Fashion</span>
              <span>Men's Fashion</span>
              <span>Accessories</span>
              <span>Footwear</span>
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

      <div className="fashion-grid">
        {filteredTenants.map((tenant) => (
          <div key={tenant.id} className="fashion-card">
            <div className="fashion-image">
              <div className="store-placeholder">
                <div className="store-placeholder-content">
                  <div className="store-placeholder-icon">
                    <i className="bi bi-shop"></i>
                  </div>
                  <div className="store-placeholder-name">{tenant.name}</div>
                  <div className="store-placeholder-floor">{tenant.floor}</div>
                </div>
                <div className={`store-placeholder-pattern ${getPatternClass(tenant.id)}`}></div>
              </div>

              <div className="location-badge">
                <span className="floor">{tenant.floor}</span>
                <span className="location">Location: {tenant.location}</span>
              </div>
            </div>
            
            <div className="fashion-content">
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
                  <h3>Highlights:</h3>
                  <ul>
                    {tenant.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
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