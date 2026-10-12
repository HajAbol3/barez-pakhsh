// ===== Sample Data =====
const vehiclesData = {
  1: {
    id: 1,
    plate: '۶۵ ایران ۴۶۳ ع ۹۶',
    type: 'نیسان',
    driver: 'ابوذر دهقان اناری',
    status: 'active',
    distance: 90000,
    customers: 5590,
    deliveries: 210,
    year: 1401,
    routes: [
      { name: 'منطقه ۲', count: 78 },
      { name: 'حومه', count: 54 },
      { name: 'منطقه ۵', count: 41 },
      { name: 'منطقه ۱', count: 37 }
    ],
    repairs: [
      {
        date: '۱۴۰۵/۰۵/۰۱',
        part: 'بلبرینگ چرخ جلو',
        mechanic: 'جعفر جعفری',
        cost: 83000000,
        description: 'تعویض بلبرینگ دو طرف جلو'
      },
      {
        date: '۱۴۰۵/۰۳/۱۸',
        part: 'لنت ترمز',
        mechanic: 'علی رضایی',
        cost: 12500000,
        description: 'تعویض لنت جلو و عقب'
      },
      {
        date: '۱۴۰۴/۱۱/۲۵',
        part: 'روغن موتور + فیلتر',
        mechanic: 'جعفر جعفری',
        cost: 4800000,
        description: 'سرویس دوره‌ای'
      }
    ]
  },
  2: {
    id: 2,
    plate: '۱۲۳ ب ۴۵',
    type: 'پراید',
    driver: 'علی محمدی',
    status: 'active',
    distance: 81407,
    customers: 4386,
    deliveries: 194,
    year: 1399,
    routes: [
      { name: 'منطقه ۱', count: 62 },
      { name: 'منطقه ۳', count: 48 }
    ],
    repairs: [
      {
        date: '۱۴۰۵/۰۶/۰۱',
        part: 'دینام',
        mechanic: 'حسین محمدی',
        cost: 18500000,
        description: 'تعویض دینام'
      }
    ]
  }
};

// ===== Helpers =====
function formatNumber(num) {
  return new Intl.NumberFormat('fa-IR').format(num);
}

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// ===== Load Vehicle =====
function loadVehicle() {
  const id = getQueryParam('id') || '1';
  const vehicle = vehiclesData[id] || vehiclesData[1];

  // Header
  document.getElementById('vehiclePlate').textContent = vehicle.plate;
  document.getElementById('pageTitle').textContent = vehicle.plate;
  document.getElementById('vehicleType').textContent = vehicle.type;
  document.getElementById('vehicleDriver').textContent = vehicle.driver;

  const statusEl = document.getElementById('vehicleStatus');
  statusEl.textContent = vehicle.status === 'active' ? 'فعال' : 'غیرفعال';

  // Stats
  document.getElementById('statDistance').textContent = formatNumber(vehicle.distance);
  document.getElementById('statCustomers').textContent = formatNumber(vehicle.customers);
  document.getElementById('statDeliveries').textContent = formatNumber(vehicle.deliveries);
  document.getElementById('statYear').textContent = formatNumber(vehicle.year);

  // Routes
  const routesGrid = document.getElementById('routesGrid');
  routesGrid.innerHTML = vehicle.routes.map(r => `
    <div class="route-card">
      <div class="route-name">${r.name}</div>
      <div class="route-count">${formatNumber(r.count)} پخش</div>
    </div>
  `).join('');

  // Repairs
  const repairsList = document.getElementById('repairsList');
  if (vehicle.repairs.length === 0) {
    repairsList.innerHTML = `<div class="table-empty"><i class="bi bi-tools"></i><p>تعمیری ثبت نشده</p></div>`;
  } else {
    repairsList.innerHTML = vehicle.repairs.map(r => `
      <div class="repair-item">
        <div class="repair-header">
          <div class="repair-date">${r.date}</div>
          <div class="repair-cost">${formatNumber(r.cost)} ریال</div>
        </div>
        <div class="repair-details">
          <div class="repair-detail">
            <span class="label">قطعه</span>
            <span class="value">${r.part}</span>
          </div>
          <div class="repair-detail">
            <span class="label">تعمیرکار</span>
            <span class="value">${r.mechanic}</span>
          </div>
          <div class="repair-detail">
            <span class="label">توضیحات</span>
            <span class="value">${r.description}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Chart
  initChart();
}

// ===== Tabs =====
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// ===== Chart =====
function initChart() {
  const ctx = document.getElementById('usageChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور'],
      datasets: [{
        label: 'مسافت (کیلومتر)',
        data: [12500, 14200, 13100, 15800, 16700, 15200],
        borderColor: '#e11d48',
        backgroundColor: 'rgba(225, 29, 72, 0.08)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#e11d48',
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' } },
        x: { grid: { display: false } }
      }
    }
  });
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', loadVehicle);