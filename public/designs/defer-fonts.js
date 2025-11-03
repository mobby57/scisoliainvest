// Load fonts after LCP
const loadFonts = () => {
  const fontAwesome = document.createElement('link');
  fontAwesome.rel = 'stylesheet';
  fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
  
  const googleFonts = document.createElement('link');
  googleFonts.rel = 'stylesheet';
  googleFonts.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap';
  
  document.head.appendChild(fontAwesome);
  document.head.appendChild(googleFonts);
};

// Load fonts after page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadFonts);
} else {
  loadFonts();
}