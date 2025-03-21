// Centralized auth utilities

// Secret key untuk verifikasi token
export const SECRET_KEY = new TextEncoder().encode('d27a2ac0c6adf4175b94c90d47a7ba');

// Server start time yang konsisten di seluruh aplikasi
// PENTING: Server start time harus menjadi konstan selama aplikasi berjalan
// Jika diubah menjadi konstanta statis bukan function yang dieksekusi setiap kali di-import
export const SERVER_START_TIME = 'STATIC_SERVER_TIME';

// Max session age in ms (30 minutes)
export const MAX_SESSION_AGE = 30 * 60 * 1000;

// Fungsi untuk menghapus token admin di client-side
export const clearAdminToken = () => {
  document.cookie = 'admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};
