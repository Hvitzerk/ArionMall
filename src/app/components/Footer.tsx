'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './footer.css';

interface CompanyLink {
  name: string;
  url: string;
}

const companyGroups = {
  main: {
    name: 'ARION PARAMITA GROUP',
    companies: [
      {
        name: 'Arion Paramita Holding Company',
        url: 'https://www.arionparamita.co.id/home.php'
      }
    ]
  },
  subsidiaries: [
    {
      name: 'Property & Transport',
      companies: [
        {
          name: 'Arion Indonesia Properti',
          url: 'https://www.arionproperti.com/'
        },
        {
          name: 'Arion Indonesia Transport',
          url: 'https://www.ariontransport.com/'
        }
      ]
    },
    {
      name: 'Hotels',
      companies: [
        {
          name: 'Arion Suites Hotel Bandung',
          url: 'https://arionsuiteshotel.com/'
        },
        {
          name: 'Arion Suites Hotel Kemang',
          url: 'https://arionsuiteshotelkemang.com/'
        },
        {
          name: 'Luxury Inn Arion Hotel',
          url: 'https://arionhotelpemuda.com/'
        },
        {
          name: 'Citra Cikopo Hotel',
          url: 'https://citracikopohotel.com/'
        }
      ]
    },
    {
      name: 'Services',
      companies: [
        {
          name: 'Citra Nusa Service',
          url: 'https://citraservices.co.id/'
        },
        {
          name: 'Citra Nusa Money Changer',
          url: 'https://citranusamoneychanger.com/'
        }
      ]
    }
  ]
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Main Company Section */}
        <div className="footer-main">
          <div className="company-logo">
            <Image
              src="/assets/img/logo_arionmall.jpg"
              alt="Arion Mall Logo"
              width={150}
              height={50}
              priority
              style={{
                width: 'auto',
                height: '100%',
                maxHeight: '50px'
              }}
            />
          </div>
          <div className="company-info">
            <p>Jl. Pemuda No. 3-5, Rawamangun</p>
            <p>Jakarta Timur, 13220</p>
            <p>Telp: (021) XXX-XXXX</p>
            <p>Email: info@arionmall.com</p>
          </div>
        </div>

        {/* Group Companies Section */}
        <div className="footer-groups">
          <div className="group-section main-group">
            <h3>{companyGroups.main.name}</h3>
            {companyGroups.main.companies.map((company, index) => (
              <a
                key={index}
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="company-link main-company"
              >
                {company.name}
              </a>
            ))}
          </div>

          {companyGroups.subsidiaries.map((group, index) => (
            <div key={index} className="group-section">
              <h3>{group.name}</h3>
              {group.companies.map((company, companyIndex) => (
                <a
                  key={companyIndex}
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="company-link"
                >
                  {company.name}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Social Media Section */}
        <div className="footer-social">
          <div className="social-container">
            <h3 className="social-title">IKUTI KAMI</h3>
            <div className="social-links-wrapper">
              <a 
                href="https://www.instagram.com/arionmall/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link instagram"
              >
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {new Date().getFullYear()} Arion Mall. All rights reserved.</p>
          <div className="footer-links">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 