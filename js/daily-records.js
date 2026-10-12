// ===== Sample Data =====
let records = [
  {
    id: 1,
    date: '2026-09-22',
    route: 'منطقه ۲',
    driver: 'علی محمدی',
    vehicle: '۱۲۳ ب ۴۵ - پراید',
    customers: 18,
    items: 145,
    distance: 42.5,
    food: 150000,
    expenseType: 'سوخت',
    expenseAmount: 850000,
    expenseReceiver: 'پمپ بنزین آزادی',
    partUsed: '',
    years: 2400000,
    advance: 0,
    extra: 50000,
    penalty: 0,
    payment: 0,
    description: 'پخش کامل انجام شد'
  },
  {
    id: 2,
    date: '2026-09-22',
    route: 'منطقه ۵',
    driver: 'رضا کریمی',
    vehicle: '۷۸۹ الف ۱۲ - پژو',
    customers: 12,
    items: 98,
    distance: 31.0,
    food: 120000,
    expenseType: 'سوخت',
    expenseAmount: 620000,
    expenseReceiver: 'پمپ بنزین مرکزی',
    partUsed: '',
    years: 1800000,
    advance: 200000,
    extra: 0,
    penalty: 0,
    payment: 0,
    description: ''
  },
  {
    id: 3,
    date: '2026-09-21',
    route: 'منطقه ۱',
    driver: 'حسین رضایی',
    vehicle: '۴۵۶ ج ۷۸ - وانت',
    customers: 25,
    items: 210,
    distance: 58.3,
    food: 180000,
    expenseType: 'تعمیرات',
    expenseAmount: 450000,
    expenseReceiver: 'تعمیرگاه برادران',
    partUsed: 'لنت ترمز',
    years: 1200000,
    advance: 0,
    extra: 0,
    penalty: 100000,
    payment: 0,
    description: 'تعویض لنت جلو'
  },
  {
    id: 4,
    date: '2026-09-21',
    route: 'حومه',
    driver: 'محمد احمدی',
    vehicle: '۳۲۱ د ۹۰ - نیسان',
    customers: 9,
    items: 76,
    distance: 67.0,
    food: 200000,
    expenseType: 'سوخت',
    expenseAmount: 1100000,
    expenseReceiver: 'پمپ بنزین جاده',
    partUsed: '',
    years: 900000,
    advance: 0,
    extra: 0,
    penalty: 0,
    payment: 300000,
    description: 'مسیر طولانی'
  },
  {
    id: 5,
    date: '2026-09-20',
    route: 'منطقه ۳',
    driver: 'سعید نوری',
    vehicle: '۱۲۳ ب ۴۵ - پراید',
    customers: 15,
    items: 120,
    distance: 38.5,
    food: 140000,
    expenseType: '',
    expenseAmount: 0,
    expenseReceiver: '',
    partUsed: '',
    years: 2000000,
    advance: 0,
    extra: 0,
    penalty: 0,
    payment: 0,
    description: 'بدون هزینه اضافی'
  }
];

let currentPage = 1;
const rowsPerPage = 8;
let filteredRecords = [...records];
let editingId = null;

// ===== DOM =====
const form = document.getElementById('dailyForm');
const recordsBody = document.getElementById('recordsBody');
const searchInput = document.getElementById('searchInput');
const filterFromDate = document.getElementById('filterFromDate');
const filterToDate = document.getElementById('filterToDate');
const filterDriver = document.getElementById('filterDriver');
const filterVehicle = document.getElementById('filterVehicle');
const filterRoute = document.getElementById('filterRoute');
const clearFiltersBtn = document.getElementById('clearFilters');
const resetFormBtn = document.getElementById('resetForm');
const tableInfo = document.getElementById('tableInfo');
const pagination = document.getElementById('pagination');
const formTitle = document.getElementById('formTitle');
const submitText = document.getElementById('submitText');

// ===== Helpers =====
function formatNumber(num) {
  return new Intl.NumberFormat('fa-IR').format(num || 0);
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('fa-IR').format(date);
}

