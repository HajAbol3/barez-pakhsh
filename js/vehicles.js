// ===== Sample Data =====
const vehicles = [
  {
    id: 1,
    plate: '۶۵ ایران ۴۶۳ ع ۹۶',
    type: 'نیسان',
    driver: 'ابوذر دهقان اناری',
    distance: 90000,
    customers: 5590,
    lastRepair: '۱۴۰۵/۰۵/۱۲',
    insurance: 'expiring',
    insuranceDays: 18,
    status: 'active'
  },
  {
    id: 2,
    plate: '۱۲۳ ب ۴۵',
    type: 'پراید',
    driver: 'علی محمدی',
    distance: 81407,
    customers: 4386,
    lastRepair: '۱۴۰۵/۰۶/۰۱',
    insurance: 'valid',
    insuranceDays: 145,
    status: 'active'
  },
  {
    id: 3,
    plate: '۷۸۹ الف ۱۲',
    type: 'پژو',
    driver: 'رضا کریمی',
    distance: 62340,
    customers: 3120,
    lastRepair: '۱۴۰۵/۰۴/۲۰',
    insurance: 'valid',
    insuranceDays: 210,
    status: 'active'
  },
  {
    id: 4,
    plate: '۴۵۶ ج ۷۸',
    type: 'وانت',
    driver: 'حسین رضایی',
    distance: 58920,
    customers: 2875,
    lastRepair: '۱۴۰۵/۰۶/۱۵',
    insurance: 'expiring',
    insuranceDays: 25,
    status: 'active'
  },
  {
    id: 5,
    plate: '۳۲۱ د ۹۰',
    type: 'نیسان',
    driver: 'محمد احمدی',
    distance: 41250,
    customers: 1980,
    lastRepair: '۱۴۰۵/۰۳/۰۸',
    insurance: 'expired',
    insuranceDays: -12,
    status: 'inactive'
  },
  {
    id: 6,
    plate: '۶۵۴ هـ ۲۱',
    type: 'پراید',
    driver: 'سعید نوری',
    distance: 35680,
    customers: 1650,
    lastRepair: '۱۴۰۵/۰۶/۱۰',
    insurance: 'valid',
    insuranceDays: 98,
    status: 'repair'
  },
  {
    id: 7,
    plate: '۹۸۷ و ۳۴',
    type: 'پژو',
    driver: 'امیر حسینی',
    distance: 67890,
    customers: 3450,
    lastRepair: '۱۴۰۵/۰۵/۲۵',
    insurance: 'valid',
    insuranceDays: 180,
    status: 'active'
  },
  {
    id: 8,
    plate: '۱۴۷ ی ۵۶',
    type: 'وانت',
    driver: 'مهدی کاظمی',
    distance: 29840,
    customers: 1420,
    lastRepair: '۱۴۰۵/۰۲/۱۴',
    insurance: 'expiring',
    insuranceDays: 9,
    status: 'active'
  }
];

let currentPage = 1;
const rowsPerPage = 8;
let filteredVehicles = [...vehicles];
let editingId = null;

// ===== DOM =====
const vehiclesBody = document.getElementById('vehiclesBody');
const searchInput = document.getElementById('searchVehicle');
const filterInsurance = document.getElementById('filterInsurance');
const filterStatus = document.getElementById('filterStatus');
const tableInfo = document.getElementById('tableInfo');
const pagination = document.getElementById('pagination');
const addVehicleBtn = document.getElementById('addVehicleBtn');

const vehicleModal = document.getElementById('vehicleModal');
const closeVehicleModal = document.getElementById('closeVehicleModal');
const cancelVehicleModal = document.getElementById('cancelVehicleModal');
const vehicleForm = document.getElementById('vehicleForm');
const vehicleModalTitle = document.getElementById('vehicleModalTitle');

// ===== Helpers =====
function formatNumber(num) {
  return new Intl.NumberFormat('fa-IR').format(num || 0);
}

