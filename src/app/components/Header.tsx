'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './header.css';
import Nav from './Nav';
import Sci from './Searchform';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [on, setOn] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  // Handle toggle menu
  const handleToggleMenu = () => {
    setOn(!on);
    const body = document.querySelector('body');
    if (body) {
      body.classList.toggle('mobile-nav-active');
    }
  };

  // Handle toggle search
  const handleToggleSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSearchOpen(!isSearchOpen);
    // Prevent body scroll when search is open
    const body = document.querySelector('body');
    if (body) {
      body.style.overflow = !isSearchOpen ? 'hidden' : '';
    }
  };

  // Handle search close
  const handleSearchClose = () => {
    setIsSearchOpen(false);
    const body = document.querySelector('body');
    if (body) {
      body.style.overflow = '';
    }
  };

  // Close menu on route change
  useEffect(() => {
    setOn(false);
    setIsSearchOpen(false);
    const body = document.querySelector('body');
    if (body) {
      body.classList.remove('mobile-nav-active');
      body.style.overflow = '';
    }
  }, [pathname]);

  return (
    <header className="header-container">
      <div className="header d-flex align-items-center fixed-top">
        <div className="container-fluid container-xl d-flex align-items-center justify-content-between">
          <Link href="/" className="logo d-flex align-items-center">
            <h1 className="logo-text">Arion Mall</h1>
          </Link>

          <Nav closeMenu={() => {
            setOn(false);
            const body = document.querySelector('body');
            if (body) {
              body.classList.remove('mobile-nav-active');
            }
          }} />

          <div className="position-relative d-flex align-items-center">
            <div className="social-links">
              <a 
                href="https://www.instagram.com/arionmall/" 
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-instagram"></i>
              </a>
            </div>
            
            <button
              className="search-toggle"
              onClick={handleToggleSearch}
              aria-label={isSearchOpen ? 'Close search' : 'Open search'}
            >
              <i className={`bi ${isSearchOpen ? 'bi-x' : 'bi-search'}`}></i>
            </button>

            <Sci isOpen={isSearchOpen} onClose={handleSearchClose} />

            <button
              className="mobile-nav-toggle"
              onClick={handleToggleMenu}
              aria-label="Toggle menu"
            >
              <i className={`bi ${on ? 'bi-x' : 'bi-list'}`}></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
