// ===== Sample Data =====
const reportRecords = [
  { date: '1405/06/20', route: 'منطقه ۲', driver: 'ابوذر دهقان اناری', vehicle: '۶۵ ایران ۴۶۳ ع ۹۶', customers: 18, items: 145, distance: 42, cost: 850000 },
  { date: '1405/06/19', route: 'منطقه ۵', driver: 'علی محمدی', vehicle: '۱۲۳ ب ۴۵', customers: 14, items: 112, distance: 38, cost: 620000 },
  { date: '1405/06/18', route: 'حومه', driver: 'رضا کریمی', vehicle: '۷۸۹ الف ۱۲', customers: 9, items: 76, distance: 61, cost: 1100000 },
  { date: '1405/06/17', route: 'منطقه ۱', driver: 'حسین رضایی', vehicle: '۴۵۶ ج ۷۸', customers: 21, items: 168, distance: 45, cost: 480000 },
  { date: '1405/06/16', route: 'منطقه ۳', driver: 'سعید نوری', vehicle: '۱۲۳ ب ۴۵', customers: 16, items: 130, distance: 40, cost: 700000 },
  { date: '1405/06/15', route: 'منطقه ۲', driver: 'ابوذر دهقان اناری', vehicle: '۶۵ ایران ۴۶۳ ع ۹۶', customers: 20, items: 155, distance: 48, cost: 920000 },
  { date: '1405/05/28', route: 'منطقه ۴', driver: 'علی محمدی', vehicle: '۱۲۳ ب ۴۵', customers: 11, items: 90, distance: 33, cost: 550000 },
  { date: '1405/05/25', route: 'حومه', driver: 'رضا کریمی', vehicle: '۷۸۹ الف ۱۲', customers: 8, items: 70, distance: 55, cost: 980000 }
];

const driverStats = [
  { name: 'ابوذر دهقان اناری', deliveries: 194, distance: 81407, customers: 4386, score: 4.8 },
  { name: 'علی محمدی', deliveries: 156, distance: 62340, customers: 3120, score: 4.6 },
  { name: 'رضا کریمی', deliveries: 132, distance: 58920, customers: 2875, score: 4.5 },
  { name: 'حسین رضایی', deliveries: 98, distance: 41250, customers: 1980, score: 4.4 },
  { name: 'سعید نوری', deliveries: 145, distance: 67890, customers: 3450, score: 4.7 }
];

const vehicleStats = [
  { plate: '۶۵ ایران ۴۶۳ ع ۹۶', type: 'نیسان', distance: 90000, repairs: 3, insurance: 'معتبر' },
  { plate: '۱۲۳ ب ۴۵', type: 'پراید', distance: 81407, repairs: 2, insurance: 'نزدیک سررسید' },
  { plate: '۷۸۹ الف ۱۲', type: 'پژو', distance: 62340, repairs: 1, insurance: 'معتبر' },
  { plate: '۴۵۶ ج ۷۸', type: 'وانت', distance: 58920, repairs: 4, insurance: 'منقضی' }
];

const repairStats = [
  { date: '1405/05/01', vehicle: '۶۵ ایران ۴۶۳ ع ۹۶', mechanic: 'جعفر جعفری', part: 'بلبرینگ', cost: 8300000 },
  { date: '1405/06/01', vehicle: '۱۲۳ ب ۴۵', mechanic: 'علی رضایی', part: 'لنت ترمز', cost: 1250000 },
  { date: '1405/04/20', vehicle: '۷۸۹ الف ۱۲', mechanic: 'جعفر جعفری', part: 'دینام', cost: 18500000 }
];

const financeStats = [
  { type: 'تعمیرات', amount: 28050000 },
  { type: 'بیمه', amount: 11000000 },
  { type: 'سوخت', amount: 18700000 },
  { type: 'وام', amount: 15000000 },
  { type: 'سایر', amount: 13750000 }
];

