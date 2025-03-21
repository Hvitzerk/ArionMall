'use client';

import React from 'react';
import Image from 'next/image';
import './styles.css';

interface Milestone {
  year: string;
  title: string;
  description: string;
}

interface Value {
  icon: string;
  title: string;
  description: string;
}

const milestones: Milestone[] = [
  {
    year: '2010',
    title: 'Awal Perjalanan',
    description: 'Arion Mall pertama kali dibuka sebagai pusat perbelanjaan modern di Jakarta Timur.'
  },
  {
    year: '2015',
    title: 'Renovasi Besar',
    description: 'Mengalami renovasi besar-besaran untuk memberikan pengalaman berbelanja yang lebih nyaman.'
  },
  {
    year: '2020',
    title: 'Era Digital',
    description: 'Mengintegrasikan teknologi digital untuk meningkatkan pelayanan kepada pengunjung.'
  }
  // Data akan diupdate sesuai kebutuhan
];

const values: Value[] = [
  {
    icon: 'bi bi-star',
    title: 'Kualitas',
    description: 'Berkomitmen untuk memberikan pengalaman berbelanja berkualitas tinggi.'
  },
  {
    icon: 'bi bi-heart',
    title: 'Kepuasan Pelanggan',
    description: 'Mengutamakan kepuasan pelanggan dalam setiap aspek layanan.'
  },
  {
    icon: 'bi bi-people',
    title: 'Komunitas',
    description: 'Menjadi pusat komunitas yang menghubungkan masyarakat sekitar.'
  }
  // Data akan diupdate sesuai kebutuhan
];

export default function About() {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="hero-content">
          <h1>Tentang Arion Mall</h1>
          <p>Pusat perbelanjaan modern yang menghadirkan pengalaman berbelanja terbaik untuk keluarga</p>
        </div>
      </div>

      {/* Vision Mission Section */}
      <section className="vision-mission">
        <div className="section-content">
          <div className="vision">
            <h2>Visi</h2>
            <p>Menjadi pusat perbelanjaan terdepan yang memberikan pengalaman berbelanja berkualitas dan bernilai bagi masyarakat.</p>
          </div>
          <div className="mission">
            <h2>Misi</h2>
            <ul>
              <li>Menyediakan berbagai pilihan produk dan layanan berkualitas</li>
              <li>Menciptakan lingkungan berbelanja yang nyaman dan aman</li>
              <li>Memberikan pelayanan terbaik kepada pengunjung</li>
              <li>Mendukung pertumbuhan ekonomi lokal</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values">
        <h2>Nilai-Nilai Kami</h2>
        <div className="values-grid">
          {values.map((value, index) => (
            <div key={index} className="value-card">
              <i className={value.icon}></i>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Milestones Section */}
      <section className="milestones">
        <h2>Perjalanan Kami</h2>
        <div className="timeline">
          {milestones.map((milestone, index) => (
            <div key={index} className="timeline-item">
              <div className="year">{milestone.year}</div>
              <div className="content">
                <h3>{milestone.title}</h3>
                <p>{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Facilities Section */}
      <section className="facilities">
        <h2>Fasilitas</h2>
        <div className="facilities-grid">
          <div className="facility">
            <div className="facility-icon">
              <i className="bi bi-p-square-fill"></i>
            </div>
            <h3>Area Parkir Luas</h3>
            <p>Parkir aman dan nyaman dengan kapasitas besar</p>
          </div>
          <div className="facility">
            <div className="facility-icon">
              <i className="bi bi-building-fill"></i>
            </div>
            <h3>Musholla</h3>
            <p>Tempat ibadah yang nyaman dan bersih</p>
          </div>
          <div className="facility">
            <div className="facility-icon">
              <i className="bi bi-heart-pulse-fill"></i>
            </div>
            <h3>Ruang Menyusui</h3>
            <p>Fasilitas khusus untuk ibu dan bayi</p>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="location">
        <h2>Lokasi Strategis</h2>
        <div className="location-content">
          <div className="map">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.2671580345645!2d106.88791007475037!3d-6.193892293793731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4cc4c555581%3A0x2c3ea95ddd6b2533!2sArion%20Mall!5e1!3m2!1sen!2sid!4v1742149771632!5m2!1sen!2sid"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="location-info">
            <h3>Akses Mudah</h3>
            <ul>
              <li>
                <i className="bi bi-train-front"></i>
                <span>Dekat dengan Stasiun KRL</span>
              </li>
              <li>
                <i className="bi bi-bus-front"></i>
                <span>Tersedia transportasi umum</span>
              </li>
              <li>
                <i className="bi bi-car-front"></i>
                <span>Akses langsung dari jalan utama</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
} 