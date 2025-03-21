import Link from 'next/link';
import React from 'react';

export default function HeroSlide({
  slide,
}: {
  slide: {
    bgImg: string;
    title: string;
    brief: string;
  };
}) {
  return (
    <Link
      href="#"
      className="img-bg d-flex align-items-end"
      style={{ 
        backgroundImage: `url(${slide.bgImg})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}
    >
      <div className="img-bg-inner">
        <h2>{slide.title}</h2>
        <p className="d-none d-md-block">{slide.brief}</p>
      </div>
    </Link>
  );
}