const payrollStats = [
  { driver: 'ابوذر دهقان اناری', deliveryPay: 12500000, commission: 3200000, finalPay: 18650000 },
  { driver: 'علی محمدی', deliveryPay: 9800000, commission: 2450000, finalPay: 14950000 },
  { driver: 'سعید نوری', deliveryPay: 11000000, commission: 2800000, finalPay: 18300000 }
];

const loanStats = [
  { driver: 'ابوذر دهقان اناری', type: 'شرکتی', principal: 450000000, remaining: 280000000 },
  { driver: 'ابوذر دهقان اناری', type: 'شخصی', principal: 50000000, remaining: 18000000 },
  { driver: 'رضا کریمی', type: 'شرکتی', principal: 280000000, remaining: 185000000 }
];

const returnStats = [
  { date: '1405/06/20', route: 'منطقه ۲', items: 12, cost: 1850000, desc: 'خرابی بسته‌بندی' },
  { date: '1405/06/18', route: 'منطقه ۵', items: 5, cost: 720000, desc: 'اشتباه سفارش' },
  { date: '1405/06/15', route: 'حومه', items: 8, cost: 1450000, desc: 'تاریخ انقضا' }
];

// ===== State =====
let currentReportType = null;
let chartInstance = null;

// ===== Helpers =====
function formatNumber(num) {
  return new Intl.NumberFormat('fa-IR').format(num || 0);
}

function getFilterValues() {
  return {
    year: document.getElementById('filterYear').value,
    month: document.getElementById('filterMonth').value,
    driver: document.getElementById('filterDriver').value,
    vehicle: document.getElementById('filterVehicle').value,
    route: document.getElementById('filterRoute').value
  };
}

function getMonthName(val) {
  const months = {
    '01': 'فروردین', '02': 'اردیبهشت', '03': 'خرداد',
    '04': 'تیر', '05': 'مرداد', '06': 'شهریور',
    '07': 'مهر', '08': 'آبان', '09': 'آذر',
    '10': 'دی', '11': 'بهمن', '12': 'اسفند'
  };
  return months[val] || 'همه ماه‌ها';
}

function filterDailyRecords() {
  const f = getFilterValues();
  return reportRecords.filter(r => {
    const [y, m] = r.date.split('/');
    const matchYear = !f.year || y === f.year;
    const matchMonth = !f.month || m === f.month;
    const matchDriver = !f.driver || r.driver === f.driver;
    const matchVehicle = !f.vehicle || r.vehicle === f.vehicle;
    const matchRoute = !f.route || r.route === f.route;
    return matchYear && matchMonth && matchDriver && matchVehicle && matchRoute;
  });
}

function destroyChart() {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
}

