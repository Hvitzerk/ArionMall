'use client';

import React, { useState } from 'react';
import './styles.css';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Kirim data form ke API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Gagal mengirim pesan');
      }
      
      // Jika berhasil
      setSubmitStatus({
        success: true,
        message: 'Pesan Anda berhasil dikirim. Tim kami akan menghubungi Anda segera.'
      });
      
      // Reset form setelah berhasil
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      
    } catch (error) {
      // Jika gagal
      setSubmitStatus({
        success: false,
        message: 'Mohon maaf, terjadi kesalahan saat mengirim pesan. Silakan coba lagi nanti.'
      });
      console.error('Error sending form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-container">
      {/* Hero Section */}
      <div className="contact-hero">
        <div className="hero-content">
          <h1>Hubungi Kami</h1>
          <p>Kami siap membantu Anda dengan informasi yang Anda butuhkan</p>
        </div>
      </div>

      <div className="contact-content">
        {/* Contact Information */}
        <section className="contact-info">
          <div className="info-card clickable" onClick={() => window.open('https://www.google.com/maps?q=-6.193892,106.887910', '_blank')}>
            <i className="bi bi-geo-alt"></i>
            <h3>Lokasi</h3>
            <p>Jl. Pemuda No. 3-5, Rawamangun</p>
            <p>Jakarta Timur, 13220</p>
          </div>

          <div className="info-card">
            <i className="bi bi-telephone"></i>
            <h3>Telepon</h3>
            <p>Customer Service:</p>
            <p>(021) XXX-XXXX</p>
          </div>

          <div className="info-card">
            <i className="bi bi-envelope"></i>
            <h3>Email</h3>
            <p>info@arionmall.com</p>
            <p>cs@arionmall.com</p>
          </div>

          <div className="info-card">
            <i className="bi bi-clock"></i>
            <h3>Jam Operasional</h3>
            <p>Senin - Minggu:</p>
            <p>10:00 - 22:00 WIB</p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="contact-form-section">
          <div className="form-container">
            <h2>Kirim Pesan</h2>
            <p>Silakan isi form di bawah ini untuk mengirim pesan kepada kami</p>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Nama Lengkap</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Masukkan nama lengkap Anda"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Masukkan alamat email Anda"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subjek</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Masukkan subjek pesan"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Pesan</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tulis pesan Anda di sini"
                  rows={6}
                ></textarea>
              </div>

              {submitStatus && (
                <div className={`submit-status ${submitStatus.success ? 'success' : 'error'}`}>
                  {submitStatus.message}
                </div>
              )}

              <button type="submit" className="submit-button" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Mengirim...
                  </>
                ) : 'Kirim Pesan'}
              </button>
            </form>
          </div>
        </section>

        {/* Map Section */}
        <section className="map-section">
          <h2>Lokasi Kami</h2>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.2671580345645!2d106.88791007475037!3d-6.193892293793731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4cc4c555581%3A0x2c3ea95ddd6b2533!2sArion%20Mall!5e1!3m2!1sen!2sid!4v1742149771632!5m2!1sen!2sid"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        {/* Social Media Section */}
        
      </div>
    </div>
  );
}
