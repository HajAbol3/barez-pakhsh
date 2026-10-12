// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  if (theme === 'dark') {
    themeIcon.className = 'bi bi-sun';
  } else {
    themeIcon.className = 'bi bi-moon-stars';
  }
}

// Sidebar Toggle
const sidebarToggle = document.getElementById('sidebarToggle');
sidebarToggle.addEventListener('click', () => {
  document.body.classList.toggle('sidebar-collapsed');
});

// ===== Page Loader =====
const pageLoader = document.getElementById('pageLoader');

// مخفی کردن لودینگ بعد از لود کامل صفحه
window.addEventListener('load', () => {
  setTimeout(() => {
    if (pageLoader) {
      pageLoader.classList.add('hide');
    }
  }, 400); // یه تاخیر کوچک برای حس بهتر
});

// توابع آماده برای استفاده در صفحات
function showLoader() {
  if (pageLoader) {
    pageLoader.classList.remove('hide');
  }
}

function hideLoader() {
  if (pageLoader) {
    pageLoader.classList.add('hide');
  }
}

// مثال استفاده:
// showLoader();   // نمایش لودینگ
// hideLoader();   // مخفی کردن لودینگ




  // ===== Mobile Sidebar Toggle =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebar = document.querySelector('.sidebar');

function openSidebar() {
  document.body.classList.add('sidebar-open');
  if (sidebarOverlay) sidebarOverlay.classList.add('show');
}

function closeSidebar() {
  document.body.classList.remove('sidebar-open');
  if (sidebarOverlay) sidebarOverlay.classList.remove('show');
}

// باز کردن با دکمه همبرگری
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    if (document.body.classList.contains('sidebar-open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });
}

// بستن با کلیک روی پس‌زمینه تیره
if (sidebarOverlay) {
  sidebarOverlay.addEventListener('click', closeSidebar);
}

// بستن سایدبار وقتی روی لینک‌های منو کلیک می‌شود (در موبایل)
document.querySelectorAll('.sidebar .nav-item').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 1000) {
      closeSidebar();
    }
  });
});

// بستن با کلید Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.body.classList.contains('sidebar-open')) {
    closeSidebar();
  }
});
// ===== Scroll to Top =====
const scrollTopBtn = document.getElementById('scrollTopBtn');

if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}


