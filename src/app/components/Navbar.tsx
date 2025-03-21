'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.style.overflow = !isOpen ? 'hidden' : '';
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="left-section">
          <Link href="/" className="navbar-brand">
            <Image
              src="/assets/img/logo_arionmall.jpg"
              alt="Arion Mall Logo"
              width={120}
              height={40}
              priority
            />
          </Link>
        </div>

        <div className="right-section">
          {/* Search Icon - akan disembunyikan di mobile */}
          <div className="search-icon">
            <i className="bi bi-search"></i>
          </div>

          {/* Instagram Icon */}
          <a 
            href="https://www.instagram.com/arionmall/" 
            className="social-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-instagram"></i>
          </a>

          {/* Mobile Menu Button */}
          <button 
            className={`mobile-menu-btn ${isOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="menu-icon"></span>
          </button>
        </div>

        {/* Navigation Links */}
        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          <Link href="/" className="nav-link" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link href="/postitems" className="nav-link" onClick={() => setIsOpen(false)}>
            News
          </Link>
          <Link href="/TenantDirectorylist" className="nav-link" onClick={() => setIsOpen(false)}>
            Tenant Directory
          </Link>
          <Link href="/about" className="nav-link" onClick={() => setIsOpen(false)}>
            About
          </Link>
          <Link href="/contact" className="nav-link" onClick={() => setIsOpen(false)}>
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
} 