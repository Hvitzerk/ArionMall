import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './postItemOne.css';
import { ItemType } from '@/section/Posts';

// Fungsi untuk mendeteksi gender berdasarkan nama
const getGenderIcon = (name: string) => {
  // Daftar nama yang mengindikasikan gender
  const femaleNames = ['putri', 'siti', 'dewi', 'sri', 'ani', 'rani', 'maria', 'sarah', 'linda', 'susan'];
  const nameLower = name.toLowerCase();
  
  // Cek apakah nama mengandung kata yang mengindikasikan gender
  const isFemale = femaleNames.some(femaleName => nameLower.includes(femaleName));
  
  return isFemale ? "bi-person-heart" : "bi-person";
};

export default function PostItemOne({
  large,
  item,
}: {
  large: boolean;
  item: ItemType;
}) {
  const [formattedDate, setFormattedDate] = useState('');

  // Format the date on the client side with null check
  useEffect(() => {
    if (item && item.date) {
      setFormattedDate(new Date(item.date).toLocaleDateString('en-US'));
    } else {
      setFormattedDate('No date');
    }
  }, [item]);

  if (!item) {
    return null;
  }

  return (
    <div className={`post-entry-1 ${large ? 'lg' : ''} animate-post`}>
      <Link href={`/postitems/${item._id}`}>
        {item.img ? (
          <div className="post-image-container" style={{ position: 'relative', width: '100%', paddingBottom: '60%', overflow: 'hidden' }}>
            <Image 
              src={item.img.startsWith('/') ? item.img : `/${item.img}`} 
              alt={item.title} 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="img-fluid"
              style={{ objectFit: 'contain', objectPosition: 'center' }}
              onError={(e) => {
                console.error("Failed to load image:", item.img);
                // Set fallback image
                const imgElement = e.target as HTMLImageElement;
                if (imgElement) {
                  imgElement.src = '/assets/img/mall-interior.jpg';
                }
              }}
            />
          </div>
        ) : null}
      </Link>
      <div className="post-meta">
        <span className="date">{item.category}</span>
        <span className="mx-1">
          <i className="bi bi-dot"></i>
        </span>
        <span>{formattedDate}</span>
      </div>
      <h2>
        <Link href={`/postitems/${item._id}`}>{item.title}</Link>
      </h2>

      {large ? (
        <>
          <p className="mb-4 d-block">{item.brief}</p>

          <div className="d-flex align-items-center author">
            <div className="photo">
              <i className={`bi ${getGenderIcon(item.author)} author-icon`}></i>
            </div>
            <div className="name">
              <h3 className="m-0 p-0 author-name">{item.author}</h3>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