// ===== Generate Report =====
function generateReport(type) {
  currentReportType = type;
  const filters = getFilterValues();
  const resultBox = document.getElementById('reportResult');
  const resultTitle = document.getElementById('resultTitle');
  const resultBody = document.getElementById('resultBody');

  const titles = {
    daily: 'گزارش روزانه',
    drivers: 'گزارش رانندگان',
    vehicles: 'گزارش خودروها',
    repairs: 'گزارش تعمیرات',
    finance: 'گزارش مالی',
    payroll: 'گزارش حقوق',
    loans: 'گزارش وام',
    returns: 'گزارش برگشتی'
  };

  resultTitle.textContent = titles[type] || 'گزارش';
  destroyChart();

  let html = `
    <div class="result-summary">
      <div class="result-stat"><span class="val">${filters.year}</span><span class="lbl">سال</span></div>
      <div class="result-stat"><span class="val">${getMonthName(filters.month)}</span><span class="lbl">ماه</span></div>
      <div class="result-stat"><span class="val">${filters.driver || 'همه'}</span><span class="lbl">راننده</span></div>
      <div class="result-stat"><span class="val">${filters.vehicle || 'همه'}</span><span class="lbl">خودرو</span></div>
      <div class="result-stat"><span class="val">${filters.route || 'همه'}</span><span class="lbl">مسیر</span></div>
    </div>
  `;

  // ----- روزانه -----
  if (type === 'daily') {
    const data = filterDailyRecords();
    const totalCustomers = data.reduce((s, r) => s + r.customers, 0);
    const totalItems = data.reduce((s, r) => s + r.items, 0);
    const totalDistance = data.reduce((s, r) => s + r.distance, 0);

    html += `
      <div class="result-summary">
        <div class="result-stat"><span class="val">${formatNumber(data.length)}</span><span class="lbl">تعداد روز/رکورد</span></div>
        <div class="result-stat"><span class="val">${formatNumber(totalCustomers)}</span><span class="lbl">جمع مشتری</span></div>
        <div class="result-stat"><span class="val">${formatNumber(totalItems)}</span><span class="lbl">جمع کالا</span></div>
        <div class="result-stat"><span class="val">${formatNumber(totalDistance)} km</span><span class="lbl">جمع مسافت</span></div>
      </div>
      <div style="height:260px;margin-bottom:24px;"><canvas id="reportChart"></canvas></div>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr><th>تاریخ</th><th>مسیر</th><th>راننده</th><th>خودرو</th><th>مشتری</th><th>کالا</th><th>مسافت</th></tr>
          </thead>
          <tbody>
            ${data.length ? data.map(r => `
              <tr>
                <td>${r.date}</td>
                <td>${r.route}</td>
                <td>${r.driver}</td>
                <td>${r.vehicle}</td>
                <td>${formatNumber(r.customers)}</td>
                <td>${formatNumber(r.items)}</td>
                <td>${formatNumber(r.distance)} km</td>
              </tr>
            `).join('') : '<tr><td colspan="7"><div class="table-empty">با این فیلتر داده‌ای نیست</div></td></tr>'}
          </tbody>
        </table>
      </div>
    `;
    resultBody.innerHTML = html;

    if (data.length && typeof Chart !== 'undefined') {
      const ctx = document.getElementById('reportChart').getContext('2d');
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map(r => r.date.slice(5)),
          datasets: [{
            label: 'تعداد مشتری',
            data: data.map(r => r.customers),
            backgroundColor: 'rgba(225, 29, 72, 0.75)',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
        }
      });
    }
  }

  // ----- رانندگان -----
  else if (type === 'drivers') {
    let data = [...driverStats];
    if (filters.driver) data = data.filter(d => d.name === filters.driver);

    html += `
      <div class="result-summary">
        <div class="result-stat"><span class="val">${formatNumber(data.length)}</span><span class="lbl">تعداد راننده</span></div>
        <div class="result-stat"><span class="val">${formatNumber(data.reduce((s, d) => s + d.deliveries, 0))}</span><span class="lbl">جمع پخش</span></div>
        <div class="result-stat"><span class="val">${formatNumber(data.reduce((s, d) => s + d.distance, 0))} km</span><span class="lbl">جمع مسافت</span></div>
      </div>
      <div style="height:260px;margin-bottom:24px;"><canvas id="reportChart"></canvas></div>
      <div class="table-responsive">
        <table class="table">
          <thead><tr><th>راننده</th><th>پخش</th><th>مسافت</th><th>مشتری</th><th>امتیاز</th></tr></thead>
          <tbody>
            ${data.map(d => `
              <tr>
                <td>${d.name}</td>
                <td>${formatNumber(d.deliveries)}</td>
                <td>${formatNumber(d.distance)}</td>
                <td>${formatNumber(d.customers)}</td>
                <td>${d.score}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    resultBody.innerHTML = html;

    if (typeof Chart !== 'undefined') {
      const ctx = document.getElementById('reportChart').getContext('2d');
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map(d => d.name.split(' ')[0]),
          datasets: [{
            label: 'تعداد پخش',
            data: data.map(d => d.deliveries),
            backgroundColor: 'rgba(16, 185, 129, 0.75)',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
        }
      });
    }
  }

  // ----- خودروها -----
  else if (type === 'vehicles') {
    let data = [...vehicleStats];
    if (filters.vehicle) data = data.filter(v => v.plate === filters.vehicle);

    html += `
      <div class="table-responsive">
        <table class="table">
          <thead><tr><th>پلاک</th><th>نوع</th><th>مسافت</th><th>تعداد تعمیر</th><th>بیمه</th></tr></thead>
          <tbody>
            ${data.map(v => `
              <tr>
                <td>${v.plate}</td>
                <td>${v.type}</td>
                <td>${formatNumber(v.distance)} km</td>
                <td>${formatNumber(v.repairs)}</td>
                <td>${v.insurance}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    resultBody.innerHTML = html;
  }

  // ----- تعمیرات -----
  else if (type === 'repairs') {
    let data = [...repairStats];
    if (filters.vehicle) data = data.filter(r => r.vehicle === filters.vehicle);
    const totalCost = data.reduce((s, r) => s + r.cost, 0);

    html += `
      <div class="result-summary">
        <div class="result-stat"><span class="val">${formatNumber(data.length)}</span><span class="lbl">تعداد تعمیر</span></div>
        <div class="result-stat"><span class="val">${formatNumber(totalCost)}</span><span class="lbl">جمع هزینه</span></div>
      </div>
      <div class="table-responsive">
        <table class="table">
          <thead><tr><th>تاریخ</th><th>خودرو</th><th>تعمیرکار</th><th>قطعه</th><th>هزینه</th></tr></thead>
          <tbody>
            ${data.map(r => `
              <tr>
                <td>${r.date}</td>
                <td>${r.vehicle}</td>
                <td>${r.mechanic}</td>
                <td>${r.part}</td>
                <td>${formatNumber(r.cost)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    resultBody.innerHTML = html;
  }

  // ----- مالی -----
  else if (type === 'finance') {
    const total = financeStats.reduce((s, f) => s + f.amount, 0);

    html += `
      <div class="result-summary">
        <div class="result-stat"><span class="val">${formatNumber(total)}</span><span class="lbl">کل هزینه</span></div>
      </div>
      <div style="height:280px;margin-bottom:24px;"><canvas id="reportChart"></canvas></div>
      <div class="table-responsive">
        <table class="table">
          <thead><tr><th>نوع هزینه</th><th>مبلغ (تومان)</th><th>درصد</th></tr></thead>
          <tbody>
            ${financeStats.map(f => `
              <tr>
                <td>${f.type}</td>
                <td>${formatNumber(f.amount)}</td>
                <td>${((f.amount / total) * 100).toFixed(1)}٪</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    resultBody.innerHTML = html;

    if (typeof Chart !== 'undefined') {
      const ctx = document.getElementById('reportChart').getContext('2d');
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: financeStats.map(f => f.type),
          datasets: [{
            data: financeStats.map(f => f.amount),
            backgroundColor: ['#e11d48', '#fb7185', '#f59e0b', '#3b82f6', '#94a3b8'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } },
          cutout: '65%'
        }
      });
    }
  }

  // ----- حقوق -----
  else if (type === 'payroll') {
    let data = [...payrollStats];
    if (filters.driver) data = data.filter(p => p.driver === filters.driver);
    const totalFinal = data.reduce((s, p) => s + p.finalPay, 0);

    html += `
      <div class="result-summary">
        <div class="result-stat"><span class="val">${formatNumber(data.length)}</span><span class="lbl">تعداد راننده</span></div>
        <div class="result-stat"><span class="val">${formatNumber(totalFinal)}</span><span class="lbl">جمع پرداخت نهایی</span></div>
      </div>
      <div class="table-responsive">
        <table class="table">
          <thead><tr><th>راننده</th><th>حق پخش</th><th>پورسانت</th><th>پرداخت نهایی</th></tr></thead>
          <tbody>
            ${data.map(p => `
              <tr>
                <td>${p.driver}</td>
                <td>${formatNumber(p.deliveryPay)}</td>
                <td>${formatNumber(p.commission)}</td>
                <td><strong>${formatNumber(p.finalPay)}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    resultBody.innerHTML = html;
  }

  // ----- وام -----
  else if (type === 'loans') {
    let data = [...loanStats];
    if (filters.driver) data = data.filter(l => l.driver === filters.driver);
    const totalRemain = data.reduce((s, l) => s + l.remaining, 0);

    html += `
      <div class="result-summary">
        <div class="result-stat"><span class="val">${formatNumber(data.length)}</span><span class="lbl">تعداد وام</span></div>
        <div class="result-stat"><span class="val">${formatNumber(totalRemain)}</span><span class="lbl">مانده کل</span></div>
      </div>
      <div class="table-responsive">
        <table class="table">
          <thead><tr><th>راننده</th><th>نوع</th><th>اصل وام</th><th>مانده</th></tr></thead>
          <tbody>
            ${data.map(l => `
              <tr>
                <td>${l.driver}</td>
                <td>${l.type}</td>
                <td>${formatNumber(l.principal)}</td>
                <td>${formatNumber(l.remaining)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    resultBody.innerHTML = html;
  }

  // ----- برگشتی -----
  else if (type === 'returns') {
    let data = [...returnStats];
    if (filters.route) data = data.filter(r => r.route === filters.route);
    const totalItems = data.reduce((s, r) => s + r.items, 0);
    const totalCost = data.reduce((s, r) => s + r.cost, 0);

    html += `
      <div class="result-summary">
        <div class="result-stat"><span class="val">${formatNumber(data.length)}</span><span class="lbl">تعداد برگشتی</span></div>
        <div class="result-stat"><span class="val">${formatNumber(totalItems)}</span><span class="lbl">تعداد کالا</span></div>
        <div class="result-stat"><span class="val">${formatNumber(totalCost)}</span><span class="lbl">جمع هزینه</span></div>
      </div>
      <div class="table-responsive">
        <table class="table">
          <thead><tr><th>تاریخ</th><th>مسیر</th><th>تعداد کالا</th><th>هزینه</th><th>توضیحات</th></tr></thead>
          <tbody>
            ${data.map(r => `
              <tr>
                <td>${r.date}</td>
                <td>${r.route}</td>
                <td>${formatNumber(r.items)}</td>
                <td>${formatNumber(r.cost)}</td>
                <td>${r.desc}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    resultBody.innerHTML = html;
  }

  resultBox.style.display = 'block';
  resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== Excel Export =====
function exportToExcel() {
  if (typeof XLSX === 'undefined') {
    alert('کتابخانه Excel لود نشده. لطفاً صفحه را رفرش کنید.');
    return;
  }

  if (!currentReportType) {
    alert('ابتدا یک گزارش را باز کنید.');
    return;
  }

  const filters = getFilterValues();
  let rows = [];
  let sheetName = 'گزارش';
  let fileName = 'report';

  if (currentReportType === 'daily') {
    const data = filterDailyRecords();
    sheetName = 'گزارش روزانه';
    fileName = 'daily-report';
    rows = [['تاریخ', 'مسیر', 'راننده', 'خودرو', 'تعداد مشتری', 'تعداد کالا', 'مسافت (km)']];
    data.forEach(r => {
      rows.push([r.date, r.route, r.driver, r.vehicle, r.customers, r.items, r.distance]);
    });
  }
  else if (currentReportType === 'drivers') {
    let data = [...driverStats];
    if (filters.driver) data = data.filter(d => d.name === filters.driver);
    sheetName = 'گزارش رانندگان';
    fileName = 'drivers-report';
    rows = [['راننده', 'تعداد پخش', 'مسافت', 'تعداد مشتری', 'امتیاز']];
    data.forEach(d => {
      rows.push([d.name, d.deliveries, d.distance, d.customers, d.score]);
    });
  }
  else if (currentReportType === 'vehicles') {
    let data = [...vehicleStats];
    if (filters.vehicle) data = data.filter(v => v.plate === filters.vehicle);
    sheetName = 'گزارش خودروها';
    fileName = 'vehicles-report';
    rows = [['پلاک', 'نوع', 'مسافت', 'تعداد تعمیر', 'وضعیت بیمه']];
    data.forEach(v => {
      rows.push([v.plate, v.type, v.distance, v.repairs, v.insurance]);
    });
  }
  else if (currentReportType === 'repairs') {
    let data = [...repairStats];
    if (filters.vehicle) data = data.filter(r => r.vehicle === filters.vehicle);
    sheetName = 'گزارش تعمیرات';
    fileName = 'repairs-report';
    rows = [['تاریخ', 'خودرو', 'تعمیرکار', 'قطعه', 'هزینه']];
    data.forEach(r => {
      rows.push([r.date, r.vehicle, r.mechanic, r.part, r.cost]);
    });
  }
  else if (currentReportType === 'finance') {
    const total = financeStats.reduce((s, f) => s + f.amount, 0);
    sheetName = 'گزارش مالی';
    fileName = 'finance-report';
    rows = [['نوع هزینه', 'مبلغ (تومان)', 'درصد']];
    financeStats.forEach(f => {
      rows.push([f.type, f.amount, Number(((f.amount / total) * 100).toFixed(1))]);
    });
    rows.push([]);
    rows.push(['جمع کل', total, 100]);
  }
  else if (currentReportType === 'payroll') {
    let data = [...payrollStats];
    if (filters.driver) data = data.filter(p => p.driver === filters.driver);
    sheetName = 'گزارش حقوق';
    fileName = 'payroll-report';
    rows = [['راننده', 'حق پخش', 'پورسانت', 'پرداخت نهایی']];
    data.forEach(p => {
      rows.push([p.driver, p.deliveryPay, p.commission, p.finalPay]);
    });
  }
  else if (currentReportType === 'loans') {
    let data = [...loanStats];
    if (filters.driver) data = data.filter(l => l.driver === filters.driver);
    sheetName = 'گزارش وام';
    fileName = 'loans-report';
    rows = [['راننده', 'نوع وام', 'اصل وام', 'مانده']];
    data.forEach(l => {
      rows.push([l.driver, l.type, l.principal, l.remaining]);
    });
  }
  else if (currentReportType === 'returns') {
    let data = [...returnStats];
    if (filters.route) data = data.filter(r => r.route === filters.route);
    sheetName = 'گزارش برگشتی';
    fileName = 'returns-report';
    rows = [['تاریخ', 'مسیر', 'تعداد کالا', 'هزینه', 'توضیحات']];
    data.forEach(r => {
      rows.push([r.date, r.route, r.items, r.cost, r.desc]);
    });
  }

  if (rows.length <= 1) {
    alert('داده‌ای برای خروجی وجود ندارد.');
    return;
  }

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const colWidths = rows[0].map((_, colIndex) => {
    let max = 12;
    rows.forEach(row => {
      const val = row[colIndex] != null ? String(row[colIndex]) : '';
      if (val.length > max) max = val.length;
    });
    return { wch: Math.min(max + 2, 40) };
  });
  worksheet['!cols'] = colWidths;

  const now = new Date();
  const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const fullName = `${fileName}_${stamp}.xlsx`;

  XLSX.writeFile(workbook, fullName);
}

// ===== Events =====
document.getElementById('applyFilters').addEventListener('click', () => {
  if (currentReportType) {
    generateReport(currentReportType);
    const btn = document.getElementById('applyFilters');
    const oldText = btn.innerHTML;
    btn.innerHTML = '<i class="bi bi-check-lg"></i> اعمال شد';
    setTimeout(() => { btn.innerHTML = oldText; }, 1500);
  } else {
    alert('فیلترها ذخیره شدند.\nحالا یکی از کارت‌های گزارش را انتخاب کنید تا نتیجه با همین فیلتر نمایش داده شود.');
  }
});

document.getElementById('resetFilters').addEventListener('click', () => {
  document.getElementById('filterYear').value = '1405';
  document.getElementById('filterMonth').value = '06';
  document.getElementById('filterDriver').value = '';
  document.getElementById('filterVehicle').value = '';
  document.getElementById('filterRoute').value = '';

  if (currentReportType) {
    generateReport(currentReportType);
  }
});

document.getElementById('closeResult').addEventListener('click', () => {
  document.getElementById('reportResult').style.display = 'none';
  currentReportType = null;
  destroyChart();
});

document.getElementById('printReport').addEventListener('click', () => {
  window.print();
});

document.getElementById('exportReport').addEventListener('click', () => {
  exportToExcel();
});