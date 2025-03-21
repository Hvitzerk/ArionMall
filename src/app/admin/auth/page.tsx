'use client';

import { useState, useEffect } from 'react';
import styles from './auth.module.css';

export default function AdminAuth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Untuk debugging, tampilkan status login saat ini
    console.log('Admin login page loaded');
    
    // Bersihkan semua error sebelumnya
    setError('');
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (data.success) {
        // Login berhasil
        console.log('Redirecting to:', data.redirectUrl);
        
        // Gunakan window.location untuk hard redirect (bukan router)
        // Ini untuk memastikan page benar-benar di-refresh
        window.location.href = data.redirectUrl;
      } else {
        // Login gagal
        setError(data.message || 'Login failed');
        setLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    // Perbaiki fungsi toggle password yang sebelumnya error
    const showPasswordInput = document.getElementById('password') as HTMLInputElement;
    if (showPasswordInput) {
      showPasswordInput.type = showPasswordInput.type === 'password' ? 'text' : 'password';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1>Admin Login</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Masukkan username"
              disabled={loading}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.passwordContainer}>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Masukkan password"
                disabled={loading}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={togglePasswordVisibility}
                disabled={loading}
                aria-label="Tampilkan password"
              >
                <i className="bi bi-eye-slash"></i>
              </button>
            </div>
          </div>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? (
              <div className={styles.spinnerContainer}>
                <div className={styles.spinner}></div>
                <span>Loading...</span>
              </div>
            ) : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
