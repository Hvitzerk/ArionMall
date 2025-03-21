'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import './styles.css';

interface FoodBeverage {
  id: string;
  name: string;
  floor: string;
  location: string;
  image: string;
  telephone: string;
  description: string;
  category: string[];
  operationalHours: string;
  priceRange?: string;
  highlights?: string[];
}

const foodBeverageTenants: FoodBeverage[] = [
  // 1st Floor
  {
    id: '1',
    name: 'DUNKIN DONUTS',
    floor: '1st FLOOR',
    location: '101',
    image: '/assets/img/dunkin-donuts.jpg',
    telephone: '021-4712724',
    description: 'Dunkin Donuts menawarkan berbagai pilihan donat lezat, minuman kopi premium, dan makanan ringan yang sempurna untuk camilan kapan saja.',
    category: ['Donat', 'Kopi', 'Bakery'],
    operationalHours: '10:00 - 21:30 WIB',
    priceRange: 'Rp 10.000 - Rp 100.000',
    highlights: ['Donat varian lengkap', 'Kopi premium', 'Paket hemat']
  },
  {
    id: '2',
    name: 'DCOST',
    floor: '1st FLOOR',
    location: '111',
    image: '/assets/img/dcost.jpg',
    telephone: '-',
    description: 'D\'Cost adalah restoran seafood dengan konsep all you can eat yang menawarkan berbagai hidangan laut segar dengan harga terjangkau.',
    category: ['Seafood', 'Indonesia', 'All You Can Eat'],
    operationalHours: '10:00 - 22:00 WIB',
    priceRange: 'Rp 50.000 - Rp 200.000',
    highlights: ['Seafood segar', 'Harga terjangkau', 'Menu variatif']
  },
  {
    id: '3',
    name: 'PAPABUNZ',
    floor: '1st FLOOR',
    location: '118',
    image: '/assets/img/papabunz.jpg',
    telephone: '021-47869008',
    description: 'PapaBunz menyajikan roti dan bakpao dengan isian yang beragam, dari yang manis hingga gurih, dengan tekstur lembut dan cita rasa yang nikmat.',
    category: ['Bakery', 'Asian Fusion', 'Snack'],
    operationalHours: '10:00 - 21:00 WIB',
    priceRange: 'Rp 15.000 - Rp 50.000'
  },
  {
    id: '4',
    name: 'MCDONALDS',
    floor: '1st FLOOR',
    location: '125',
    image: '/assets/img/mcdonalds.jpg',
    telephone: '021-4701457',
    description: 'McDonald\'s adalah restoran cepat saji yang menawarkan berbagai menu burger, ayam, dan camilan dengan cita rasa konsisten yang telah dikenal di seluruh dunia.',
    category: ['Fast Food', 'Burger', 'Ayam'],
    operationalHours: '07:00 - 23:00 WIB',
    priceRange: 'Rp 20.000 - Rp 100.000',
    highlights: ['PaNas 1/2', 'McFlurry', 'Happy Meal']
  },
  {
    id: '5',
    name: 'SOLARIA',
    floor: '1st FLOOR',
    location: '-',
    image: '/assets/img/solaria.jpg',
    telephone: '-',
    description: 'Solaria adalah restoran keluarga yang menyajikan berbagai menu Asia dan Indonesia dengan cita rasa yang konsisten dan harga yang terjangkau.',
    category: ['Chinese Food', 'Indonesian', 'Asian'],
    operationalHours: '10:00 - 22:00 WIB',
    priceRange: 'Rp 30.000 - Rp 150.000'
  },
  {
    id: '6',
    name: 'SHIGERU',
    floor: '1st FLOOR',
    location: '130',
    image: '/assets/img/shigeru.jpg',
    telephone: '-',
    description: 'Shigeru menyajikan berbagai hidangan Jepang autentik dengan bahan-bahan berkualitas, mulai dari sushi, sashimi, hingga hidangan panas lainnya.',
    category: ['Japanese', 'Sushi', 'Asian'],
    operationalHours: '10:00 - 22:00 WIB',
    priceRange: 'Rp 50.000 - Rp 200.000',
    highlights: ['Sushi premium', 'Chef berpengalaman', 'Suasana autentik']
  },
  {
    id: '7',
    name: 'MIXUE ICE CREAM',
    floor: '1st FLOOR',
    location: '-',
    image: '/assets/img/mixue.jpg',
    telephone: '-',
    description: 'Mixue Ice Cream & Tea menawarkan berbagai pilihan es krim lembut, minuman teh, dan kopi dengan harga yang sangat terjangkau.',
    category: ['Ice Cream', 'Bubble Tea', 'Dessert'],
    operationalHours: '10:00 - 22:00 WIB',
    priceRange: 'Rp 5.000 - Rp 25.000',
    highlights: ['Harga mulai Rp 5.000', 'Menu variatif', 'Pelayanan cepat']
  },
  {
    id: '8',
    name: 'ROTI O',
    floor: '1st FLOOR',
    location: '-',
    image: '/assets/img/rotio.jpg',
    telephone: '-',
    description: 'Roti O terkenal dengan roti lembut beraroma dan berisi kopi yang memikat, dipanggang segar setiap hari untuk menjaga kualitas dan kelezatannya.',
    category: ['Bakery', 'Coffee Bun', 'Snack'],
    operationalHours: '10:00 - 21:00 WIB',
    priceRange: 'Rp 8.000 - Rp 30.000'
  },
  
  // 2nd Floor
  {
    id: '9',
    name: 'KENTUCKY FRIED CHICKEN',
    floor: '2nd FLOOR',
    location: '202',
    image: '/assets/img/kfc.jpg',
    telephone: '021-47865928',
    description: 'KFC adalah restoran cepat saji yang menawarkan ayam goreng dengan resep rahasia 11 bumbu dan rempah, serta berbagai menu pendamping lainnya.',
    category: ['Fast Food', 'Ayam', 'Western'],
    operationalHours: '10:00 - 22:00 WIB',
    priceRange: 'Rp 20.000 - Rp 150.000',
    highlights: ['Original Recipe', 'Hot & Crispy', 'Value Meals']
  },
  {
    id: '10',
    name: 'RICHEESE FACTORY',
    floor: '2nd FLOOR',
    location: '203',
    image: '/assets/img/richeese.jpg',
    telephone: '021-47882719',
    description: 'Richeese Factory adalah restoran cepat saji yang menawarkan menu ayam goreng dengan saus keju yang khas, tersedia dalam berbagai level kepedasan.',
    category: ['Fast Food', 'Ayam', 'Spicy Food'],
    operationalHours: '10:00 - 22:00 WIB',
    priceRange: 'Rp 25.000 - Rp 120.000',
    highlights: ['Fire Chicken', 'Cheese Sauce', 'Combo Meals']
  },
  {
    id: '11',
    name: 'ES TELER 77',
    floor: '2nd FLOOR',
    location: '208',
    image: '/assets/img/esteler77.jpg',
    telephone: '021-4701461',
    description: 'Es Teler 77 adalah restoran keluarga yang menyajikan berbagai masakan Indonesia populer dan minuman segar, termasuk menu andalan es teler.',
    category: ['Indonesian', 'Dessert', 'Family Restaurant'],
    operationalHours: '10:00 - 21:30 WIB',
    priceRange: 'Rp 20.000 - Rp 100.000',
    highlights: ['Es Teler Original', 'Nasi Goreng', 'Paket Keluarga']
  },
  {
    id: '12',
    name: 'HOPHOP BUBBLE DRINK',
    floor: '2nd FLOOR',
    location: '210',
    image: '/assets/img/hophop.jpg',
    telephone: '-',
    description: 'HopHop Bubble Drink menawarkan berbagai minuman bubble tea dengan topping yang bervariasi, menyegarkan dan cocok untuk menemani aktivitas belanja.',
    category: ['Bubble Tea', 'Beverage', 'Dessert'],
    operationalHours: '10:00 - 21:00 WIB',
    priceRange: 'Rp 15.000 - Rp 35.000'
  },
  {
    id: '13',
    name: 'HOKBEN',
    floor: '2nd FLOOR',
    location: '211',
    image: '/assets/img/hokben.jpg',
    telephone: '021-4701485',
    description: 'HokBen adalah restoran cepat saji Jepang yang menawarkan berbagai set menu seperti ramen, bento, dan donburi dengan cita rasa yang disesuaikan dengan lidah Indonesia.',
    category: ['Japanese', 'Fast Food', 'Asian'],
    operationalHours: '10:00 - 22:00 WIB',
    priceRange: 'Rp 30.000 - Rp 100.000',
    highlights: ['Paket Bento', 'Ramen', 'Value Set']
  },
  {
    id: '14',
    name: 'BAKMI NAGA',
    floor: '2nd FLOOR',
    location: '-',
    image: '/assets/img/bakmi-Naga.jpg',
    telephone: '-',
    description: 'Bakmi Naga menyajikan mie dengan racikan khas dan berbagai pilihan topping, mulai dari ayam, daging sapi, hingga seafood dengan cita rasa yang otentik.',
    category: ['Chinese Noodle', 'Asian', 'Bakmi'],
    operationalHours: '10:00 - 21:30 WIB',
    priceRange: 'Rp 30.000 - Rp 80.000'
  },
  {
    id: '15',
    name: 'KOPI JANJI JIWA',
    floor: '2nd FLOOR',
    location: '-',
    image: '/assets/img/janjijiwa.jpg',
    telephone: '-',
    description: 'Kopi Janji Jiwa adalah kedai kopi lokal yang menawarkan berbagai minuman kopi dan non-kopi dengan kualitas tinggi namun harga terjangkau.',
    category: ['Coffee', 'Beverage', 'Indonesian'],
    operationalHours: '10:00 - 22:00 WIB',
    priceRange: 'Rp 20.000 - Rp 40.000',
    highlights: ['Es Kopi Susu', 'Menu non-kopi', 'Kopi berkualitas']
  },
  {
    id: '16',
    name: 'ROTI BUNDA MORA',
    floor: '2nd FLOOR',
    location: '-',
    image: '/assets/img/bundamora.jpg',
    telephone: '-',
    description: 'Roti Bunda Mora menyajikan berbagai jenis roti dan kue tradisional Indonesia dengan cita rasa autentik dan menggunakan bahan-bahan berkualitas.',
    category: ['Bakery', 'Traditional', 'Snack'],
    operationalHours: '10:00 - 21:00 WIB',
    priceRange: 'Rp 5.000 - Rp 40.000'
  }
];