function getFormData() {
  return {
    date: document.getElementById('date').value,
    route: document.getElementById('route').value,
    driver: document.getElementById('driver').value,
    vehicle: document.getElementById('vehicle').value,
    customers: Number(document.getElementById('customers').value) || 0,
    items: Number(document.getElementById('items').value) || 0,
    distance: Number(document.getElementById('distance').value) || 0,
    food: Number(document.getElementById('food').value) || 0,
    expenseType: document.getElementById('expenseType').value,
    expenseAmount: Number(document.getElementById('expenseAmount').value) || 0,
    expenseReceiver: document.getElementById('expenseReceiver').value.trim(),
    partUsed: document.getElementById('partUsed').value.trim(),
    years: Number(document.getElementById('years').value) || 0,
    advance: Number(document.getElementById('advance').value) || 0,
    extra: Number(document.getElementById('extra').value) || 0,
    penalty: Number(document.getElementById('penalty').value) || 0,
    payment: Number(document.getElementById('payment').value) || 0,
    description: document.getElementById('description').value.trim()
  };
}

function fillForm(record) {
  document.getElementById('date').value = record.date || '';
  document.getElementById('route').value = record.route || '';
  document.getElementById('driver').value = record.driver || '';
  document.getElementById('vehicle').value = record.vehicle || '';
  document.getElementById('customers').value = record.customers ?? '';
  document.getElementById('items').value = record.items ?? '';
  document.getElementById('distance').value = record.distance ?? '';
  document.getElementById('food').value = record.food || '';
  document.getElementById('expenseType').value = record.expenseType || '';
  document.getElementById('expenseAmount').value = record.expenseAmount || '';
  document.getElementById('expenseReceiver').value = record.expenseReceiver || '';
  document.getElementById('partUsed').value = record.partUsed || '';
  document.getElementById('years').value = record.years || '';
  document.getElementById('advance').value = record.advance || '';
  document.getElementById('extra').value = record.extra || '';
  document.getElementById('penalty').value = record.penalty || '';
  document.getElementById('payment').value = record.payment || '';
  document.getElementById('description').value = record.description || '';
}

function resetFormState() {
  form.reset();
  editingId = null;
  if (formTitle) formTitle.textContent = 'ثبت عملیات جدید';
  if (submitText) submitText.textContent = 'ثبت عملیات';
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('date').value = today;
}

// ===== Render Table =====
function renderTable() {
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = filteredRecords.slice(start, end);

  recordsBody.innerHTML = '';

  if (pageData.length === 0) {
    recordsBody.innerHTML = `
      <tr>
        <td colspan="11">
          <div class="table-empty">
            <i class="bi bi-inbox"></i>
            <p>هیچ رکوردی یافت نشد</p>
          </div>
        </td>
      </tr>
    `;
  } else {
    pageData.forEach((record, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${formatNumber(start + index + 1)}</td>
        <td>${formatDate(record.date)}</td>
        <td>${record.route}</td>
        <td>${record.driver}</td>
        <td>${record.vehicle}</td>
        <td>${formatNumber(record.customers)}</td>
        <td>${formatNumber(record.items)}</td>
        <td>${formatNumber(record.distance)} km</td>
        <td>${record.years ? formatNumber(record.years) : '-'}</td>
        <td>${record.expenseAmount ? formatNumber(record.expenseAmount) : '-'}</td>
        <td>
          <div class="table-actions">
            <button class="btn-icon view" title="مشاهده" onclick="viewRecord(${record.id})">
              <i class="bi bi-eye"></i>
            </button>
            <button class="btn-icon edit" title="ویرایش" onclick="editRecord(${record.id})">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn-icon delete" title="حذف" onclick="deleteRecord(${record.id})">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      `;
      recordsBody.appendChild(row);
    });
  }

  const total = filteredRecords.length;
  const showingStart = total === 0 ? 0 : start + 1;
  const showingEnd = Math.min(end, total);
  tableInfo.textContent = `نمایش ${formatNumber(showingStart)} تا ${formatNumber(showingEnd)} از ${formatNumber(total)} رکورد`;

  renderPagination();
}

