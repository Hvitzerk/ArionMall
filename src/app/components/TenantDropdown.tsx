import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './TenantDropdown.css';

const tenantCategories = [
  { name: 'All Directory', path: '/tenant/all' },
  { name: 'Department Store', path: '/tenant/department-store' },
  { name: 'Entertainment', path: '/tenant/entertainment' },
  { name: 'Food & Beverage', path: '/tenant/food-beverage' },
  { name: 'Hypermarket', path: '/tenant/hypermarket' },
  { name: 'Beauty & Health', path: '/tenant/beauty-health' },
  { name: 'Fashion & Accessories', path: '/tenant/fashion-accessories' },
  { name: 'Electronics & Gadgets', path: '/tenant/electronics-gadgets' },
  { name: 'Jewelry, Optic & Watches', path: '/tenant/jewelry-optic-watches' },
];

export default function TenantDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const handleLinkClick = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  return (
    <div 
      className="tenant-dropdown"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span onClick={handleClick}>Tenant Directory</span>
      <div className={`tenant-dropdown-content ${isOpen ? 'show' : ''}`}>
        {tenantCategories.map((category, index) => (
          <a
            key={index}
            onClick={() => handleLinkClick(category.path)}
            style={{ cursor: 'pointer' }}
          >
            {category.name}
          </a>
        ))}
      </div>
    </div>
  );
} 