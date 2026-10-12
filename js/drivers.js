// ===== Sample Data =====
const drivers = [
  {
    id: 1,
    name: 'ابوذر دهقان اناری',
    phone: '09121234567',
    plate: '۶۵ ایران ۴۶۳ ع ۹۶',
    deliveries: 194,
    distance: 81407,
    customers: 4386,
    status: 'active'
  },
  {
    id: 2,
    name: 'علی محمدی',
    phone: '09129876543',
    plate: '۱۲۳ ب ۴۵',
    deliveries: 156,
    distance: 62340,
    customers: 3120,
    status: 'active'
  },
  {
    id: 3,
    name: 'رضا کریمی',
    phone: '09123334444',
    plate: '۷۸۹ الف ۱۲',
    deliveries: 132,
    distance: 58920,
    customers: 2875,
    status: 'active'
  },
  {
    id: 4,
    name: 'حسین رضایی',
    phone: '09125556666',
    plate: '۴۵۶ ج ۷۸',
    deliveries: 98,
    distance: 41250,
    customers: 1980,
    status: 'inactive'
  },
  {
    id: 5,
    name: 'سعید نوری',
    phone: '09127778888',
    plate: '۳۲۱ د ۹۰',
    deliveries: 145,
    distance: 67890,
    customers: 3450,
    status: 'active'
  },
  {
    id: 6,
    name: 'محمد احمدی',
    phone: '09121112222',
    plate: '۱۴۷ ی ۵۶',
    deliveries: 87,
    distance: 35680,
    customers: 1650,
    status: 'active'
  },
  {
    id: 7,
    name: 'امیر حسینی',
    phone: '09124445555',
    plate: '۹۸۷ و ۳۴',
    deliveries: 110,
    distance: 29840,
    customers: 1420,
    status: 'active'
  },
  {
    id: 8,
    name: 'مهدی کاظمی',
    phone: '09126667777',
    plate: '۶۵۴ هـ ۲۱',
    deliveries: 72,
    distance: 22100,
    customers: 980,
    status: 'inactive'
  }
];

let editingId = null;
let filteredDrivers = [...drivers];

// ===== DOM =====
const driversGrid = document.getElementById('driversGrid');
const searchInput = document.getElementById('searchDriver');
const filterStatus = document.getElementById('filterStatus');
const addDriverBtn = document.getElementById('addDriverBtn');

const driverModal = document.getElementById('driverModal');
const closeDriverModal = document.getElementById('closeDriverModal');
const cancelDriverModal = document.getElementById('cancelDriverModal');
const driverForm = document.getElementById('driverForm');
const driverModalTitle = document.getElementById('driverModalTitle');

// ===== Helpers =====
function formatNumber(num) {
  return new Intl.NumberFormat('fa-IR').format(num || 0);
}

function getStatusLabel(status) {
  return status === 'active' ? 'فعال' : 'غیرفعال';
}