// ===== Pagination =====
function renderPagination() {
  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage) || 1;
  pagination.innerHTML = '';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'page-btn';
  prevBtn.innerHTML = '<i class="bi bi-chevron-right"></i>';
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  };
  pagination.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    if (totalPages > 7 && Math.abs(i - currentPage) > 2 && i !== 1 && i !== totalPages) {
      if (i === 2 || i === totalPages - 1) {
        const dots = document.createElement('span');
        dots.textContent = '...';
        dots.style.padding = '0 6px';
        dots.style.color = 'var(--text-muted)';
        pagination.appendChild(dots);
      }
      continue;
    }

    const btn = document.createElement('button');
    btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
    btn.textContent = formatNumber(i);
    btn.onclick = () => {
      currentPage = i;
      renderTable();
    };
    pagination.appendChild(btn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.className = 'page-btn';
  nextBtn.innerHTML = '<i class="bi bi-chevron-left"></i>';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
    }
  };
  pagination.appendChild(nextBtn);
}

// ===== Filter =====
function applyFilters() {
  const search = searchInput.value.trim().toLowerCase();
  const fromDate = filterFromDate.value;
  const toDate = filterToDate.value;
  const driver = filterDriver.value;
  const vehicle = filterVehicle.value;
  const route = filterRoute.value;

  filteredRecords = records.filter(record => {
    const matchSearch = !search ||
      Object.values(record).some(val => String(val).toLowerCase().includes(search));
    const matchFrom = !fromDate || record.date >= fromDate;
    const matchTo = !toDate || record.date <= toDate;
    const matchDriver = !driver || record.driver === driver;
    const matchVehicle = !vehicle || record.vehicle === vehicle;
    const matchRoute = !route || record.route === route;
    return matchSearch && matchFrom && matchTo && matchDriver && matchVehicle && matchRoute;
  });

  currentPage = 1;
  renderTable();
}

// ===== Submit =====
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = getFormData();

  if (editingId) {
    const index = records.findIndex(r => r.id === editingId);
    if (index > -1) {
      records[index] = { ...records[index], ...data };
    }
    alert('رکورد با موفقیت ویرایش شد');
  } else {
    records.unshift({ id: Date.now(), ...data });
    alert('عملیات با موفقیت ثبت شد');
  }

  resetFormState();
  applyFilters();
});

// ===== Reset =====
resetFormBtn.addEventListener('click', () => {
  resetFormState();
});

// ===== Clear Filters =====
clearFiltersBtn.addEventListener('click', () => {
  searchInput.value = '';
  filterFromDate.value = '';
  filterToDate.value = '';
  filterDriver.value = '';
  filterVehicle.value = '';
  filterRoute.value = '';
  applyFilters();
});

// ===== Filter Events =====
searchInput.addEventListener('input', applyFilters);
filterFromDate.addEventListener('change', applyFilters);
filterToDate.addEventListener('change', applyFilters);
filterDriver.addEventListener('change', applyFilters);
filterVehicle.addEventListener('change', applyFilters);
filterRoute.addEventListener('change', applyFilters);

// ===== Actions =====
function viewRecord(id) {
  const r = records.find(x => x.id === id);
  if (!r) return;

  alert(
    `مشاهده رکورد\n` +
    `────────────────\n` +
    `تاریخ: ${formatDate(r.date)}\n` +
    `مسیر: ${r.route}\n` +
    `راننده: ${r.driver}\n` +
    `خودرو: ${r.vehicle}\n` +
    `مشتری: ${formatNumber(r.customers)}\n` +
    `کالا: ${formatNumber(r.items)}\n` +
    `مسافت: ${formatNumber(r.distance)} km\n` +
    `تغذیه: ${formatNumber(r.food)}\n` +
    `سنوات: ${formatNumber(r.years)}\n` +
    `هزینه: ${formatNumber(r.expenseAmount)} (${r.expenseType || '-'})\n` +
    `مساعده: ${formatNumber(r.advance)}\n` +
    `اضافات: ${formatNumber(r.extra)}\n` +
    `جریمه: ${formatNumber(r.penalty)}\n` +
    `پرداختی: ${formatNumber(r.payment)}\n` +
    `توضیحات: ${r.description || '-'}`
  );
}

function editRecord(id) {
  const record = records.find(r => r.id === id);
  if (!record) return;

  editingId = id;
  fillForm(record);

  if (formTitle) formTitle.textContent = 'ویرایش عملیات';
  if (submitText) submitText.textContent = 'ذخیره تغییرات';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteRecord(id) {
  if (!confirm('آیا از حذف این رکورد مطمئن هستید؟')) return;
  records = records.filter(r => r.id !== id);
  if (editingId === id) resetFormState();
  applyFilters();
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  resetFormState();
  renderTable();
});