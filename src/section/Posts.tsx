'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './posts.css';
import PostItemOne from '@/app/components/PostItemOne';
import TrendingPost from '@/app/components/TrendingPost';
import Preloader from '@/app/components/Preloader';

export interface ItemType {
  _id: string;
  img: string;
  category: string;
  date: string;
  title: string;
  brief: string;
  avatar: string;
  author: string;
  whatsNew?: boolean;
  top?: boolean;
  showInMiddle?: boolean;
  order?: number;
}

export default function Posts() {
  const router = useRouter();
  const [items, setItems] = useState<ItemType[]>([]);
  const [item, setItem] = useState<ItemType>({
    _id: '',
    img: '',
    category: '',
    date: '',
    title: '',
    brief: '',
    avatar: '',
    author: '',
  });

  const getItemsData = () => {
    fetch('/api/postitems')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          console.error('Expected array from API but got:', typeof data);
          setItems([]);
        }
      })
      .catch(e => {
        console.error('Error fetching items:', e.message);
        setItems([]);
      });
  };

  const getSinglePostData = (id: string) => {
    fetch(`/api/postitems/${id}`)
      .then(res => {
        return res.status === 200 ? res.json() : null;
      })
      .then(data => {
        if (data) setItem(data);
      })
      .catch(e => console.log(e.message));
  };

  const getMiddlePosts = () => {
    if (!Array.isArray(items)) return [];
    
    return items
      .filter(item => !item.top && item.showInMiddle === true)
      .sort((a, b) => (a.order || 999) - (b.order || 999));
  };

  const getTopPost = () => {
    if (!Array.isArray(items)) return {
      _id: '',
      img: '',
      category: '',
      date: '',
      title: '',
      brief: '',
      avatar: '',
      author: '',
    };
    
    return items.find(item => item.top === true) || {
      _id: '',
      img: '',
      category: '',
      date: '',
      title: '',
      brief: '',
      avatar: '',
      author: '',
    };
  };

  useEffect(() => {
    getItemsData();
  }, []);

  return (
    <section className="post-grid-section">
      <div className="container" data-aos="fade-up">
        <div className="row g-5">
          <div className="col-lg-4">
            <PostItemOne large={true} item={getTopPost()} />
          </div>
          <div className="col-lg-8">
            <div className="row g-5 row-equal-height">
              <div className="col-lg-4 border-start custom-border d-flex flex-column">
                {items && items.length > 0 ? (
                  getMiddlePosts()
                    .slice(0, 3)
                    .map((item: ItemType) => (
                      <PostItemOne key={item._id} large={false} item={item} />
                    ))
                ) : (
                  <Preloader />
                )}
              </div>
              <div className="col-lg-4 border-start custom-border d-flex flex-column">
                {items && items.length > 0 ? (
                  getMiddlePosts()
                    .slice(3, 6)
                    .map((item: ItemType) => (
                      <PostItemOne key={item._id} large={false} item={item} />
                    ))
                ) : (
                  <Preloader />
                )}
              </div>
              <div className="col-lg-4">
                <div className="trending">
                  <h3>What&apos;s New</h3>
                  <ul className="trending-post">
                    {items && items.length > 0 ? (
                      items
                        .filter((item: ItemType) => item.whatsNew)
                        .map((item: ItemType, index: number) => (
                          <TrendingPost key={item._id} index={index} item={item} />
                        ))
                    ) : (
                      <Preloader />
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