// ===== Render Drivers =====
function renderDrivers(data = filteredDrivers) {
  if (!driversGrid) return;

  driversGrid.innerHTML = '';

  if (data.length === 0) {
    driversGrid.innerHTML = `
      <div class="table-empty" style="grid-column: 1 / -1; padding: 48px;">
        <i class="bi bi-people" style="font-size: 2.5rem; opacity: 0.4;"></i>
        <p>راننده‌ای یافت نشد</p>
      </div>
    `;
    return;
  }

  data.forEach((driver, index) => {
    const card = document.createElement('div');
    card.className = 'driver-card';
    card.style.animationDelay = `${index * 0.05}s`;

    card.innerHTML = `
      <div class="driver-card-header">
        <div class="driver-avatar">${driver.name.charAt(0)}</div>
        <div class="driver-main-info">
          <h3>${driver.name}</h3>
          <span class="driver-plate">${driver.plate || '—'}</span>
        </div>
        <span class="status-badge ${driver.status}">${getStatusLabel(driver.status)}</span>
      </div>

      <div class="driver-stats">
        <div class="stat-item">
          <span class="stat-value">${formatNumber(driver.deliveries)}</span>
          <span class="stat-label">پخش</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${formatNumber(driver.distance)}</span>
          <span class="stat-label">کیلومتر</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${formatNumber(driver.customers)}</span>
          <span class="stat-label">مشتری</span>
        </div>
      </div>

      <div class="driver-actions">
        <a href="driver-details.html?id=${driver.id}" class="btn btn-secondary btn-sm">
          <i class="bi bi-eye"></i>
          مشاهده پرونده
        </a>
        <button class="btn-icon edit" title="ویرایش" onclick="editDriver(${driver.id})">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn-icon delete" title="حذف" onclick="deleteDriver(${driver.id})">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;

    driversGrid.appendChild(card);
  });
}

// ===== Filter =====
function applyFilters() {
  const search = (searchInput?.value || '').trim().toLowerCase();
  const status = filterStatus?.value || '';

  filteredDrivers = drivers.filter(d => {
    const matchSearch = !search ||
      d.name.toLowerCase().includes(search) ||
      (d.plate && d.plate.includes(search)) ||
      (d.phone && d.phone.includes(search));

    const matchStatus = !status || d.status === status;
    return matchSearch && matchStatus;
  });

  renderDrivers(filteredDrivers);
}

// ===== Modal =====
function openDriverModal(editData = null) {
  if (!driverModal) {
    console.error('مودال راننده پیدا نشد. HTML مودال را چک کن.');
    return;
  }

  if (editData) {
    editingId = editData.id;
    if (driverModalTitle) {
      driverModalTitle.innerHTML = `<i class="bi bi-pencil-square"></i> ویرایش راننده`;
    }
    document.getElementById('drvName').value = editData.name || '';
    document.getElementById('drvPhone').value = editData.phone || '';
    document.getElementById('drvPlate').value = editData.plate || '';
    document.getElementById('drvStatus').value = editData.status || 'active';
    document.getElementById('drvDeliveries').value = editData.deliveries || 0;
    document.getElementById('drvDistance').value = editData.distance || 0;
    document.getElementById('drvCustomers').value = editData.customers || 0;
  } else {
    editingId = null;
    if (driverModalTitle) {
      driverModalTitle.innerHTML = `<i class="bi bi-plus-circle"></i> افزودن راننده جدید`;
    }
    if (driverForm) driverForm.reset();
    document.getElementById('drvStatus').value = 'active';
    document.getElementById('drvDeliveries').value = 0;
    document.getElementById('drvDistance').value = 0;
    document.getElementById('drvCustomers').value = 0;
  }

  driverModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeDriverModalFunc() {
  if (!driverModal) return;
  driverModal.classList.remove('show');
  document.body.style.overflow = '';
  if (driverForm) driverForm.reset();
  editingId = null;
}

// ===== Actions =====
function editDriver(id) {
  const item = drivers.find(d => d.id === id);
  if (item) openDriverModal(item);
}

function deleteDriver(id) {
  if (!confirm('آیا از حذف این راننده مطمئن هستید؟')) return;

  const index = drivers.findIndex(d => d.id === id);
  if (index > -1) {
    drivers.splice(index, 1);
    applyFilters();
  }
}

// ===== Events =====
if (searchInput) {
  searchInput.addEventListener('input', applyFilters);
}

if (filterStatus) {
  filterStatus.addEventListener('change', applyFilters);
}

if (addDriverBtn) {
  addDriverBtn.addEventListener('click', () => openDriverModal());
}

if (closeDriverModal) {
  closeDriverModal.addEventListener('click', closeDriverModalFunc);
}

if (cancelDriverModal) {
  cancelDriverModal.addEventListener('click', closeDriverModalFunc);
}

if (driverModal) {
  driverModal.addEventListener('click', (e) => {
    if (e.target === driverModal) closeDriverModalFunc();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && driverModal && driverModal.classList.contains('show')) {
    closeDriverModalFunc();
  }
});

if (driverForm) {
  driverForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById('drvName').value.trim(),
      phone: document.getElementById('drvPhone').value.trim(),
      plate: document.getElementById('drvPlate').value.trim(),
      status: document.getElementById('drvStatus').value,
      deliveries: Number(document.getElementById('drvDeliveries').value) || 0,
      distance: Number(document.getElementById('drvDistance').value) || 0,
      customers: Number(document.getElementById('drvCustomers').value) || 0
    };

    if (editingId) {
      const index = drivers.findIndex(d => d.id === editingId);
      if (index > -1) {
        drivers[index] = { ...drivers[index], ...formData };
      }
      alert('راننده با موفقیت ویرایش شد');
    } else {
      drivers.unshift({
        id: Date.now(),
        ...formData
      });
      alert('راننده با موفقیت ثبت شد');
    }

    applyFilters();
    closeDriverModalFunc();
  });
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  applyFilters();
});