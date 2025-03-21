'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ItemType } from '@/section/Posts';
import './postDetail.css';
import Link from 'next/link';
import Preloader from '@/app/components/Preloader';

// Fungsi untuk mendeteksi gender berdasarkan nama
const getGenderIcon = (name: string) => {
  // Daftar nama yang mengindikasikan gender
  const femaleNames = ['putri', 'siti', 'dewi', 'sri', 'ani', 'rani', 'maria', 'sarah', 'linda', 'susan'];
  const nameLower = name.toLowerCase();
  
  // Cek apakah nama mengandung kata yang mengindikasikan gender
  const isFemale = femaleNames.some(femaleName => nameLower.includes(femaleName));
  
  return isFemale ? "bi-person-heart" : "bi-person";
};

export default function PostDetail() {
  const params = useParams();
  const [item, setItem] = useState<ItemType | null>(null);
  const [loading, setLoading] = useState(true);
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/postitems/${params.id}`);
        const data = await response.json();
        setItem(data);
        if (data.date) {
          setFormattedDate(new Date(data.date).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }));
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

  if (loading) {
    return <Preloader />;
  }

  if (!item) {
    return (
      <div className="error-container">
        <h1>Post tidak ditemukan</h1>
        <Link href="/postitems" className="back-button">
          Kembali ke Daftar Post
        </Link>
      </div>
    );
  }

  return (
    <main className="post-detail-container">
      <div className="post-header">
        <div className="category-badge">{item.category}</div>
        <h1 className="post-title">{item.title}</h1>
        <div className="post-meta">
          <div className="author-info">
            <i className={`bi ${getGenderIcon(item.author)} author-icon`}></i>
            <span className="author-name">{item.author}</span>
          </div>
          <div className="post-date">
            <i className="bi bi-calendar3"></i>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      <div className="post-content">
        <div className="featured-image-container">
          {item.img && (
            <img
              src={item.img.startsWith('/') ? item.img : `/${item.img}`}
              alt={item.title}
              className="featured-image"
              onError={(e) => {
                console.error("Failed to load image:", item.img);
                const imgElement = e.target as HTMLImageElement;
                if (imgElement) {
                  imgElement.src = '/assets/img/mall-interior.jpg';
                }
              }}
            />
          )}
        </div>

        <div className="post-description">
          <p>{item.brief}</p>
        </div>

        <div className="share-section">
          <h3>Bagikan artikel ini</h3>
          <div className="social-buttons">
            <button className="social-button facebook">
              <i className="bi bi-facebook"></i>
            </button>
            <button className="social-button twitter">
              <i className="bi bi-twitter-x"></i>
            </button>
            <button className="social-button whatsapp">
              <i className="bi bi-whatsapp"></i>
            </button>
            <button className="social-button telegram">
              <i className="bi bi-telegram"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="navigation-buttons">
        <Link href="/postitems" className="back-to-posts">
          <i className="bi bi-arrow-left"></i>
          Kembali ke Daftar Post
        </Link>
      </div>
    </main>
  );
} 