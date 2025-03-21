'use client';

import React from 'react';
import Image from 'next/image';
import './styles.css';

interface DeptStore {
  id: string;
  name: string;
  floor: string;
  image: string;
  telephone: string;
  description: string;
  products: string[];
  operationalHours: string;
}

const deptStores: DeptStore[] = [
  {
    id: '1',
    name: 'MATAHARI DEPT. STORE',
    floor: '3rd-4th FLOOR',
    image: '/assets/img/matahari-logo.jpeg',
    telephone: '021-4701482/83',
    description: 'Matahari Department Store adalah jaringan toko retail terkemuka di Indonesia yang menawarkan berbagai produk fashion, kecantikan, dan peralatan rumah tangga berkualitas dengan harga terjangkau.',
    products: ['Pakaian Wanita', 'Pakaian Pria', 'Pakaian Anak', 'Sepatu & Tas', 'Kosmetik', 'Perlengkapan Rumah Tangga'],
    operationalHours: '10:00 - 22:00 WIB',
  },
  {
    id: '2',
    name: 'POJOK BUSANA',
    floor: '1st FLOOR',
    image: '/assets/img/pojokbusana-logo.jpg',
    telephone: '021-4711554',
    description: 'Pojok Busana menawarkan berbagai pilihan pakaian dengan harga terjangkau untuk seluruh keluarga.',
    products: ['Pakaian Wanita', 'Pakaian Pria', 'Pakaian Anak', 'Perlengkapan Sekolah'],
    operationalHours: '10:00 - 21:00 WIB',
  }
];

export default function DepartmentStore() {
  return (
    <div className="dept-store-container">
      {/* Header Section - Modern retail theme */}
      <div className="dept-store-header">
        <div className="retail-header-container">
          <div className="retail-header-content">
            <span className="retail-overline">One-Stop Shopping</span>
            <h1 className="retail-title">Department Store</h1>
            <div className="retail-separator"></div>
            <p className="retail-subtitle">All your lifestyle needs under one roof, from fashion to home essentials</p>
            <div className="retail-tags">
              <span>Fashion</span>
              <span>Cosmetics</span>
              <span>Household</span>
              <span>Accessories</span>
            </div>
          </div>
        </div>
      </div>

      {deptStores.map((store) => (
        <div key={store.id} className="dept-store-section">
          <div className="section-header">
            <h2>{store.name}</h2>
            <span className="floor-badge">{store.floor}</span>
          </div>

          <div className="store-details">
            <div className="store-image">
              <Image
                src={store.image}
                alt={store.name}
                width={500}
                height={300}
                objectFit="cover"
              />
            </div>
            
            <div className="store-info">
              <p className="description">{store.description}</p>
              
              <div className="contact-hours">
                <div className="contact">
                  <h3>Kontak:</h3>
                  <p><i className="bi bi-telephone"></i> {store.telephone}</p>
                </div>
                <div className="hours">
                  <h3>Jam Operasional:</h3>
                  <p><i className="bi bi-clock"></i> {store.operationalHours}</p>
                </div>
              </div>
              
              <div className="products">
                <h3>Produk:</h3>
                <div className="product-tags">
                  {store.products.map((product, index) => (
                    <span key={index} className="product-tag">
                      {product}
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