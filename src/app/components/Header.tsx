"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./header.css"; // Pastikan file CSS diimpor
import Nav from "./Nav";
import Sci from "./Sci";
import Searchform from "./Searchform";
export default function Header() {
  const [open, setOpen] = useState(false);
  const [on, setOn] = useState(false);

  const handleFormOpen = (e: Event | any) => {
    e.preventDefault();
    setOpen(!open);
  };

  const handleToggleMenu = () => {
    setOn(!on);
    let body: HTMLElement | any = document.querySelector("body");
    body.classList.toggle("mobile-nav-active");
  };

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
            <a className="mx-2 js-search-open" onClick={handleFormOpen}>
              <span className="bi-search"></span>
            </a>

            {on ? (
              <i
                className="bi bi-x mobile-nav-toggle"
                onClick={handleToggleMenu}
              ></i>
            ) : (
              <i
                className="bi bi-list mobile-nav-toggle"
                onClick={handleToggleMenu}
              ></i>
            )}
            <Searchform active={open} formOpen={handleFormOpen} />
          </div>
        </div>
      </div>
    </header>
  );
}