function getInsuranceLabel(status, days) {
  if (status === 'valid') return 'معتبر';
  if (status === 'expiring') return `${days != null ? days : '—'} روز مانده`;
  return 'منقضی شده';
}

function getStatusLabel(status) {
  const map = {
    active: 'فعال',
    inactive: 'غیرفعال',
    repair: 'در تعمیر'
  };
  return map[status] || status;
}

// ===== Update Stats =====
function updateStats() {
  const elTotal = document.getElementById('totalVehicles');
  const elActive = document.getElementById('activeVehicles');
  const elExpiring = document.getElementById('expiringInsurance');
  const elRepair = document.getElementById('needRepair');

  if (elTotal) elTotal.textContent = formatNumber(vehicles.length);
  if (elActive) elActive.textContent = formatNumber(vehicles.filter(v => v.status === 'active').length);
  if (elExpiring) elExpiring.textContent = formatNumber(vehicles.filter(v => v.insurance === 'expiring').length);
  if (elRepair) elRepair.textContent = formatNumber(vehicles.filter(v => v.status === 'repair').length);
}

// ===== Render Table =====
function renderTable() {
  if (!vehiclesBody) return;

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = filteredVehicles.slice(start, end);

  vehiclesBody.innerHTML = '';

  if (pageData.length === 0) {
    vehiclesBody.innerHTML = `
      <tr>
        <td colspan="10">
          <div class="table-empty">
            <i class="bi bi-truck"></i>
            <p>خودرویی یافت نشد</p>
          </div>
        </td>
      </tr>
    `;
  } else {
    pageData.forEach((vehicle, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${formatNumber(start + index + 1)}</td>
        <td><strong>${vehicle.plate}</strong></td>
        <td>${vehicle.type}</td>
        <td>${vehicle.driver || '—'}</td>
        <td>${formatNumber(vehicle.distance)} KM</td>
        <td>${formatNumber(vehicle.customers)}</td>
        <td>${vehicle.lastRepair || '—'}</td>
        <td>
          <span class="insurance-badge ${vehicle.insurance}">
            ${getInsuranceLabel(vehicle.insurance, vehicle.insuranceDays)}
          </span>
        </td>
        <td>
          <span class="vehicle-status ${vehicle.status}">
            ${getStatusLabel(vehicle.status)}
          </span>
        </td>
        <td>
          <div class="table-actions">
            <a href="vehicle-details.html?id=${vehicle.id}" class="btn-icon view" title="مشاهده پرونده">
              <i class="bi bi-eye"></i>
            </a>
            <button class="btn-icon edit" title="ویرایش" onclick="editVehicle(${vehicle.id})">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn-icon delete" title="حذف" onclick="deleteVehicle(${vehicle.id})">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      `;
      vehiclesBody.appendChild(row);
    });
  }

  if (tableInfo) {
    const total = filteredVehicles.length;
    const showingStart = total === 0 ? 0 : start + 1;
    const showingEnd = Math.min(end, total);
    tableInfo.textContent = `نمایش ${formatNumber(showingStart)} تا ${formatNumber(showingEnd)} از ${formatNumber(total)} خودرو`;
  }

  renderPagination();
}

// ===== Pagination =====
function renderPagination() {
  if (!pagination) return;

  const totalPages = Math.ceil(filteredVehicles.length / rowsPerPage) || 1;
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
  const search = (searchInput?.value || '').trim().toLowerCase();
  const insurance = filterInsurance?.value || '';
  const status = filterStatus?.value || '';

  filteredVehicles = vehicles.filter(v => {
    const matchSearch = !search ||
      v.plate.includes(search) ||
      (v.driver && v.driver.toLowerCase().includes(search)) ||
      (v.type && v.type.toLowerCase().includes(search));

    const matchInsurance = !insurance || v.insurance === insurance;
    const matchStatus = !status || v.status === status;

    return matchSearch && matchInsurance && matchStatus;
  });

  currentPage = 1;
  renderTable();
}

