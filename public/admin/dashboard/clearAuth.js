// Script untuk berjalan di sisi klien
// Mendeteksi navigasi keluar dari halaman admin dashboard

;(function() {
  // Intercept all click events
  document.addEventListener('click', function(e) {
    // Cek apakah yang diklik adalah link (a tag)
    let target = e.target;
    while (target && target.tagName !== 'A') {
      target = target.parentNode;
      if (!target) return;
    }
    
    // Jika link yang diklik bukan ke dashboard, hapus token
    if (target && target.href && !target.href.includes('/admin/dashboard')) {
      console.log('Navigating away from dashboard, clearing auth token');
      document.cookie = 'admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  });
  
  // Intercept form submissions
  document.addEventListener('submit', function() {
    // Hapus token ketika form di-submit (biasanya search form)
    document.cookie = 'admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  });
  
  // Deteksi ketika pengguna mencoba meninggalkan halaman
  window.addEventListener('pagehide', function() {
    document.cookie = 'admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  });
  
  // Deteksi navigasi manual (ketik URL baru)
  let lastUrl = window.location.href;
  new MutationObserver(() => {
    const url = window.location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      if (!url.includes('/admin/dashboard')) {
        document.cookie = 'admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }
    }
  }).observe(document, {subtree: true, childList: true});
  
  console.log('Auth protection script loaded for dashboard');
})();
