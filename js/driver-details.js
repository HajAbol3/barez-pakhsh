// ===== Sample Drivers Data =====
const driversData = {
  1: {
    id: 1,
    name: 'ابوذر دهقان اناری',
    plate: '۱۲۳ ب ۴۵ - پراید',
    phone: '۰۹۱۲۱۲۳۴۵۶۷',
    status: 'active',
    deliveries: 194,
    distance: 81407,
    customers: 4386,
    score: 4.8,
    salary: {
      food: 1850000,
      years: 2400000,
      insurance: 1200000,
      extra: 950000,
      advance: -3000000,
      penalty: -450000,
      delivery: 12500000,
      commission: 3200000,
      final: 18650000
    },
    loans: [
      { title: 'وام خودرو', amount: 450000000, remain: 280000000, installment: 12500000, nextDate: '۱۴۰۵/۰۷/۱۵' },
      { title: 'وام ضروری', amount: 50000000, remain: 18000000, installment: 2500000, nextDate: '۱۴۰۵/۰۷/۰۵' }
    ],
    penalties: [
      { date: '۱۴۰۵/۰۶/۱۲', type: 'تاخیر در تحویل', amount: 250000, desc: 'تاخیر ۲ ساعته', status: 'کسر شده' },
      { date: '۱۴۰۵/۰۵/۲۸', type: 'خسارت کالا', amount: 200000, desc: 'آسیب به محموله', status: 'کسر شده' }
    ],
    routes: [
      { name: 'منطقه ۲', count: 68 },
      { name: 'منطقه ۵', count: 42 },
      { name: 'حومه', count: 35 },
      { name: 'منطقه ۱', count: 29 }
    ],
    history: [
      { date: '۱۴۰۵/۰۶/۲۰', route: 'منطقه ۲', customers: 18, items: 145, distance: 42.5, status: 'تکمیل' },
      { date: '۱۴۰۵/۰۶/۱۹', route: 'منطقه ۵', customers: 14, items: 112, distance: 38.0, status: 'تکمیل' },
      { date: '۱۴۰۵/۰۶/۱۸', route: 'حومه', customers: 9, items: 76, distance: 61.2, status: 'تکمیل' },
      { date: '۱۴۰۵/۰۶/۱۷', route: 'منطقه ۲', customers: 21, items: 168, distance: 45.8, status: 'تکمیل' }
    ]
  },
  2: {
    id: 2,
    name: 'علی محمدی',
    plate: '۷۸۹ الف ۱۲ - پژو',
    phone: '۰۹۱۳۳۲۱۴۵۶۷',
    status: 'active',
    deliveries: 156,
    distance: 62340,
    customers: 3120,
    score: 4.6,
    salary: {
      food: 1600000,
      years: 1800000,
      insurance: 1100000,
      extra: 700000,
      advance: -1500000,
      penalty: 0,
      delivery: 9800000,
      commission: 2450000,
      final: 14950000
    },
    loans: [],
    penalties: [],
    routes: [
      { name: 'منطقه ۱', count: 55 },
      { name: 'منطقه ۳', count: 48 }
    ],
    history: []
  }
};

// ===== Helpers =====
function formatNumber(num) {
  return new Intl.NumberFormat('fa-IR').format(Math.abs(num));
}

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// ===== Load Driver =====
function loadDriver() {
  const id = getQueryParam('id') || '1';
  const driver = driversData[id] || driversData[1];

  // Header
  document.getElementById('driverName').textContent = driver.name;
  document.getElementById('pageTitle').textContent = driver.name;
  document.getElementById('driverAvatar').textContent = driver.name.charAt(0);
  document.getElementById('driverPlate').textContent = driver.plate;
  document.getElementById('driverPhone').textContent = driver.phone;
  
  const statusEl = document.getElementById('driverStatus');
  statusEl.textContent = driver.status === 'active' ? 'فعال' : 'غیرفعال';
  statusEl.className = `status-badge ${driver.status}`;

  // Stats
  document.getElementById('statDeliveries').textContent = formatNumber(driver.deliveries);
  document.getElementById('statDistance').textContent = formatNumber(driver.distance);
  document.getElementById('statCustomers').textContent = formatNumber(driver.customers);
  document.getElementById('statScore').textContent = driver.score;

  // Salary
  const s = driver.salary;
  document.getElementById('salFood').textContent = formatNumber(s.food);
  document.getElementById('salYears').textContent = formatNumber(s.years);
  document.getElementById('salInsurance').textContent = formatNumber(s.insurance);
  document.getElementById('salExtra').textContent = formatNumber(s.extra);
  document.getElementById('salAdvance').textContent = (s.advance < 0 ? '-' : '') + formatNumber(s.advance);
  document.getElementById('salPenalty').textContent = (s.penalty < 0 ? '-' : '') + formatNumber(s.penalty);
  document.getElementById('salDelivery').textContent = formatNumber(s.delivery);
  document.getElementById('salCommission').textContent = formatNumber(s.commission);
  document.getElementById('salFinal').textContent = formatNumber(s.final) + ' تومان';

  // Loans
  const loansList = document.getElementById('loansList');
  if (driver.loans.length === 0) {
    loansList.innerHTML = `<div class="table-empty"><i class="bi bi-inbox"></i><p>وام فعالی وجود ندارد</p></div>`;
  } else {
    loansList.innerHTML = driver.loans.map(loan => `
      <div class="loan-item">
        <div class="loan-info">
          <h4>${loan.title}</h4>
          <p>باقیمانده: ${formatNumber(loan.remain)} تومان | قسط بعدی: ${loan.nextDate}</p>
        </div>
        <div>
          <span class="badge badge-warning">${formatNumber(loan.installment)} تومان</span>
        </div>
      </div>
    `).join('');
  }

  // Penalties
  const penaltiesBody = document.getElementById('penaltiesBody');
  if (driver.penalties.length === 0) {
    penaltiesBody.innerHTML = `<tr><td colspan="5" class="table-empty">جریمه‌ای ثبت نشده</td></tr>`;
  } else {
    penaltiesBody.innerHTML = driver.penalties.map(p => `
      <tr>
        <td>${p.date}</td>
        <td>${p.type}</td>
        <td class="text-danger">${formatNumber(p.amount)} تومان</td>
        <td>${p.desc}</td>
        <td><span class="badge badge-danger">${p.status}</span></td>
      </tr>
    `).join('');
  }

  // Routes
  const routesGrid = document.getElementById('routesGrid');
  routesGrid.innerHTML = driver.routes.map(r => `
    <div class="route-card">
      <div class="route-name">${r.name}</div>
      <div class="route-count">${formatNumber(r.count)} پخش</div>
    </div>
  `).join('');

  // History
  const historyBody = document.getElementById('historyBody');
  if (driver.history.length === 0) {
    historyBody.innerHTML = `<tr><td colspan="6" class="table-empty">سابقه‌ای یافت نشد</td></tr>`;
  } else {
    historyBody.innerHTML = driver.history.map(h => `
      <tr>
        <td>${h.date}</td>
        <td>${h.route}</td>
        <td>${formatNumber(h.customers)}</td>
        <td>${formatNumber(h.items)}</td>
        <td>${h.distance} km</td>
        <td><span class="badge badge-success">${h.status}</span></td>
      </tr>
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
  const ctx = document.getElementById('performanceChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور'],
      datasets: [{
        label: 'تعداد پخش',
        data: [28, 32, 29, 35, 41, 29],
        backgroundColor: 'rgba(225, 29, 72, 0.8)',
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.04)' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  loadDriver();
});