// ===== Modal =====
function openVehicleModal(editData = null) {
  if (!vehicleModal) {
    console.error('مودال خودرو پیدا نشد. HTML مودال را چک کن.');
    return;
  }

  if (editData) {
    editingId = editData.id;
    if (vehicleModalTitle) {
      vehicleModalTitle.innerHTML = `<i class="bi bi-pencil-square"></i> ویرایش خودرو`;
    }
    document.getElementById('vehPlate').value = editData.plate || '';
    document.getElementById('vehType').value = editData.type || '';
    document.getElementById('vehDriver').value = editData.driver || '';
    document.getElementById('vehStatus').value = editData.status || 'active';
    document.getElementById('vehDistance').value = editData.distance || 0;
    document.getElementById('vehCustomers').value = editData.customers || 0;
    document.getElementById('vehLastRepair').value = editData.lastRepair || '';
    document.getElementById('vehInsurance').value = editData.insurance || 'valid';
  } else {
    editingId = null;
    if (vehicleModalTitle) {
      vehicleModalTitle.innerHTML = `<i class="bi bi-plus-circle"></i> افزودن خودرو جدید`;
    }
    if (vehicleForm) vehicleForm.reset();
    document.getElementById('vehStatus').value = 'active';
    document.getElementById('vehInsurance').value = 'valid';
    document.getElementById('vehDistance').value = 0;
    document.getElementById('vehCustomers').value = 0;
  }

  vehicleModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeVehicleModalFunc() {
  if (!vehicleModal) return;
  vehicleModal.classList.remove('show');
  document.body.style.overflow = '';
  if (vehicleForm) vehicleForm.reset();
  editingId = null;
}

// ===== Actions =====
function editVehicle(id) {
  const item = vehicles.find(v => v.id === id);
  if (item) openVehicleModal(item);
}

function deleteVehicle(id) {
  if (!confirm('آیا از حذف این خودرو مطمئن هستید؟')) return;

  const index = vehicles.findIndex(v => v.id === id);
  if (index > -1) {
    vehicles.splice(index, 1);
    applyFilters();
    updateStats();
  }
}

// ===== Events =====
if (searchInput) searchInput.addEventListener('input', applyFilters);
if (filterInsurance) filterInsurance.addEventListener('change', applyFilters);
if (filterStatus) filterStatus.addEventListener('change', applyFilters);

if (addVehicleBtn) {
  addVehicleBtn.addEventListener('click', () => openVehicleModal());
}

if (closeVehicleModal) closeVehicleModal.addEventListener('click', closeVehicleModalFunc);
if (cancelVehicleModal) cancelVehicleModal.addEventListener('click', closeVehicleModalFunc);

if (vehicleModal) {
  vehicleModal.addEventListener('click', (e) => {
    if (e.target === vehicleModal) closeVehicleModalFunc();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && vehicleModal && vehicleModal.classList.contains('show')) {
    closeVehicleModalFunc();
  }
});

if (vehicleForm) {
  vehicleForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
      plate: document.getElementById('vehPlate').value.trim(),
      type: document.getElementById('vehType').value,
      driver: document.getElementById('vehDriver').value || '—',
      status: document.getElementById('vehStatus').value,
      distance: Number(document.getElementById('vehDistance').value) || 0,
      customers: Number(document.getElementById('vehCustomers').value) || 0,
      lastRepair: document.getElementById('vehLastRepair').value.trim() || '—',
      insurance: document.getElementById('vehInsurance').value,
      insuranceDays: document.getElementById('vehInsurance').value === 'expiring' ? 30 :
                     document.getElementById('vehInsurance').value === 'expired' ? -1 : 180
    };

    if (editingId) {
      const index = vehicles.findIndex(v => v.id === editingId);
      if (index > -1) {
        vehicles[index] = { ...vehicles[index], ...formData };
      }
      alert('خودرو با موفقیت ویرایش شد');
    } else {
      vehicles.unshift({
        id: Date.now(),
        ...formData
      });
      alert('خودرو با موفقیت ثبت شد');
    }

    applyFilters();
    updateStats();
    closeVehicleModalFunc();
  });
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  updateStats();
  renderTable();
});