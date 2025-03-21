'use client';

import { useState, useEffect } from 'react';
import styles from './dashboard.module.css';
import PostItemsManager from './postitemsmanager';
import './dashboard-styles.css'; // Import file CSS baru

interface Post {
  _id: string;
  title: string;
  category: string;
  brief: string;
  content: string;
  author: string;
  img?: string;
  date: string;
}

// Jangan panggil clearOldToken secara otomatis lagi
// Dibiarkan untuk digunakan fungsi tersebut jika diperlukan nanti
const clearOldToken = () => {
  document.cookie = 'admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TIDAK LAGI menghapus token secara otomatis
    // Biarkan sistem validasi yang bekerja
    // clearOldToken();
    
    // Tambahkan ping interval untuk menjaga sesi aktif di dashboard
    const dashboardPingInterval = setInterval(async () => {
      try {
        // Kirim ping ke server untuk memperbarui timestamp dashboard
        await fetch('/api/admin/dashboard/verify', {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          }
        });
        console.log("Dashboard ping sent to keep session active");
      } catch (err) {
        console.error('Dashboard ping error:', err);
      }
    }, 3000); // Kirim ping setiap 3 detik
    
    // Load client-side script untuk menghapus auth saat navigasi
    const script = document.createElement('script');
    script.src = '/admin/dashboard/clearAuth.js';
    script.async = true;
    document.body.appendChild(script);

    // Verifikasi login status sebelum melanjutkan
    const verifyLoginStatus = async () => {
      try {
        // Buat API call sederhana untuk memverifikasi status login
        const res = await fetch('/api/admin/dashboard/verify', {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          }
        });
        
        if (!res.ok) {
          // Jika token tidak valid, redirect ke login
          window.location.href = '/admin/auth';
          return;
        }
        
        // Jika token valid, lanjutkan fetch posts
        fetchPosts();
        
        // HAPUS interval refresh otomatis yang menyebabkan blinking
        // const refreshInterval = setInterval(() => {
        //   console.log("Auto-refreshing dashboard data...");
        //   fetchPosts();
        // }, 5000);
        
        // // Clear interval on unmount
        // return () => clearInterval(refreshInterval);
      } catch (err) {
        console.error('Verification error:', err);
        // Pada error, asumsikan tidak login dan redirect
        window.location.href = '/admin/auth';
      }
    };
    
    verifyLoginStatus();
    
    // PENTING: Fungsi ini akan dijalankan saat pengguna meninggalkan halaman
    const clearAuthOnNavigate = () => {
      console.log('User navigating away from dashboard, clearing auth...');
      document.cookie = 'admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };

    // Tambahkan event listener untuk event visibilitychange
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        clearAuthOnNavigate();
      }
    });

    // Tambahkan event listener untuk beforeunload (tab/window close)
    window.addEventListener('beforeunload', clearAuthOnNavigate);
    
    // Tambahkan event listener untuk saat pengguna menekan tombol history back/forward
    window.addEventListener('popstate', clearAuthOnNavigate);
    
    // Fungsi ini berjalan saat komponen di-unmount atau navigasi dalam aplikasi
    return () => {
      console.log('Dashboard component unmounting, clearing auth...');
      clearAuthOnNavigate();
      window.removeEventListener('beforeunload', clearAuthOnNavigate);
      window.removeEventListener('popstate', clearAuthOnNavigate);
      document.removeEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          clearAuthOnNavigate();
        }
      });
      clearInterval(dashboardPingInterval);
    };
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      console.log("Fetching dashboard data from new API endpoint...");
      
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      
      // Use our new simplified API endpoint that doesn't have cookie issues
      const dashboardRes = await fetch(`/api/dashboard/posts?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (dashboardRes.ok) {
        const dashboardData = await dashboardRes.json();
        console.log('Dashboard data fetched successfully:', dashboardData);
        
        // Update state with fetched posts
        if (dashboardData.posts && Array.isArray(dashboardData.posts)) {
          setPosts(dashboardData.posts);
        } else {
          console.warn('Received invalid posts data format:', dashboardData.posts);
          setPosts([]);
        }
        
        // If we got empty data, try seeding
        if (dashboardData.count && dashboardData.count.posts === 0 && dashboardData.count.postItems === 0) {
          console.log("No data found - attempting to seed database...");
          try {
            const seedRes = await fetch('/api/seed', {
              cache: 'no-store',
              headers: { 'Cache-Control': 'no-cache' }
            });
            
            if (seedRes.ok) {
              const seedData = await seedRes.json();
              console.log("Seed result:", seedData);
              
              // Refresh dashboard data after seeding
              setTimeout(() => {
                fetchPosts(); // Fetch again after a short delay
              }, 1000);
            }
          } catch (seedErr) {
            console.error("Error seeding database:", seedErr);
          }
        }
      } else {
        setError('Gagal mengambil data dashboard. Status: ' + dashboardRes.status);
        console.error('API response error:', dashboardRes.status, await dashboardRes.text());
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Terjadi kesalahan saat mengambil data: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout API to clear cookies server-side
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
      });
      
      // Then redirect to login page
      window.location.href = '/admin/auth';
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback to client-side cookie clearing if API fails
      document.cookie = 'admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      window.location.href = '/admin/auth';
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </header>
      
      <div className="stats-container">
        <div className="stat-card">
          <p className="stat-title">Total Posts</p>
          <p className="stat-value">{posts.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-title">Total Items</p>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-card">
          <p className="stat-title">Active Users</p>
          <p className="stat-value">1</p>
        </div>
      </div>
      
      <div className="tabs-container">
        <div className="tab-content">
          <PostItemsManager />
        </div>
      </div>
    </div>
  );
}
