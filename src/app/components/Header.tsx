'use client';

import React from 'react';
import Link from 'next/link';
import './header.css'; // Pastikan file CSS diimpor
import Nav from './Nav';
import Sci from './Sci';
export default function Header() {
    return (
        <header className="header-container">
            <div className="header d-flex align-items-center fixed-top">
                <div className="container-fluid container-xl d-flex align-items-center justify-content-between">
                    <Link href="/" className="logo d-flex align-items-center">
                        {/* Ganti logo gambar dengan teks */}
                        <h1 className="logo-text">Arion Mall</h1>
                    </Link>
                    <Nav />
                    <div className="position-relative">
                    <Sci /> 
                    </div>
                </div>
            </div>
        </header>
    );
}