'use client';
import React, { useState, useEffect } from 'react';
import PostItemOne from '../components/PostItemOne';
import Preloader from '../components/Preloader';
import { ItemType } from '@/section/Posts';
import PageTitle from '../components/PageTitle';
import './postitems.css';

export default function PostItems() {
  const [items, setItems] = useState<ItemType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mendapatkan kategori unik
  const getUniqueCategories = () => {
    const categories = items.map(item => item.category);
    return ['All', ...new Set(categories)].filter(Boolean);
  };

  // Fungsi untuk memfilter post berdasarkan kategori
  const getFilteredPosts = () => {
    if (selectedCategory === 'All') {
      return items;
    }
    return items.filter(item => item.category === selectedCategory);
  };

  // Reset kategori dan muat ulang data
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setLoading(true);
    fetch('/api/postitems')
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(e => {
        console.log(e.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetch('/api/postitems')
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
        setSelectedCategory('All'); // Reset kategori ke 'All' setiap kali data dimuat
      })
      .catch(e => {
        console.log(e.message);
        setLoading(false);
      });
  }, []);

  return (
    <main id="main">
      <section id="post" className="posts">
        <div className="container">
          <div className="row">
            <div className="d-flex justify-content-between align-items-center">
              <PageTitle title="All News" />
              <div className="dropdown">
                <select 
                  className="form-select" 
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  {getUniqueCategories().map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {loading ? (
              <Preloader />
            ) : (
              <div className="row g-4 row-equal-height">
                {getFilteredPosts().map((item) => (
                  <div key={item._id} className="col-md-6 col-lg-4 d-flex">
                    <PostItemOne large={false} item={item} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
