import React from 'react';
import { navs } from '@/data/data';
import './Nav.css';
import Link from 'next/link';
import TenantDropdown from './TenantDropdown';

interface NavProps {
  closeMenu: () => void;
}

export default function Nav({ closeMenu }: NavProps) {
  return (
    <nav id="navbar" className="navbar">
      <ul>
        {navs.map((nav) => (
          <li key={nav.id}>
            {nav.name === 'Tenant Directory' ? (
              <TenantDropdown />
            ) : (
              <Link href={nav.link} onClick={closeMenu}>
                {nav.name === 'Home' ? (
                  <i className="bi bi-house-door"></i>
                ) : (
                  nav.name
                )}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