export default function FoodBeverage() {
  const [activeFloor, setActiveFloor] = useState('all');
  
  const filteredTenants = activeFloor === 'all' 
    ? foodBeverageTenants 
    : foodBeverageTenants.filter(tenant => tenant.floor.toLowerCase().includes(activeFloor));

  return (
    <div className="fnb-container">
      {/* Header Section - Bootstrap style */}
      <div className="fnb-header">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <h1 className="display-4 fw-bold">Food & Beverage</h1>
              <p className="lead">Jelajahi berbagai pilihan kuliner di Arion Mall, dari restoran mewah hingga café santai dan food court yang menawarkan keragaman cita rasa.</p>
              <div className="d-flex justify-content-center mt-4">
                <div className="badge bg-primary me-2">Restoran</div>
                <div className="badge bg-success me-2">Café</div>
                <div className="badge bg-warning me-2">Fast Food</div>
                <div className="badge bg-danger">Dessert</div>
              </div>
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

      <div className="fnb-grid">
        {filteredTenants.map((tenant) => (
          <div key={tenant.id} className="fnb-card">
            <div className="fnb-image">
              <Image
                src={tenant.image}
                alt={tenant.name}
                width={400}
                height={250}
                objectFit="cover"
              />
              <div className="floor-badge">{tenant.floor}</div>
            </div>
            
            <div className="fnb-content">
              <h2>{tenant.name}</h2>
              
              <div className="location-contact">
                {tenant.location !== '-' && (
                  <div className="location">
                    <i className="bi bi-geo-alt"></i>
                    <span>Location: {tenant.location}</span>
                  </div>
                )}
                
                {tenant.telephone !== '-' && (
                  <div className="contact">
                    <i className="bi bi-telephone"></i>
                    <span>{tenant.telephone}</span>
                </div>
                )}
              </div>

              <p className="description">{tenant.description}</p>
              
              <div className="category-wrapper">
                {tenant.category.map((item, index) => (
                  <span key={index} className="category-tag">
                    {item}
                  </span>
                ))}
              </div>

              <div className="hours-price">
                <div className="hours">
                  <i className="bi bi-clock"></i>
                  <span>{tenant.operationalHours}</span>
                </div>
                
                {tenant.priceRange && (
                  <div className="price">
                    <i className="bi bi-cash"></i>
                    <span>{tenant.priceRange}</span>
                  </div>
                )}
              </div>

              {tenant.highlights && (
                <div className="highlights">
                  <div className="highlights-title">Highlights:</div>
                  <div className="highlights-content">
                    {tenant.highlights.map((highlight, index) => (
                      <div key={index} className="highlight-item">
                        <i className="bi bi-star-fill"></i>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 