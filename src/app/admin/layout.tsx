'use client';

import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout" style={{ padding: 0, margin: 0 }}>
      {children}
    </div>
  );
}
